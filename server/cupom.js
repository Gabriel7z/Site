import fs from "node:fs";
import PDFDocument from "pdfkit";

function money(n) {
  return Number(n || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function shipLabel(method) {
  if (method === "pickup") return "Retirada em Brasilia";
  if (method === "delivery") return "Entrega pelos Correios";
  return "Pedido digital";
}

function when(ts) {
  const date = new Date(Number(ts) || Date.now());
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

export function trackingIdOf(order) {
  return String(order?.orderId || "").trim().toUpperCase();
}

export function cupomFilename(orderId) {
  const id = trackingIdOf({ orderId });
  return `cupom-${id || "CEME"}.pdf`;
}

export function buildCupomPdf(order = {}, { logoPath = "" } = {}) {
  return new Promise((resolve, reject) => {
    const id = trackingIdOf(order);
    const doc = new PDFDocument({ size: "A5", margin: 36, info: { Title: `Cupom ${id}`, Author: "Familia CEME" } });
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    if (logoPath && fs.existsSync(logoPath)) {
      try {
        doc.image(logoPath, 36, 32, { width: 42 });
      } catch {
        /* cupom segue sem logo */
      }
    }

    doc.font("Helvetica-Bold").fontSize(11).fillColor("#4a1024").text("FAMILIA CEME", 88, 36);
    doc.font("Helvetica").fontSize(9).fillColor("#5a5348").text("Cupom de pedido", 88, 52);
    doc.moveDown(2);

    doc.font("Helvetica-Bold").fontSize(9).fillColor("#4a1024").text("NUMERO DE IDENTIFICACAO / RASTREIO");
    doc.font("Helvetica-Bold").fontSize(16).fillColor("#111").text(id || "—");
    doc.font("Helvetica").fontSize(8).fillColor("#5a5348").text(
      "Guarde este numero. E o rastreio da loja: com ele a CEME separa o seu envio e voce acompanha o pedido."
    );
    doc.moveDown(0.8);

    doc.font("Helvetica").fontSize(10).fillColor("#111");
    doc.text(`Cliente: ${order.customerName || "—"}`);
    doc.text(`Data: ${when(order.createdAt)}`);
    doc.text(`Entrega: ${shipLabel(order.shippingMethod)}`);
    if (order.addressText) doc.text(`Endereco: ${order.addressText}`, { width: 340 });
    doc.moveDown(0.6);

    doc.font("Helvetica-Bold").text("Itens");
    doc.font("Helvetica");
    for (const item of order.items || []) {
      const qty = Number(item.qty) || 1;
      const name = String(item.name || "Item");
      const vol = item.volume ? ` (${item.volume})` : "";
      doc.text(`${qty} x ${name}${vol}`);
    }
    doc.moveDown(0.4);
    doc.font("Helvetica-Bold").text(`Total: ${money(order.total)}`);

    if (order.trackingCode && order.trackingCode !== id) {
      doc.moveDown(0.6);
      doc.font("Helvetica").text(`Codigo dos Correios: ${order.trackingCode}`);
    }

    doc.moveDown(1.2);
    doc.font("Helvetica").fontSize(8).fillColor("#5a5348").text(
      "Pagamento no Checkout Pro do Mercado Pago. Este cupom nao substitui a nota fiscal."
    );
    doc.text("Familia CEME — CLN 211, Bloco D, Sala 211 — Asa Norte — Brasilia-DF");
    doc.end();
  });
}
