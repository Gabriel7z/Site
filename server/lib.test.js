import { createRequire } from "node:module";
import test from "node:test";
import assert from "node:assert/strict";
import {
  isCpf,
  luhn,
  quoteCart,
  installmentOptions,
  validatePayer,
  demoCardDecision,
  calcShipping,
  shippingRegion,
  demoPixPayload,
  isPhysicalProduct,
  paymentMode,
  isOriginAllowed,
  hasForbiddenCardPayload,
  publicErrorCode,
  preferenceItems,
} from "./lib.js";

const require = createRequire(import.meta.url);
const { PRODUCTS } = require("../produtos.js");

const products = [
  { id: "neurocodigos", name: "NeuroCódigos", volume: "60ml", price: 120 },
  { id: "bioluz", name: "BioLuz", volume: "60ml", price: 120 },
  { id: "album", name: "Álbum", volume: "digital", price: 8, kind: "musica" },
];

test("aceita CPF válido e rejeita inválido", () => {
  assert.equal(isCpf("529.982.247-25"), true);
  assert.equal(isCpf("111.111.111-11"), false);
  assert.equal(isCpf("123"), false);
});

test("valida cartão com Luhn", () => {
  assert.equal(luhn("4111111111111111"), true);
  assert.equal(luhn("4111111111111112"), false);
});

test("calcula total pelo catálogo e ignora preço enviado pelo cliente", () => {
  const quote = quoteCart(products, [
    { id: "neurocodigos", qty: 2, price: 1 },
    { id: "bioluz", qty: 1, price: 1 },
  ]);
  assert.equal(quote.subtotal, 360);
  assert.equal(quote.shipping, 0);
  assert.equal(quote.total, 360);
  assert.equal(quote.lines[0].unitPrice, 120);
});

test("rejeita item inexistente e carrinho vazio", () => {
  assert.throws(() => quoteCart(products, []), { code: "empty_cart" });
  assert.throws(() => quoteCart(products, [{ id: "fake", qty: 1 }]), {
    code: "invalid_item",
  });
  assert.throws(() => quoteCart(products, [{ id: "bioluz", qty: 0 }]), {
    code: "invalid_qty",
  });
});

test("oferece até 3x sem juros quando a parcela não fica abaixo de R$ 20", () => {
  const options = installmentOptions(120, 3);
  assert.equal(options.length, 3);
  assert.equal(options[2].n, 3);
  assert.equal(options[2].value, 40);
});

test("valida dados de entrega e permite pedido sem endereço na retirada", () => {
  const payer = validatePayer({
    name: "Maria Silva",
    email: "maria@email.com",
    phone: "61999991111",
    cpf: "52998224725",
    cep: "70863540",
    street: "CLN 211",
    number: "211",
    neighborhood: "Asa Norte",
    city: "Brasília",
    state: "df",
  });
  assert.equal(payer.state, "DF");
  const pickup = validatePayer(
    {
      name: "Maria Silva",
      email: "maria@email.com",
      phone: "61999991111",
      cpf: "52998224725",
    },
    { requireAddress: false }
  );
  assert.equal(pickup.email, "maria@email.com");
  assert.throws(() => validatePayer({ name: "A", email: "x" }), {
    code: "invalid_payer",
  });
});

test("cartão de demonstração: aprovado, recusado e inválido", () => {
  assert.equal(demoCardDecision("4111111111111111"), "approved");
  assert.equal(demoCardDecision("4000000000000002"), "rejected");
  assert.equal(demoCardDecision("1234"), "invalid");
});

test("frete por CEP, retirada grátis e frete grátis acima de R$ 360", () => {
  assert.equal(shippingRegion("70863540"), "df");
  assert.equal(shippingRegion("01310100"), "sudeste");
  assert.equal(calcShipping({ method: "pickup", hasPhysical: true, subtotal: 120 }), 0);
  assert.equal(
    calcShipping({ method: "delivery", cep: "70863540", hasPhysical: true, subtotal: 120 }),
    15
  );
  assert.equal(
    calcShipping({ method: "delivery", cep: "70863540", hasPhysical: true, subtotal: 360 }),
    0
  );
  assert.equal(calcShipping({ method: "delivery", hasPhysical: false, subtotal: 8 }), 0);
});

test("álbum digital não entra no frete", () => {
  assert.equal(isPhysicalProduct({ kind: "musica" }), false);
  const quote = quoteCart(products, [{ id: "album", qty: 1 }], {
    shippingMethod: "delivery",
    cep: "01310100",
  });
  assert.equal(quote.hasPhysical, false);
  assert.equal(quote.shipping, 0);
  assert.equal(quote.total, 8);
});

test("gera payload Pix de demonstração", () => {
  const code = demoPixPayload("CEME-ABC", 135);
  assert.match(code, /CEMEPIX/);
  assert.match(code, /BRL135.00/);
});

test("CORS: live exige lista; demo aceita vazio; whitelist fecha o resto", () => {
  assert.equal(isOriginAllowed("https://evil.example", { mode: "live", allowedOrigins: [] }), false);
  assert.equal(
    isOriginAllowed("https://gabriel7z.github.io", {
      mode: "live",
      allowedOrigins: ["https://gabriel7z.github.io"],
    }),
    true
  );
  assert.equal(
    isOriginAllowed("https://evil.example", {
      mode: "live",
      allowedOrigins: ["https://gabriel7z.github.io"],
    }),
    false
  );
  assert.equal(isOriginAllowed("https://evil.example", { mode: "demo", allowedOrigins: [] }), true);
  assert.equal(
    isOriginAllowed("https://evil.example", {
      mode: "demo",
      allowedOrigins: ["http://127.0.0.1:3001"],
    }),
    false
  );
  assert.equal(isOriginAllowed("http://127.0.0.1:3001", {
    mode: "demo",
    allowedOrigins: ["http://127.0.0.1:8080"],
    serverOrigin: "http://127.0.0.1:3001",
  }), true);
});

test("rejeita payload com dados de cartão", () => {
  assert.equal(hasForbiddenCardPayload({ card: { number: "4111111111111111" } }), true);
  assert.equal(hasForbiddenCardPayload({ cvv: "123" }), true);
  assert.equal(hasForbiddenCardPayload({ token: "tok", payer: { cpf: "52998224725" } }), false);
});

test("itens da preferência do Checkout Pro usam preço do catálogo e somam o frete", () => {
  const quote = quoteCart(products, [{ id: "neurocodigos", qty: 1 }], {
    shippingMethod: "delivery",
    cep: "01310100",
  });
  const items = preferenceItems(quote);
  assert.equal(items[0].unit_price, 120);
  assert.equal(items[0].currency_id, "BRL");
  assert.ok(items.some((item) => item.id === "frete"));
});

test("não devolve mensagem crua de erro interno", () => {
  assert.equal(publicErrorCode({ code: "invalid_payer" }), "invalid_payer");
  assert.equal(publicErrorCode({ code: "ENOENT", message: "/secret/.env" }), "pay_failed");
});

test("modo da API: demo sem token, sandbox com TEST- e live com token de produção", () => {
  assert.equal(paymentMode({ accessToken: "", demoPayments: "false" }), "demo");
  assert.equal(
    paymentMode({ accessToken: "TEST-abc", demoPayments: "true" }),
    "demo"
  );
  assert.equal(
    paymentMode({ accessToken: "TEST-abc", demoPayments: "false" }),
    "sandbox"
  );
  assert.equal(
    paymentMode({ accessToken: "APP_USR-abc", demoPayments: "false", testMode: "true" }),
    "sandbox"
  );
  assert.equal(
    paymentMode({ accessToken: "APP_USR-abc", demoPayments: "false" }),
    "live"
  );
});

test("catálogo oficial tem 15 sprays a R$ 120 e extras compráveis", () => {
  const sprays = PRODUCTS.filter((p) => !p.kind || p.kind === "spray");
  assert.equal(sprays.length, 15);
  assert.ok(sprays.every((p) => p.price === 120));
  assert.ok(PRODUCTS.some((p) => p.kind === "garrafada"));
  assert.ok(PRODUCTS.some((p) => p.kind === "mapa"));
  assert.ok(PRODUCTS.some((p) => p.kind === "musica"));
  const quote = quoteCart(
    PRODUCTS,
    sprays.map((product) => ({ id: product.id, qty: 1 }))
  );
  assert.equal(quote.subtotal, 1800);
  assert.equal(quote.shipping, 0);
});
