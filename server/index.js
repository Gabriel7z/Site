import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { MercadoPagoConfig, Payment } from "mercadopago";
import {
  FREE_SHIPPING_FROM,
  demoCardDecision,
  demoPixPayload,
  installmentOptions,
  makeOrderId,
  paymentMode,
  quoteCart,
  validatePayer,
} from "./lib.js";

dotenv.config();

const require = createRequire(import.meta.url);
const { PRODUCTS } = require("../produtos.js");
const SITE_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const PORT = Number(process.env.PORT) || 3001;
const MAX_INSTALLMENTS = Number(process.env.MAX_INSTALLMENTS || 3);
const FREE_FROM = Number(process.env.FREE_SHIPPING_FROM || FREE_SHIPPING_FROM);
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "";
const MP_PUBLIC_KEY = process.env.MP_PUBLIC_KEY || "";
const MODE = paymentMode({
  accessToken: MP_ACCESS_TOKEN,
  demoPayments: process.env.DEMO_PAYMENTS,
  testMode: process.env.MP_TEST_MODE,
});
const DEMO_PAYMENTS = MODE === "demo";
const SANDBOX = MODE === "sandbox";

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
      if (MODE !== "live") return callback(null, true);
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

function quoteFromBody(body) {
  return quoteCart(PRODUCTS, body?.items || [], {
    shippingMethod: body?.shippingMethod,
    cep: body?.payer?.cep || body?.cep,
    freeFrom: FREE_FROM,
  });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, demo: DEMO_PAYMENTS, sandbox: SANDBOX, mode: MODE });
});

app.get("/api/config", (_req, res) => {
  res.json({
    demo: DEMO_PAYMENTS,
    sandbox: SANDBOX,
    mode: MODE,
    mpPublicKey: MP_PUBLIC_KEY,
    maxInstallments: MAX_INSTALLMENTS,
    freeShippingFrom: FREE_FROM,
  });
});

app.post("/api/quote", rateLimit, (req, res) => {
  try {
    const quote = quoteFromBody(req.body || {});
    return res.json(quote);
  } catch (err) {
    return res.status(400).json({ error: err.code || "quote_failed" });
  }
});

app.post("/api/pay", rateLimit, async (req, res) => {
  try {
    const method = String(req.body?.method || "card");
    const quote = quoteFromBody(req.body || {});
    const requireAddress = quote.hasPhysical && quote.shippingMethod === "delivery";
    const payer = validatePayer(req.body?.payer || {}, { requireAddress });
    const orderId = makeOrderId();
    const description = quote.lines
      .map((line) => `${line.name} x${line.qty}`)
      .join(", ")
      .slice(0, 200);

    if (method === "pix") {
      if (DEMO_PAYMENTS) {
        return res.json({
          status: "pending",
          demo: true,
          orderId,
          total: quote.total,
          shipping: quote.shipping,
          pixCopyPaste: demoPixPayload(orderId, quote.total),
        });
      }

      const client = new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
      const payment = new Payment(client);
      const result = await payment.create({
        body: {
          transaction_amount: Number(quote.total.toFixed(2)),
          description: `Pedido ${orderId} · ${description}`,
          payment_method_id: "pix",
          payer: {
            email: payer.email,
            first_name: payer.name.split(" ")[0],
            last_name: payer.name.split(" ").slice(1).join(" ") || payer.name,
            identification: { type: "CPF", number: payer.cpf },
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
            shipping_method: quote.shippingMethod,
          },
        },
        requestOptions: {
          idempotencyKey: req.body?.idempotencyKey || randomUUID(),
        },
      });

      const pix = result.point_of_interaction?.transaction_data || {};
      return res.json({
        status: result.status || "pending",
        orderId,
        total: quote.total,
        shipping: quote.shipping,
        paymentId: result.id,
        pixCopyPaste: pix.qr_code,
        pixQrBase64: pix.qr_code_base64,
      });
    }

    const installments = Number(req.body?.installments || 1);
    const options = installmentOptions(quote.total, MAX_INSTALLMENTS);
    if (!options.some((option) => option.n === installments)) {
      return res.status(400).json({ error: "invalid_installments" });
    }

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
        shipping: quote.shipping,
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
          address: requireAddress
            ? {
                zip_code: payer.cep,
                street_name: payer.street,
                street_number: payer.number,
                neighborhood: payer.neighborhood,
                city: payer.city,
                federal_unit: payer.state,
              }
            : undefined,
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
          shipping_method: quote.shippingMethod,
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
      shipping: quote.shipping,
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

const blockedPrefixes = ["/server", "/.git", "/node_modules"];
app.use((req, res, next) => {
  const p = String(req.path || "").toLowerCase();
  if (blockedPrefixes.some((prefix) => p === prefix || p.startsWith(`${prefix}/`))) {
    return res.status(404).end();
  }
  return next();
});
app.use(express.static(SITE_ROOT, { index: "index.html", extensions: ["html"] }));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Loja CEME em http://127.0.0.1:${PORT}  (mode=${MODE})`);
});
