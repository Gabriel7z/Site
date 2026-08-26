import { onlyDigits } from "./lib.js";

const STORE_NAME = "Família CEME";

export function shippedMessage({ name = "", orderId = "", trackingCode = "", trackingUrl = "" } = {}) {
  const who = String(name || "").trim().split(/\s+/)[0] || "olá";
  const id = String(orderId || "").trim();
  const lines = [`Olá ${who}, seu pedido ${id} acabou de ser enviado.`];
  const tracking = String(trackingCode || "").trim();
  if (tracking) {
    lines.push(`Código dos Correios: ${tracking}`);
    if (trackingUrl) lines.push(String(trackingUrl));
  }
  lines.push("", STORE_NAME);
  return lines.join("\n");
}

export function shippedEmailSubject(orderId) {
  return `Seu pedido ${orderId} acabou de ser enviado`;
}

export function paidMessage({ name = "", orderId = "", total = 0, trackingUrl = "" } = {}) {
  const who = String(name || "").trim().split(/\s+/)[0] || "olá";
  const id = String(orderId || "").trim();
  const money = Number(total || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const lines = [
    `Olá ${who}, recebemos o pagamento do seu pedido ${id} na ${STORE_NAME}.`,
    `Total: ${money}.`,
  ];
  if (trackingUrl) lines.push(`Acompanhe o envio: ${trackingUrl}`);
  lines.push("", STORE_NAME);
  return lines.join("\n");
}

export function paidEmailSubject(orderId) {
  return `Recebemos o pagamento do seu pedido ${orderId}`;
}

export function newSaleMessage({ name = "", orderId = "", total = 0 } = {}) {
  const who = String(name || "").trim() || "Cliente";
  const id = String(orderId || "").trim();
  const money = Number(total || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  return `Nova venda ${id} — ${who} — ${money}.`;
}

export function whatsappDigits(phone) {
  const digits = onlyDigits(phone);
  if (digits.length < 10) return "";
  if (digits.startsWith("55") && digits.length >= 12) return digits;
  return `55${digits}`;
}

export function whatsappSendUrl(phone, text) {
  const digits = whatsappDigits(phone);
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}

export function gmailConfigured(env = process.env) {
  return Boolean(String(env.GMAIL_USER || "").trim() && String(env.GMAIL_APP_PASSWORD || "").trim());
}

export function whatsappApiConfigured(env = process.env) {
  return Boolean(String(env.WHATSAPP_TOKEN || "").trim() && String(env.WHATSAPP_PHONE_ID || "").trim());
}

export async function sendShippedEmail({
  to,
  subject,
  text,
  env = process.env,
  send,
} = {}) {
  const email = String(to || "").trim().toLowerCase();
  if (!email) return { sent: false, reason: "no_email" };
  if (typeof send === "function") {
    await send({ to: email, subject, text });
    return { sent: true, reason: "ok" };
  }
  if (!gmailConfigured(env)) return { sent: false, reason: "not_configured" };

  const nodemailer = (await import("nodemailer")).default;
  const user = String(env.GMAIL_USER || "").trim();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass: String(env.GMAIL_APP_PASSWORD || "").trim(),
    },
  });
  await transporter.sendMail({
    from: `"${STORE_NAME}" <${user}>`,
    to: email,
    subject,
    text,
  });
  return { sent: true, reason: "ok" };
}

export async function sendWhatsAppApi({
  phone,
  text,
  env = process.env,
  fetchImpl = fetch,
} = {}) {
  const url = whatsappSendUrl(phone, text);
  const digits = whatsappDigits(phone);
  if (!digits) return { sent: false, reason: "no_phone", url: "" };
  if (!whatsappApiConfigured(env)) return { sent: false, reason: "not_configured", url };

  const phoneId = String(env.WHATSAPP_PHONE_ID || "").trim();
  const token = String(env.WHATSAPP_TOKEN || "").trim();
  const res = await fetchImpl(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: digits,
      type: "text",
      text: { body: text, preview_url: true },
    }),
  });
  if (!res.ok) {
    return { sent: false, reason: "api_failed", url };
  }
  return { sent: true, reason: "ok", url };
}

export async function notifyPaid(order, extras = {}) {
  const trackingUrl = extras.trackingUrl || "";
  const text = paidMessage({
    name: order.customer?.name || order.customerName || "",
    orderId: order.orderId,
    total: order.total,
    trackingUrl,
  });
  const subject = paidEmailSubject(order.orderId);
  let email = { sent: false, reason: "no_email" };
  let whatsapp = { sent: false, reason: "no_phone", url: "" };
  let store = { sent: false, reason: "no_store" };
  try {
    email = await sendShippedEmail({
      to: order.customer?.email,
      subject,
      text,
      env: extras.env,
      send: extras.sendEmail,
    });
  } catch {
    email = { sent: false, reason: "send_failed" };
  }
  try {
    whatsapp = await sendWhatsAppApi({
      phone: order.customer?.phone || order.phone,
      text,
      env: extras.env,
      fetchImpl: extras.fetchImpl,
    });
  } catch {
    whatsapp = {
      sent: false,
      reason: "send_failed",
      url: whatsappSendUrl(order.customer?.phone || order.phone, text),
    };
  }
  const storePhone = String((extras.env || process.env).STORE_ALERT_PHONE || "").trim();
  const storeEmail = String((extras.env || process.env).GMAIL_USER || "").trim();
  const saleText = newSaleMessage({
    name: order.customer?.name || order.customerName || "",
    orderId: order.orderId,
    total: order.total,
  });
  try {
    if (storePhone) {
      store = await sendWhatsAppApi({
        phone: storePhone,
        text: saleText,
        env: extras.env,
        fetchImpl: extras.fetchImpl,
      });
    } else if (storeEmail) {
      store = await sendShippedEmail({
        to: storeEmail,
        subject: saleText,
        text: `${saleText}\n${text}`,
        env: extras.env,
        send: extras.sendEmail,
      });
    }
  } catch {
    store = { sent: false, reason: "send_failed" };
  }
  return { text, subject, email, whatsapp, store };
}

export async function notifyShipped(order, extras = {}) {
  const trackingCode = extras.trackingCode || order.trackingCode || "";
  const trackingUrl = extras.trackingUrl || "";
  const text = shippedMessage({
    name: order.customer?.name || order.customerName || "",
    orderId: order.orderId,
    trackingCode,
    trackingUrl,
  });
  const subject = shippedEmailSubject(order.orderId);
  let email = { sent: false, reason: "no_email" };
  let whatsapp = { sent: false, reason: "no_phone", url: "" };
  try {
    email = await sendShippedEmail({
      to: order.customer?.email,
      subject,
      text,
      env: extras.env,
      send: extras.sendEmail,
    });
  } catch {
    email = { sent: false, reason: "send_failed" };
  }
  try {
    whatsapp = await sendWhatsAppApi({
      phone: order.customer?.phone || order.phone,
      text,
      env: extras.env,
      fetchImpl: extras.fetchImpl,
    });
  } catch {
    whatsapp = {
      sent: false,
      reason: "send_failed",
      url: whatsappSendUrl(order.customer?.phone || order.phone, text),
    };
  }
  return { text, subject, email, whatsapp };
}
