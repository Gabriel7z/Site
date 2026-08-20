const assert = require("assert");
const { pediuAmor, diasEntre, frase, AUMENTO_POR_DIA, QUEDA_POR_DIA, CHAVE } = require("./barra-amor.js");

function memoryStorage() {
  const box = {};
  global.localStorage = {
    getItem: (k) => (k in box ? box[k] : null),
    setItem: (k, v) => {
      box[k] = String(v);
    },
    removeItem: (k) => {
      delete box[k];
    },
  };
  return box;
}

function reload() {
  delete require.cache[require.resolve("./barra-amor.js")];
  return require("./barra-amor.js");
}

assert.strictEqual(pediuAmor("?amor", ""), true);
assert.strictEqual(pediuAmor("amor", ""), true);
assert.strictEqual(pediuAmor("?amor=1", ""), true);
assert.strictEqual(pediuAmor("?secao=amor", ""), true);
assert.strictEqual(pediuAmor("", "#amor"), true);
assert.strictEqual(pediuAmor("", "#barra-amor"), true);
assert.strictEqual(pediuAmor("?foto=1", ""), false);
assert.strictEqual(pediuAmor("", "#carta"), false);

assert.strictEqual(diasEntre("2026-08-20", "2026-08-20"), 0);
assert.strictEqual(diasEntre("2026-08-20", "2026-08-21"), 1);
assert.strictEqual(diasEntre("2026-08-20", "2026-08-22"), 2);
assert.strictEqual(AUMENTO_POR_DIA, 100);
assert.strictEqual(QUEDA_POR_DIA, 15);
assert.strictEqual(frase(100), "Cheia. Do jeito que eu te amo.");
assert.strictEqual(frase(0).includes("Aperta o coração"), true);

memoryStorage();
let jogo = reload();
let r = jogo.apertar("2026-08-20");
assert.strictEqual(r.jaHoje, false);
assert.strictEqual(r.estado.nivel, 100);
assert.strictEqual(r.estado.sequencia, 1);

r = jogo.apertar("2026-08-20");
assert.strictEqual(r.jaHoje, true);
assert.strictEqual(r.estado.nivel, 100);

let visto = jogo.agora("2026-08-21");
assert.strictEqual(visto.nivel, 100);
assert.strictEqual(visto.esquecidos, 0);

visto = jogo.agora("2026-08-22");
assert.strictEqual(visto.nivel, 85);
assert.strictEqual(visto.esquecidos, 1);

visto = jogo.agora("2026-08-23");
assert.strictEqual(visto.nivel, 70);
assert.strictEqual(visto.esquecidos, 2);

visto = jogo.agora("2026-08-27");
assert.strictEqual(visto.nivel, 10);
assert.strictEqual(visto.esquecidos, 6);

visto = jogo.agora("2026-08-28");
assert.strictEqual(visto.nivel, 0);

r = jogo.apertar("2026-08-22");
assert.strictEqual(r.estado.nivel, 100);
assert.strictEqual(r.estado.sequencia, 1);

memoryStorage();
jogo = reload();
jogo.apertar("2026-08-20");
jogo.apertar("2026-08-21");
jogo.apertar("2026-08-22");
visto = jogo.agora("2026-08-22");
assert.strictEqual(visto.nivel, 100);
assert.strictEqual(visto.sequencia, 3);
assert.strictEqual(visto.recorde, 3);

console.log("barra-amor: ok");
