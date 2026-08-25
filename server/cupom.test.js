import test from "node:test";
import assert from "node:assert/strict";
import { buildCupomPdf, cupomFilename, trackingIdOf } from "./cupom.js";

test("o numero de identificacao do cupom e o rastreio CEME", () => {
  assert.equal(trackingIdOf({ orderId: "ceme-abc-1" }), "CEME-ABC-1");
  assert.equal(cupomFilename("CEME-ABC-1"), "cupom-CEME-ABC-1.pdf");
});

test("gera PDF com o numero de rastreio do pedido", async () => {
  const pdf = await buildCupomPdf({
    orderId: "CEME-TEST-PDF",
    customerName: "Maria Silva",
    shippingMethod: "delivery",
    addressText: "CLN 211, 211. Brasilia-DF",
    items: [{ name: "NeuroCodigos", volume: "60ml", qty: 1 }],
    total: 0.1,
    createdAt: 1,
  });
  assert.equal(pdf.subarray(0, 5).toString("utf8"), "%PDF-");
  assert.match(pdf.toString("latin1"), /Cupom CEME-TEST-PDF/);
});
