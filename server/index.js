import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import {
  demoCardDecision,
  installmentOptions,
  makeOrderId,
  quoteCart,
  validatePayer,
} from "./lib.js";

dotenv.config();

const require = createRequire(import.meta.url);
const { PRODUCTS } = require("../produtos.js");

const PORT = Number(process.env.PORT) || 3001;
const SHIPPING_FEE = Number(process.env.SHIPPING_FEE || 0);
const MAX_INSTALLMENTS = Number(process.env.MAX_INSTALLMENTS || 3);
const DEMO_PAYMENTS =
  String(process.env.DEMO_PAYMENTS || "").toLowerCase() === "true" ||
  !process.env.MP_ACCESS_TOKEN;
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY || "";

const allowedOrigins = String(process.env.ALLOWED_ORIGINS || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const app = express();
app.set("trust proxy", 1);
app.use(express.json({ limit: "32kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (!allowedOrigins.length) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("origin_not_allowed"));
    },
  })
);

const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || "local";
  const now = Date.now();
  const windowMs = 60_000;
  const current = hits.get(ip) || [];
  const recent = current.filter((time) => now - time < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (recent.length > 30) {
    return res.status(429).json({ error: "rate_limited" });
  }
  return next();
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, demo: DEMO_PAYMENTS });
});

app.get("/api/config", (_req, res) => {
  res.json({
    demo: DEMO_PAYMENTS,
    mpPublicKey: MP_PUBLIC_KEY,
    shippingFee: SHIPPING_FEE,
    maxInstallments: MAX_INSTALLMENTS,
  });
});

app.post("/api/pay", rateLimit, async (req, res) => {
  try {
    const payer = validatePayer(req.body?.payer || {});
    const quote = quoteCart(PRODUCTS, req.body?.items || [], SHIPPING_FEE);
    const installments = Number(req.body?.installments || 1);
    const options = installmentOptions(quote.total, MAX_INSTALLMENTS);
    if (!options.some((option) => option.n === installments)) {
      return res.status(400).json({ error: "invalid_installments" });
    }

    const orderId = makeOrderId();
    const description = quote.lines
      .map((line) => `${line.name} x${line.qty}`)
      .join(", ")
      .slice(0, 200);

    if (DEMO_PAYMENTS) {
      const decision = demoCardDecision(req.body?.card?.number || "4111111111111111");
      if (decision === "invalid") {
        return res.status(400).json({ error: "invalid_card", orderId });
      }
      if (decision === "rejected") {
        return res.status(402).json({ error: "rejected", status: "rejected", orderId });
      }
      return res.json({
        status: "approved",
        demo: true,
        orderId,
        total: quote.total,
        installments,
      });
    }

    const token = String(req.body?.token || "");
    if (!token) {
      return res.status(400).json({ error: "missing_token" });
    }

    const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
    const payment = new Payment(client);
    const result = await payment.create({
      body: {
        transaction_amount: Number(quote.total.toFixed(2)),
        token,
        description: `Pedido ${orderId} · ${description}`,
        installments,
        payment_method_id: req.body?.paymentMethodId || undefined,
        issuer_id: req.body?.issuerId || undefined,
        payer: {
          email: payer.email,
          first_name: payer.name.split(" ")[0],
          last_name: payer.name.split(" ").slice(1).join(" ") || payer.name,
          identification: {
            type: "CPF",
            number: payer.cpf,
          },
          address: {
            zip_code: payer.cep,
            street_name: payer.street,
            street_number: payer.number,
            neighborhood: payer.neighborhood,
            city: payer.city,
            federal_unit: payer.state,
          },
        },
        additional_info: {
          items: quote.lines.map((line) => ({
            id: line.id,
            title: line.name,
            description: `${line.name} ${line.volume}`,
            quantity: line.qty,
            unit_price: line.unitPrice,
            category_id: "others",
          })),
        },
        external_reference: orderId,
        metadata: {
          order_id: orderId,
          phone: payer.phone,
          complement: payer.complement,
        },
      },
      requestOptions: {
        idempotencyKey: req.body?.idempotencyKey || randomUUID(),
      },
    });

    const status = result.status || "unknown";
    if (status === "rejected" || status === "cancelled") {
      return res.status(402).json({
        error: "rejected",
        status,
        orderId,
        detail: result.status_detail,
      });
    }

    return res.json({
      status,
      orderId,
      total: quote.total,
      installments,
      paymentId: result.id,
      detail: result.status_detail,
    });
  } catch (err) {
    const code = err.code || "pay_failed";
    const status =
      code === "invalid_payer" ||
      code === "empty_cart" ||
      code === "invalid_item" ||
      code === "invalid_qty"
        ? 400
        : 500;
    if (status === 500) {
      console.error(err);
    }
    return res.status(status).json({
      error: code,
      fields: err.fields || undefined,
    });
  }
});

app.listen(PORT, () => {
  console.log(`CEME checkout API on :${PORT} (${DEMO_PAYMENTS ? "demo" : "Mercado Pago"})`);
});
