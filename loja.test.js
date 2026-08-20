const assert = require("assert");
const { WHATSAPP, PRODUCTS, CATEGORIES } = require("./produtos.js");
const {
  money,
  waLink,
  maskPhone,
  filterProducts,
  findProduct,
  createCart,
  buyNowText,
  validatePrescritora,
  prescritoraText,
  produtoDaUrl,
} = require("./loja.js");
const fs = require("fs");
const path = require("path");

assert.strictEqual(WHATSAPP, "5561999291377");
assert.strictEqual(PRODUCTS.length, 15);
assert.ok(CATEGORIES.includes("Todos"));
assert.strictEqual(new Set(PRODUCTS.map((p) => p.id)).size, 15);

for (const p of PRODUCTS) {
  assert.ok(p.name, p.id);
  assert.strictEqual(p.price, 120);
  assert.strictEqual(p.volume, "60ml");
  assert.ok(fs.existsSync(path.join(__dirname, p.image)), p.image);
  assert.ok(fs.existsSync(path.join(__dirname, p.audio)), p.audio);
  assert.ok(p.indications.length >= 2);
}

assert.strictEqual(money(120), "R$ 120,00");
assert.ok(waLink("olá").includes("5561999291377"));
assert.ok(waLink("olá").includes(encodeURIComponent("olá")));
assert.strictEqual(maskPhone("61999291377"), "(61) 99929-1377");
assert.strictEqual(maskPhone("61"), "(61");

assert.strictEqual(filterProducts(PRODUCTS, "Todos").length, 15);
assert.ok(filterProducts(PRODUCTS, "Mente").every((p) => p.category === "Mente"));
assert.ok(filterProducts(PRODUCTS, "Todos", "sono").some((p) => p.id === "sono-de-luz"));
assert.strictEqual(filterProducts(PRODUCTS, "Detox", "xyz-nao-existe").length, 0);
assert.strictEqual(findProduct(PRODUCTS, "emoser").name, "EmoSer");

const cart = createCart(PRODUCTS);
cart.add("neurocodigos", 1);
cart.add("neurocodigos", 2);
cart.add("bioluz");
assert.strictEqual(cart.count(), 4);
assert.strictEqual(cart.total(), 480);
cart.setQty("bioluz", 0);
assert.strictEqual(cart.count(), 3);
assert.ok(cart.checkoutText().includes("NeuroCódigos"));
assert.ok(cart.checkoutText().includes("Total:"));
assert.ok(buyNowText(findProduct(PRODUCTS, "presenca")).includes("Presença"));

const ruim = validatePrescritora({});
assert.strictEqual(ruim.ok, false);
assert.ok(ruim.errors.nome);
assert.ok(ruim.errors.email);

const bom = validatePrescritora({
  nome: "Ana",
  sobrenome: "Silva",
  email: "ana@email.com",
  telefone: "(61) 99929-1377",
  apresentacao: "Terapeuta em Brasília.",
  motivo: "Quero levar a linha CEME para as famílias que atendo.",
});
assert.strictEqual(bom.ok, true);
assert.ok(prescritoraText(bom && {
  nome: "Ana",
  sobrenome: "Silva",
  email: "ana@email.com",
  telefone: "(61) 99929-1377",
  apresentacao: "Terapeuta em Brasília.",
  motivo: "Quero levar a linha CEME para as famílias que atendo.",
}).includes("Ana Silva"));

assert.strictEqual(produtoDaUrl("?produto=sensipeace", "", PRODUCTS), "sensipeace");
assert.strictEqual(produtoDaUrl("", "#produto-bioverbum", PRODUCTS), "bioverbum");
assert.strictEqual(produtoDaUrl("?produto=nao-tem", "#produtos", PRODUCTS), null);

const html = fs.readFileSync(path.join(__dirname, "index.html"), "utf8");
assert.ok(html.includes('id="product-grid"'));
assert.ok(html.includes('id="distribuidora-form"'));
assert.ok(html.includes("product-search"));

console.log("loja.test.js: ok");
