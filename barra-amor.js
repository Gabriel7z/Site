/* Barra de amor: você aperta o coração uma vez por dia.
   Dia apertado, a barra sobe. Dia esquecido, ela cai. */

(function () {
  // Mexa aqui se quiser mudar o jogo:
  const AUMENTO_POR_DIA = 100; // quanto sobe quando você aperta (100 = enche de uma vez)
  const QUEDA_POR_DIA = 15; // quanto cai por cada dia que você não apertou
  const TITULO = "O quanto você está em mim";
  const CHAVE = "barraAmor";

  const memoria = {};

  function ler() {
    try {
      const bruto = localStorage.getItem(CHAVE);
      return bruto ? JSON.parse(bruto) : null;
    } catch (e) {
      return memoria[CHAVE] || null;
    }
  }

  function gravar(dados) {
    try {
      localStorage.setItem(CHAVE, JSON.stringify(dados));
    } catch (e) {
      memoria[CHAVE] = dados;
    }
  }

  function hoje() {
    const d = new Date();
    const mes = String(d.getMonth() + 1).padStart(2, "0");
    const dia = String(d.getDate()).padStart(2, "0");
    return d.getFullYear() + "-" + mes + "-" + dia;
  }

  function diasEntre(de, ate) {
    const a = new Date(de + "T00:00:00");
    const b = new Date(ate + "T00:00:00");
    return Math.round((b - a) / 86400000);
  }

  function guardado() {
    const salvo = ler();
    if (!salvo || !salvo.ultimo) {
      return { nivel: 0, ultimo: null, sequencia: 0, recorde: 0 };
    }
    return salvo;
  }

  // A queda é sempre calculada na hora, nunca salva, para não descontar duas vezes.
  // O dia de hoje ainda não conta como esquecido: dá tempo de apertar.
  function agora() {
    const dados = guardado();
    if (!dados.ultimo) return { ...dados, dias: null, esquecidos: 0 };
    const dias = diasEntre(dados.ultimo, hoje());
    const esquecidos = Math.max(0, dias - 1);
    return {
      ...dados,
      dias: dias,
      esquecidos: esquecidos,
      nivel: Math.max(0, dados.nivel - esquecidos * QUEDA_POR_DIA),
      sequencia: dias >= 2 ? 0 : dados.sequencia,
    };
  }

  function apertar() {
    const atual = agora();
    const t = hoje();
    if (atual.ultimo === t) return { estado: atual, jaHoje: true };
    const sequencia = atual.dias === 1 ? (atual.sequencia || 0) + 1 : 1;
    const novo = {
      nivel: Math.min(100, atual.nivel + AUMENTO_POR_DIA),
      ultimo: t,
      sequencia: sequencia,
      recorde: Math.max(atual.recorde || 0, sequencia),
    };
    gravar(novo);
    return { estado: { ...novo, dias: 0, esquecidos: 0 }, jaHoje: false };
  }

  // Com a queda de 15 por dia, os níveis caem em 100, 85, 70, 55, 40, 25, 10, 0.
  function frase(nivel) {
    if (nivel >= 100) return "Cheia. Do jeito que eu te amo.";
    if (nivel >= 70) return "Quase transbordando.";
    if (nivel >= 40) return "Na metade — e a melhor metade é você.";
    if (nivel >= 15) return "Ainda sinto, mas quero mais.";
    if (nivel > 0) return "Faltou eu te dizer nos últimos dias.";
    return "Aperta o coração para eu te lembrar hoje.";
  }

  const estilo = document.createElement("style");
  estilo.textContent = [
    ".amor-secao{padding:4.5rem 1.2rem 4rem;text-align:center;background:radial-gradient(ellipse at 50% 0%,#7a2744,var(--vinho,#3b1020) 72%)}",
    ".amor-olho{font-size:.8rem;letter-spacing:.22em;text-transform:uppercase;color:var(--blush,#e8b4c4)}",
    ".amor-titulo{font-family:var(--fonte-titulo,Georgia,serif);font-size:clamp(1.8rem,5vw,2.8rem);color:var(--creme,#f6eadc);margin:.5rem 0 1.8rem}",
    ".amor-caixa{max-width:34rem;margin:0 auto;display:grid;gap:1rem;justify-items:center}",
    ".amor-trilha{width:100%;height:26px;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.14);box-shadow:inset 0 2px 8px rgba(0,0,0,.28)}",
    ".amor-nivel{height:100%;width:0;border-radius:999px;background:linear-gradient(90deg,#e8b4c4,#c45c74 70%,#ff5f7e);transition:width 1s cubic-bezier(.22,1,.36,1)}",
    ".amor-info{display:flex;align-items:baseline;gap:.6rem;flex-wrap:wrap;justify-content:center;color:var(--creme,#f6eadc)}",
    ".amor-pct{font-family:var(--fonte-titulo,Georgia,serif);font-size:2rem}",
    ".amor-frase{font-size:.98rem;opacity:.86}",
    ".amor-btn{cursor:pointer;border:0;border-radius:999px;padding:.9rem 1.5rem;font:inherit;font-weight:600;color:#5c1c33;background:var(--ouro-claro,#f0debd);box-shadow:0 10px 24px rgba(0,0,0,.24)}",
    ".amor-btn:hover{transform:translateY(-1px)}",
    ".amor-btn[disabled]{cursor:default;opacity:.75;transform:none}",
    ".amor-seq{font-size:.88rem;color:var(--blush,#e8b4c4);min-height:1.2em}",
    ".amor-pulo{position:fixed;pointer-events:none;z-index:99;animation:amor-sobe 1.3s ease-out forwards}",
    "@keyframes amor-sobe{to{transform:translateY(-120px) scale(1.5);opacity:0}}",
  ].join("");
  document.head.appendChild(estilo);

  const secao = document.createElement("section");
  secao.className = "amor-secao";
  secao.id = "barra-amor";
  secao.innerHTML = [
    '<p class="amor-olho">todos os dias</p>',
    '<h2 class="amor-titulo"></h2>',
    '<div class="amor-caixa">',
    '<div class="amor-trilha"><div class="amor-nivel"></div></div>',
    '<div class="amor-info"><strong class="amor-pct">0%</strong><span class="amor-frase"></span></div>',
    '<button type="button" class="amor-btn">&#9829; Apertar hoje</button>',
    '<p class="amor-seq"></p>',
    "</div>",
  ].join("");
  secao.querySelector(".amor-titulo").textContent = TITULO;

  const nivelEl = secao.querySelector(".amor-nivel");
  const pctEl = secao.querySelector(".amor-pct");
  const fraseEl = secao.querySelector(".amor-frase");
  const seqEl = secao.querySelector(".amor-seq");
  const btn = secao.querySelector(".amor-btn");

  function textoSequencia(estado) {
    const partes = [];
    if (estado.sequencia > 0) {
      partes.push(
        estado.sequencia === 1
          ? "1 dia seguido"
          : estado.sequencia + " dias seguidos"
      );
    }
    if (estado.recorde > 0) partes.push("recorde: " + estado.recorde);
    if (estado.esquecidos > 0) {
      partes.push(
        estado.esquecidos === 1
          ? "faltou 1 dia"
          : "faltaram " + estado.esquecidos + " dias"
      );
    }
    return partes.join(" · ");
  }

  function pintar(estado, jaHoje) {
    const nivel = Math.round(estado.nivel);
    nivelEl.style.width = nivel + "%";
    pctEl.textContent = nivel + "%";
    fraseEl.textContent = frase(nivel);
    seqEl.textContent = textoSequencia(estado);
    const feito = estado.ultimo === hoje();
    btn.disabled = feito;
    btn.innerHTML = feito ? "&#9829; Apertado hoje" : "&#9829; Apertar hoje";
    if (jaHoje) seqEl.textContent = "Hoje já está feito. Volta amanhã.";
  }

  function coracao(x, y) {
    const span = document.createElement("span");
    span.className = "amor-pulo";
    span.textContent = "♥";
    span.style.left = x - 8 + "px";
    span.style.top = y - 8 + "px";
    span.style.color = "#ff7a94";
    span.style.fontSize = 1 + Math.random() + "rem";
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1300);
  }

  btn.addEventListener("click", (e) => {
    const resultado = apertar();
    pintar(resultado.estado, resultado.jaHoje);
    if (resultado.jaHoje) return;
    const caixa = btn.getBoundingClientRect();
    for (let i = 0; i < 12; i += 1) {
      setTimeout(() => {
        coracao(
          caixa.left + Math.random() * caixa.width,
          caixa.top + Math.random() * caixa.height
        );
      }, i * 60);
    }
  });

  function inserir() {
    const destino = document.querySelector("#site") || document.body;
    const final = destino.querySelector("#final") || destino.querySelector(".final");
    const rodape = destino.querySelector(".rodape") || destino.querySelector("footer");
    if (final) destino.insertBefore(secao, final);
    else if (rodape) destino.insertBefore(secao, rodape);
    else destino.appendChild(secao);
    pintar(agora(), false);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inserir);
  } else {
    inserir();
  }
})();
