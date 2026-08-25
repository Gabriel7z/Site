import test from "node:test";
import assert from "node:assert/strict";
import {
  shippedMessage,
  shippedEmailSubject,
  whatsappSendUrl,
  gmailConfigured,
  notifyShipped,
} from "./notify.js";

test("monta o aviso de envio com rastreio", () => {
  const text = shippedMessage({
    name: "Maria Silva",
    orderId: "CEME-1",
    trackingCode: "AB123456789BR",
    trackingUrl: "https://rastreamento.correios.com.br/app/index.php?objetos=AB123456789BR",
  });
  assert.match(text, /seu pedido CEME-1 acabou de ser enviado/);
  assert.match(text, /AB123456789BR/);
  assert.equal(shippedEmailSubject("CEME-1"), "Seu pedido CEME-1 acabou de ser enviado");
});

test("abre o WhatsApp do cliente com a mensagem pronta", () => {
  const url = whatsappSendUrl("61999991111", "seu pedido acabou de ser enviado");
  assert.match(url, /^https:\/\/wa\.me\/5561999991111\?text=/);
  assert.equal(whatsappSendUrl("12", "x"), "");
});

test("manda e-mail e devolve o link do WhatsApp ao marcar enviado", async () => {
  const sent = [];
  const result = await notifyShipped(
    {
      orderId: "CEME-2",
      customer: { name: "Ana", email: "ana@email.com", phone: "61988887777" },
    },
    {
      env: {},
      sendEmail: async (payload) => sent.push(payload),
    }
  );
  assert.equal(sent.length, 1);
  assert.equal(sent[0].to, "ana@email.com");
  assert.match(sent[0].text, /seu pedido CEME-2 acabou de ser enviado/);
  assert.equal(result.email.sent, true);
  assert.equal(result.whatsapp.sent, false);
  assert.match(result.whatsapp.url, /wa\.me\/5561988887777/);
  assert.equal(gmailConfigured({}), false);
  assert.equal(gmailConfigured({ GMAIL_USER: "a@b.c", GMAIL_APP_PASSWORD: "x" }), true);
});
