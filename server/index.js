import { createRequire } from "node:module";
import { randomUUID } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { MercadoPagoConfig, Payment, Preference } from "mercadopago";
import {
  FREE_SHIPPING_FROM,
  hasForbiddenCardPayload,
  isHttpsUrl,
  isOriginAllowed,
  makeOrderId,
  paymentMode,
  preferenceItems,
  publicErrorCode,
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
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; img-src 'self' data: https:; media-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; script-src 'self'; connect-src 'self' https:; frame-src https://www.youtube.com https://www.youtube-nocookie.com https://www.mercadopago.com https://www.mercadopago.com.br https://http2.mlstatic.com"
  );
  if (req.secure || req.headers["x-forwarded-proto"] === "https") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});
app.use(express.json({ limit: "32kb" }));
app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin, { allowedOrigins, mode: MODE })) {
        return callback(null, true);
      }
      return callback(new Error("origin_not_allowed"));
    },
  })
);
if (MODE === "live" && !allowedOrigins.length) {
  console.warn("ALLOWED_ORIGINS vazio em modo live: o navegador não poderá chamar a API.");
}

const hits = new Map();
function rateLimit(req, res, next) {
  const ip = req.ip || "local";
  const now = Date.now();
  const windowMs = 60_000;
  const max = req.path.startsWith("/api/checkout") || req.path.startsWith("/api/order") ? 12 : 30;
  const current = hits.get(ip) || [];
  const recent = current.filter((time) => now - time < windowMs);
  recent.push(now);
  hits.set(ip, recent);
  if (recent.length > max) {
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

function siteUrl(req) {
  const fromEnv = String(process.env.PUBLIC_SITE_URL || "").replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  const proto = req.get("x-forwarded-proto") || req.protocol || "http";
  const host = req.get("host") || `127.0.0.1:${PORT}`;
  return `${String(proto).split(",")[0]}://${host}`;
}

function mpClient() {
  return new MercadoPagoConfig({ accessToken: MP_ACCESS_TOKEN });
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, demo: DEMO_PAYMENTS, sandbox: SANDBOX, mode: MODE });
});

app.get("/api/config", (_req, res) => {
  res.json({
    demo: DEMO_PAYMENTS,
    sandbox: SANDBOX,
    mode: MODE,
    mpPublicKey: "",
    checkout: "pro",
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

app.post("/api/checkout", rateLimit, async (req, res) => {
  try {
    if (hasForbiddenCardPayload(req.body)) {
      return res.status(400).json({ error: "card_data_not_allowed" });
    }
    const quote = quoteFromBody(req.body || {});
    const requireAddress = quote.hasPhysical && quote.shippingMethod === "delivery";
    const payer = validatePayer(req.body?.payer || {}, { requireAddress });
    const orderId = makeOrderId();
    const shop = siteUrl(req);
    const back = `${shop}/index.html`;
    const items = preferenceItems(quote);

    if (DEMO_PAYMENTS) {
      return res.json({
        demo: true,
        orderId,
        total: quote.total,
        shipping: quote.shipping,
        checkoutUrl: `${back}?mp=demo&external_reference=${encodeURIComponent(orderId)}`,
      });
    }

    const names = payer.name.split(" ");
    const preference = new Preference(mpClient());
    const body = {
      items,
      payer: {
        name: names[0],
        surname: names.slice(1).join(" ") || names[0],
        email: payer.email,
        phone: { area_code: payer.phone.slice(0, 2), number: payer.phone.slice(2) },
        identification: { type: "CPF", number: payer.cpf },
        address: requireAddress
          ? {
              zip_code: payer.cep,
              street_name: payer.street,
              street_number: payer.number,
            }
          : undefined,
      },
      back_urls: {
        success: back,
        failure: back,
        pending: back,
      },
      ...(isHttpsUrl(back) ? { auto_return: "approved" } : {}),
      external_reference: orderId,
      statement_descriptor: "FAMILIA CEME",
      binary_mode: false,
      payment_methods: {
        installments: MAX_INSTALLMENTS,
      },
      metadata: {
        order_id: orderId,
        phone: payer.phone,
        shipping_method: quote.shippingMethod,
      },
    };
    const notify = String(process.env.NOTIFICATION_URL || "").trim();
    if (notify.startsWith("https://")) {
      body.notification_url = notify;
    }

    const result = await preference.create({
      body,
      requestOptions: {
        idempotencyKey: req.body?.idempotencyKey || randomUUID(),
      },
    });

    const checkoutUrl = result.init_point;
    if (!checkoutUrl) {
      return res.status(502).json({ error: "checkout_failed" });
    }

    return res.json({
      orderId,
      total: quote.total,
      shipping: quote.shipping,
      preferenceId: result.id,
      checkoutUrl,
    });
  } catch (err) {
    const code = publicErrorCode(err);
    const status =
      code === "invalid_payer" ||
      code === "empty_cart" ||
      code === "invalid_item" ||
      code === "invalid_qty" ||
      code === "card_data_not_allowed"
        ? 400
        : 500;
    if (status === 500) {
      console.error("checkout_failed", code);
    }
    return res.status(status).json({
      error: code === "pay_failed" ? "checkout_failed" : code,
      fields: err.fields || undefined,
    });
  }
});

app.get("/api/order/:orderId", rateLimit, async (req, res) => {
  const orderId = String(req.params.orderId || "").slice(0, 80);
  if (!/^CEME-[A-Z0-9-]+$/i.test(orderId)) {
    return res.status(400).json({ error: "invalid_payment" });
  }
  if (DEMO_PAYMENTS) {
    return res.json({ status: "approved", demo: true, orderId });
  }
  try {
    const paymentId = String(req.query.payment_id || "").replace(/\D/g, "");
    const payment = new Payment(mpClient());
    if (paymentId) {
      const result = await payment.get({ id: paymentId });
      if (result.external_reference && result.external_reference !== orderId) {
        return res.status(404).json({ error: "not_found" });
      }
      return res.json({
        status: result.status || "unknown",
        orderId: result.external_reference || orderId,
      });
    }
    const found = await payment.search({
      options: {
        external_reference: orderId,
        sort: "date_created",
        criteria: "desc",
      },
    });
    const results = found.results || [];
    const approved = results.find((item) => item.status === "approved");
    const current = approved || results[0];
    if (!current) {
      return res.json({ status: "pending", orderId });
    }
    return res.json({
      status: current.status || "unknown",
      orderId: current.external_reference || orderId,
    });
  } catch {
    return res.status(404).json({ error: "not_found" });
  }
});

app.post("/api/webhooks/mercadopago", (_req, res) => {
  res.status(200).json({ ok: true });
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
