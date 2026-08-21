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
} from "./lib.js";

const require = createRequire(import.meta.url);
const { PRODUCTS } = require("../produtos.js");

const products = [
  { id: "neurocodigos", name: "NeuroCódigos", volume: "60ml", price: 120 },
  { id: "bioluz", name: "BioLuz", volume: "60ml", price: 120 },
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
  const quote = quoteCart(
    products,
    [
      { id: "neurocodigos", qty: 2, price: 1 },
      { id: "bioluz", qty: 1, price: 1 },
    ],
    0
  );
  assert.equal(quote.subtotal, 360);
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

test("valida dados de entrega", () => {
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
  assert.throws(
    () => validatePayer({ name: "A", email: "x" }),
    { code: "invalid_payer" }
  );
});

test("cartão de demonstração: aprovado, recusado e inválido", () => {
  assert.equal(demoCardDecision("4111111111111111"), "approved");
  assert.equal(demoCardDecision("4000000000000002"), "rejected");
  assert.equal(demoCardDecision("1234"), "invalid");
});

test("catálogo oficial tem 15 produtos a R$ 120", () => {
  assert.equal(PRODUCTS.length, 15);
  const quote = quoteCart(
    PRODUCTS,
    PRODUCTS.map((product) => ({ id: product.id, qty: 1 })),
    0
  );
  assert.equal(quote.total, 1800);
});
