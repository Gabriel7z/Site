(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  function aplicarTextos() {
    $$("[data-campo]").forEach((el) => {
      const chave = el.dataset.campo;
      if (CONFIG[chave] != null) el.textContent = CONFIG[chave];
    });
    document.title = "Para " + CONFIG.nomeDela;
  }

  function montarCarta() {
    const caixa = $("#textoCarta");
    CONFIG.carta
      .trim()
      .split(/\n\s*\n/)
      .forEach((paragrafo) => {
        const p = document.createElement("p");
        p.textContent = paragrafo.trim();
        caixa.appendChild(p);
      });
  }

  function montarMotivos() {
    const grade = $("#gradeMotivos");
    CONFIG.motivos.forEach((item, i) => {
      const art = document.createElement("article");
      art.className = "cartao revelar";
      art.innerHTML =
        '<p class="cartao-num">' +
        String(i + 1).padStart(2, "0") +
        "</p><h3></h3><p></p>";
      art.querySelector("h3").textContent = item.titulo;
      art.querySelectorAll("p")[1].textContent = item.texto;
      grade.appendChild(art);
    });
  }

  function montarHistoria() {
    const lista = $("#linhaTempo");
    CONFIG.historia.forEach((item) => {
      const li = document.createElement("li");
      li.className = "revelar";
      li.innerHTML =
        '<p class="evento-data"></p><h3 class="evento-titulo"></h3><p class="evento-texto"></p>';
      li.querySelector(".evento-data").textContent = item.data;
      li.querySelector(".evento-titulo").textContent = item.titulo;
      li.querySelector(".evento-texto").textContent = item.texto;
      lista.appendChild(li);
    });
  }

  const ESTRELAS = [
    { ra: 6.752, de: -16.72, mag: -1.46 },
    { ra: 6.399, de: -52.7, mag: -0.74 },
    { ra: 14.66, de: -60.84, mag: -0.27 },
    { ra: 14.261, de: 19.18, mag: -0.05 },
    { ra: 18.616, de: 38.78, mag: 0.03 },
    { ra: 5.278, de: 46.0, mag: 0.08 },
    { ra: 5.242, de: -8.2, mag: 0.13 },
    { ra: 7.655, de: 5.22, mag: 0.34 },
    { ra: 1.629, de: -57.24, mag: 0.46 },
    { ra: 5.919, de: 7.41, mag: 0.5 },
    { ra: 14.064, de: -60.37, mag: 0.61 },
    { ra: 19.846, de: 8.87, mag: 0.76 },
    { ra: 12.443, de: -63.1, mag: 0.77, nome: "Cruzeiro do Sul", id: "acr" },
    { ra: 4.599, de: 16.51, mag: 0.85 },
    { ra: 13.42, de: -11.16, mag: 0.98 },
    { ra: 16.49, de: -26.43, mag: 0.96, id: "ant" },
    { ra: 7.755, de: 28.03, mag: 1.14 },
    { ra: 22.96, de: -29.62, mag: 1.16 },
    { ra: 20.69, de: 45.28, mag: 1.25 },
    { ra: 12.795, de: -59.69, mag: 1.25, id: "mim" },
    { ra: 10.139, de: 11.97, mag: 1.35 },
    { ra: 6.977, de: -28.97, mag: 1.5 },
    { ra: 7.577, de: 31.89, mag: 1.58 },
    { ra: 17.56, de: -37.1, mag: 1.62, id: "sha" },
    { ra: 5.418, de: 6.35, mag: 1.64, id: "bel" },
    { ra: 12.519, de: -57.11, mag: 1.63, id: "gac" },
    { ra: 5.533, de: -0.3, mag: 1.69, id: "nil" },
    { ra: 5.679, de: -1.94, mag: 1.74, id: "nit" },
    { ra: 5.419, de: -1.94, mag: 2.23, id: "min" },
    { ra: 12.252, de: -58.75, mag: 2.79, id: "del" },
    { ra: 16.836, de: -34.29, mag: 1.87, id: "sar" },
    { ra: 18.403, de: -34.38, mag: 1.79, id: "nun" },
    { ra: 18.921, de: -26.3, mag: 2.05, id: "kau" },
    { ra: 17.792, de: -40.13, mag: 2.39, id: "eta" },
    { ra: 16.353, de: -25.59, mag: 2.29, id: "pi" },
    { ra: 16.09, de: -19.81, mag: 2.54, id: "gra" },
    { ra: 16.598, de: -28.22, mag: 2.82, id: "tau" },
    { ra: 17.621, de: -42.99, mag: 1.79, id: "kaus" },
    { ra: 22.711, de: -46.96, mag: 1.74 },
    { ra: 13.792, de: -41.69, mag: 2.06 },
    { ra: 5.919, de: -9.67, mag: 2.07, id: "sai" },
    { ra: 6.126, de: 22.51, mag: 1.65 },
    { ra: 0.79, de: -17.99, mag: 2.04 },
    { ra: 5.242, de: 6.35, mag: 1.64 },
    { ra: 17.792, de: -27.83, mag: 2.81 },
    { ra: 18.349, de: -29.83, mag: 2.6, id: "asc" },
    { ra: 19.043, de: -29.88, mag: 2.89 },
    { ra: 20.428, de: -56.74, mag: 1.94 },
    { ra: 14.661, de: -47.29, mag: 2.55 },
    { ra: 16.766, de: -69.03, mag: 1.91 },
    { ra: 12.9, de: 55.96, mag: 1.77 },
    { ra: 13.398, de: 54.92, mag: 1.86 },
    { ra: 11.062, de: 61.75, mag: 1.81 },
    { ra: 11.898, de: 53.69, mag: 2.37 },
    { ra: 2.53, de: 89.26, mag: 1.98 },
    { ra: 0.139, de: 29.09, mag: 2.06 },
    { ra: 2.119, de: 23.46, mag: 2.01 },
    { ra: 3.405, de: 49.86, mag: 1.79 },
    { ra: 5.242, de: 28.61, mag: 1.65 },
    { ra: 7.401, de: -29.3, mag: 1.84 },
    { ra: 9.132, de: -43.43, mag: 1.68 },
    { ra: 10.746, de: -49.42, mag: 1.86 },
    { ra: 11.596, de: 55.96, mag: 2.37 },
    { ra: 15.345, de: -36.37, mag: 2.3 },
    { ra: 17.247, de: -15.43, mag: 2.43 },
    { ra: 19.921, de: 8.87, mag: 2.72 },
    { ra: 21.444, de: 62.59, mag: 2.45 },
    { ra: 22.137, de: -46.96, mag: 2.39 },
    { ra: 23.079, de: 28.08, mag: 2.42 },
  ];

  const LINHAS_CEU = [
    ["acr", "gac"],
    ["mim", "del"],
    ["acr", "mim"],
    ["gac", "del"],
    ["bel", "min"],
    ["min", "nil"],
    ["nil", "nit"],
    ["gra", "pi"],
    ["pi", "ant"],
    ["ant", "tau"],
    ["tau", "sha"],
    ["sha", "sar"],
    ["sar", "eta"],
    ["nun", "asc"],
    ["asc", "kau"],
  ];

  function julianDate(ano, mes, dia, horaUtc) {
    if (mes <= 2) {
      ano -= 1;
      mes += 12;
    }
    const A = Math.floor(ano / 100);
    const B = 2 - A + Math.floor(A / 4);
    return (
      Math.floor(365.25 * (ano + 4716)) +
      Math.floor(30.6001 * (mes + 1)) +
      dia +
      B -
      1524.5 +
      horaUtc / 24
    );
  }

  function lstHoras(jd, lon) {
    const d = jd - 2451545.0;
    const T = d / 36525;
    let gst =
      280.46061837 +
      360.98564736629 * d +
      0.000387933 * T * T -
      (T * T * T) / 38710000;
    gst = ((gst % 360) + 360) % 360;
    return (((gst / 15 + lon / 15) % 24) + 24) % 24;
  }

  function projetarEstrela(estrela, lst, lat) {
    const ha = ((lst - estrela.ra) * 15 * Math.PI) / 180;
    const dec = (estrela.de * Math.PI) / 180;
    const phi = (lat * Math.PI) / 180;
    const sinAlt =
      Math.sin(dec) * Math.sin(phi) + Math.cos(dec) * Math.cos(phi) * Math.cos(ha);
    const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt)));
    if (alt <= 0.02) return null;
    const cosAz =
      (Math.sin(dec) - Math.sin(alt) * Math.sin(phi)) /
      (Math.cos(alt) * Math.cos(phi) || 1e-6);
    let az = Math.acos(Math.max(-1, Math.min(1, cosAz)));
    if (Math.sin(ha) > 0) az = Math.PI * 2 - az;
    const r = (Math.PI / 2 - alt) / (Math.PI / 2);
    return {
      x: r * Math.sin(az),
      y: -r * Math.cos(az),
      alt: alt,
      mag: estrela.mag,
      nome: estrela.nome,
      id: estrela.id,
    };
  }

  function desenharCeu() {
    const canvas = $("#ceuCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const css = Math.min(640, canvas.clientWidth || 520);
    canvas.width = Math.round(css * dpr);
    canvas.height = Math.round(css * dpr);
    const W = canvas.width;
    const cx = W / 2;
    const R = W * 0.48;

    const lat = -23.55;
    const lon = -46.63;
    const jd = julianDate(2022, 10, 22, 23);
    const lst = lstHoras(jd, lon);
    const visiveis = ESTRELAS.map((e) => projetarEstrela(e, lst, lat)).filter(Boolean);
    const porId = {};
    visiveis.forEach((e) => {
      if (e.id) porId[e.id] = e;
    });

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, W, W);
    ctx.beginPath();
    ctx.arc(cx, cx, R, 0, Math.PI * 2);
    ctx.clip();

    const fundo = ctx.createRadialGradient(cx, cx * 0.72, R * 0.05, cx, cx, R);
    fundo.addColorStop(0, "#2a1230");
    fundo.addColorStop(0.55, "#140814");
    fundo.addColorStop(1, "#07040a");
    ctx.fillStyle = fundo;
    ctx.fillRect(0, 0, W, W);

    ctx.save();
    ctx.translate(cx, cx);
    ctx.rotate(-0.55);
    const via = ctx.createLinearGradient(-R, 0, R, 0);
    via.addColorStop(0, "rgba(232,180,196,0)");
    via.addColorStop(0.5, "rgba(232,180,196,0.13)");
    via.addColorStop(1, "rgba(232,180,196,0)");
    ctx.fillStyle = via;
    ctx.beginPath();
    ctx.ellipse(R * 0.18, R * 0.12, R * 0.92, R * 0.18, 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    const aleatorio = (function (semente) {
      return function () {
        semente = (semente * 16807) % 2147483647;
        return (semente - 1) / 2147483646;
      };
    })(22102022);

    for (let i = 0; i < 220; i += 1) {
      const a = aleatorio() * Math.PI * 2;
      const r = Math.sqrt(aleatorio()) * 0.98;
      const x = cx + Math.cos(a) * r * R;
      const y = cx + Math.sin(a) * r * R;
      const tam = 0.4 + aleatorio() * 1.1;
      ctx.fillStyle = "rgba(255,246,234," + (0.18 + aleatorio() * 0.45) + ")";
      ctx.beginPath();
      ctx.arc(x, y, tam * dpr, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(240,222,189,0.28)";
    ctx.lineWidth = 1 * dpr;
    LINHAS_CEU.forEach(([a, b]) => {
      const pa = porId[a];
      const pb = porId[b];
      if (!pa || !pb) return;
      ctx.beginPath();
      ctx.moveTo(cx + pa.x * R, cx + pa.y * R);
      ctx.lineTo(cx + pb.x * R, cx + pb.y * R);
      ctx.stroke();
    });

    visiveis.forEach((e) => {
      const x = cx + e.x * R;
      const y = cx + e.y * R;
      const tam = Math.max(0.8, (3.4 - e.mag) * 1.15) * dpr;
      const brilho = ctx.createRadialGradient(x, y, 0, x, y, tam * 4);
      brilho.addColorStop(0, "rgba(255,246,234,0.95)");
      brilho.addColorStop(0.35, "rgba(240,222,189,0.45)");
      brilho.addColorStop(1, "rgba(240,222,189,0)");
      ctx.fillStyle = brilho;
      ctx.beginPath();
      ctx.arc(x, y, tam * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#fff6ea";
      ctx.beginPath();
      ctx.arc(x, y, tam, 0, Math.PI * 2);
      ctx.fill();
    });

    const cruz = visiveis.find((e) => e.nome === "Cruzeiro do Sul");
    if (cruz) {
      ctx.fillStyle = "rgba(240,222,189,0.85)";
      ctx.font = 11 * dpr + "px Outfit, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Cruzeiro do Sul", cx + cruz.x * R, cx + cruz.y * R + 18 * dpr);
    }

    ctx.beginPath();
    ctx.arc(cx, cx, R - 1, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(212,180,131,0.35)";
    ctx.lineWidth = 2 * dpr;
    ctx.stroke();
  }

  function iniciarCeu() {
    const canvas = $("#ceuCanvas");
    if (!canvas) return;
    desenharCeu();
    window.addEventListener("resize", desenharCeu);
    if ("ResizeObserver" in window) {
      new ResizeObserver(desenharCeu).observe(canvas);
    }
  }

  function montarRoleta() {
    const roda = $("#roletaRoda");
    const botao = $("#btnRoleta");
    const resultado = $("#roletaResultado");
    const frases = CONFIG.roleta;
    if (!roda || !botao || !Array.isArray(frases) || !frases.length) return;

    const n = frases.length;
    const fatia = 360 / n;

    function fraseDaRoleta(item) {
      if (item === "mil milhões") return "eu te amo mil milhões";
      if (item === "o seu sorriso") return "eu te amo pelo seu sorriso";
      if (item.indexOf("meu ") === 0 || item.indexOf("minha ") === 0) {
        return "eu te amo, " + item;
      }
      return "eu te amo porque você é " + item;
    }
    const cores = ["#fff7ee", "#f4d5df"];
    const partes = frases
      .map((_, i) => cores[i % 2] + " " + i * fatia + "deg " + (i + 1) * fatia + "deg")
      .join(", ");
    roda.style.background = "conic-gradient(from -90deg, " + partes + ")";

    frases.forEach((texto, i) => {
      const span = document.createElement("span");
      span.className = "roleta-legenda";
      span.textContent = texto;
        const ang = (i + 0.5) * fatia;
        const raio = Math.round(Math.min(340, window.innerWidth * 0.82) * 0.33);
        span.style.transform = "rotate(" + ang + "deg) translateY(-" + raio + "px)";
      roda.appendChild(span);
    });

    let girando = false;
    let atual = 0;

    botao.addEventListener("click", () => {
      if (girando) return;
      girando = true;
      resultado.hidden = true;
      const escolhido = Math.floor(Math.random() * n);
      const voltas = 6 + Math.floor(Math.random() * 3);
      const destino =
        atual +
        voltas * 360 +
        (360 - ((escolhido * fatia + fatia / 2 + (atual % 360)) % 360));
      atual = destino;
      roda.style.transition = "transform 4.4s cubic-bezier(0.12, 0.64, 0.08, 1)";
      roda.style.transform = "rotate(" + destino + "deg)";

      const terminar = () => {
        roda.removeEventListener("transitionend", terminar);
        resultado.textContent = fraseDaRoleta(frases[escolhido]);
        resultado.hidden = false;
        girando = false;
        chuvaDeCoracoes();
      };

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        roda.style.transition = "none";
        terminar();
        return;
      }
      roda.addEventListener("transitionend", terminar);
    });
  }

  function candidatosFoto(src) {
    const m = String(src).match(/^(.*)\.([a-z0-9]+)$/i);
    if (!m) return [src];
    const base = m[1];
    return [
      src,
      base + ".jpeg",
      base + ".png",
      base + ".webp",
      base + ".JPG",
      base + ".JPEG",
      base + ".PNG",
    ];
  }

  const GIROS = [-3.2, 2.4, -1.6, 3.5, -2.8, 1.9, -3.6, 2.8, -1.2, 3.1];
  const album = [];
  let tocarMusica = null;

  function carregarFoto(quadro, src, alt) {
    const img = document.createElement("img");
    img.alt = alt;
    const tentativas = candidatosFoto(src);
    let i = 0;
    const tentar = () => {
      if (i >= tentativas.length) {
        img.remove();
        return;
      }
      img.src = tentativas[i];
      i += 1;
    };
    img.addEventListener("load", () => {
      quadro.textContent = "";
      quadro.appendChild(img);
    });
    img.addEventListener("error", tentar);
    tentar();
    return img;
  }

  function criarPolaroid(foto, indice, extraClass) {
    const fig = document.createElement("figure");
    fig.className = "polaroid revelar" + (extraClass ? " " + extraClass : "");
    fig.style.setProperty("--giro", GIROS[indice % GIROS.length] + "deg");
    const quadro = document.createElement("div");
    quadro.className = "polaroid-foto";
    quadro.textContent = "♥";
    carregarFoto(quadro, foto.src, foto.legenda);
    const cap = document.createElement("figcaption");
    cap.textContent = foto.legenda;
    fig.append(quadro, cap);
    fig.addEventListener("click", () => abrirFoto(indice));
    return fig;
  }

  function montarCapaFoto() {
    const caixa = $("#capaPolaroid");
    const foto = CONFIG.fotos[0];
    if (!caixa || !foto) return;
    caixa.appendChild(criarPolaroid(foto, 0, "polaroid-capa"));
  }

  function montarFotos() {
    const grade = $("#polaroides");
    CONFIG.fotos.forEach((foto, i) => {
      album.push(foto);
      grade.appendChild(criarPolaroid(foto, i));
    });
  }

  function iniciarLightbox() {
    const caixa = $("#lightbox");
    const img = $("#lightboxImg");
    const cap = $("#lightboxLegenda");
    if (!caixa) return;

    let atual = 0;

    function mostrar(i) {
      if (!album.length) return;
      atual = (i + album.length) % album.length;
      const foto = album[atual];
      img.src = foto.src;
      img.alt = foto.legenda;
      cap.textContent = foto.legenda;
      caixa.hidden = false;
      document.body.classList.add("lightbox-aberto");
    }

    function fechar() {
      caixa.hidden = true;
      document.body.classList.remove("lightbox-aberto");
    }

    window.abrirFoto = mostrar;
    $("#lightboxFechar").addEventListener("click", fechar);
    $("#lightboxPrev").addEventListener("click", (e) => {
      e.stopPropagation();
      mostrar(atual - 1);
    });
    $("#lightboxNext").addEventListener("click", (e) => {
      e.stopPropagation();
      mostrar(atual + 1);
    });
    caixa.addEventListener("click", (e) => {
      if (e.target === caixa) fechar();
    });
    document.addEventListener("keydown", (e) => {
      if (caixa.hidden) return;
      if (e.key === "Escape") fechar();
      if (e.key === "ArrowLeft") mostrar(atual - 1);
      if (e.key === "ArrowRight") mostrar(atual + 1);
    });
  }

  function montarMotivoDoDia() {
    const secao = $("#motivoDoDia");
    const alvo = $("#motivoDiaTexto");
    const lista = CONFIG.motivosDoDia;
    if (!secao || !alvo || !Array.isArray(lista) || !lista.length) return;

    const inicio = new Date(CONFIG.dataNamoro + "T00:00:00");
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dias = Math.floor((hoje - inicio) / 86400000);
    const i = ((dias % lista.length) + lista.length) % lista.length;

    alvo.textContent = lista[i];
    secao.hidden = false;
  }

  const CHAVE_BILHETES = "para-amanda:bilhetes";

  function bilhetesAbertos() {
    try {
      const lista = JSON.parse(localStorage.getItem(CHAVE_BILHETES) || "[]");
      return Array.isArray(lista) ? lista : [];
    } catch (e) {
      return [];
    }
  }

  function marcarBilhete(indice) {
    try {
      const lista = bilhetesAbertos();
      if (lista.indexOf(indice) === -1) {
        lista.push(indice);
        localStorage.setItem(CHAVE_BILHETES, JSON.stringify(lista));
      }
    } catch (e) {
      // sem armazenamento o bilhete abre igual, só não fica marcado
    }
  }

  function abrirBilhete(indice, botao) {
    const bilhete = CONFIG.bilhetes[indice];
    const modal = $("#bilheteModal");
    if (!bilhete || !modal) return;

    $("#bilheteQuando").textContent = bilhete.quando;
    const corpo = $("#bilheteTexto");
    corpo.textContent = "";
    bilhete.texto
      .trim()
      .split(/\n\s*\n/)
      .forEach((paragrafo) => {
        const p = document.createElement("p");
        p.textContent = paragrafo.trim();
        corpo.appendChild(p);
      });

    modal.hidden = false;
    document.body.classList.add("bilhete-aberto");
    marcarBilhete(indice);

    if (botao) {
      botao.classList.add("aberto");
      botao.querySelector(".bilhete-abrir").textContent = "ler de novo";
    }
  }

  function montarBilhetes() {
    const secao = $("#bilhetes");
    const grade = $("#gradeBilhetes");
    const lista = CONFIG.bilhetes;
    if (!secao || !grade || !Array.isArray(lista) || !lista.length) return;

    const abertos = bilhetesAbertos();
    lista.forEach((bilhete, i) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bilhete revelar";
      btn.innerHTML =
        '<span class="bilhete-lacre" aria-hidden="true">♥</span>' +
        '<span class="bilhete-quando"></span>' +
        '<span class="bilhete-abrir"></span>';
      btn.querySelector(".bilhete-quando").textContent = bilhete.quando;
      const jaAberto = abertos.indexOf(i) !== -1;
      btn.classList.toggle("aberto", jaAberto);
      btn.querySelector(".bilhete-abrir").textContent = jaAberto
        ? "ler de novo"
        : "abrir";
      btn.addEventListener("click", () => abrirBilhete(i, btn));
      grade.appendChild(btn);
    });

    secao.hidden = false;
  }

  function iniciarBilhetes() {
    const modal = $("#bilheteModal");
    if (!modal) return;

    function fechar() {
      modal.hidden = true;
      document.body.classList.remove("bilhete-aberto");
    }

    $("#bilheteFechar").addEventListener("click", fechar);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) fechar();
    });
    document.addEventListener("keydown", (e) => {
      if (!modal.hidden && e.key === "Escape") fechar();
    });
  }

  function iniciarCinema() {
    const caixa = $("#cinema");
    const botao = $("#btnCinema");
    if (!caixa || !botao) return;
    if (!album.length) {
      botao.hidden = true;
      return;
    }

    const camadas = [$("#cinemaA"), $("#cinemaB")];
    const legenda = $("#cinemaLegenda");
    const progresso = $("#cinemaProgresso");
    const fim = $("#cinemaFim");
    const pausa = $("#cinemaPausa");
    const DURACAO = 4600;

    let indice = 0;
    let ativa = 1;
    let timer = null;
    let pausado = false;

    function preCarregar(i) {
      if (!album[i]) return;
      const img = new Image();
      img.src = album[i].src;
    }

    function pintar(i) {
      const foto = album[i];
      if (!foto) return;

      const proxima = camadas[1 - ativa];
      const img = proxima.querySelector("img");
      img.src = foto.src;
      img.alt = foto.legenda;
      proxima.querySelector(".cinema-fundo").style.backgroundImage =
        'url("' + foto.src + '")';
      proxima.classList.remove("visivel");
      void proxima.offsetWidth;
      proxima.classList.add("visivel");
      camadas[ativa].classList.remove("visivel");
      ativa = 1 - ativa;

      legenda.textContent = foto.legenda;
      legenda.classList.remove("aparecer");
      void legenda.offsetWidth;
      legenda.classList.add("aparecer");

      progresso.style.width = ((i + 1) / album.length) * 100 + "%";
      preCarregar(i + 1);
      preCarregar(i + 2);
    }

    function agendar() {
      clearTimeout(timer);
      timer = setTimeout(avancar, DURACAO);
    }

    function avancar() {
      if (indice + 1 >= album.length) {
        clearTimeout(timer);
        $("#cinemaFimFrase").textContent = CONFIG.fraseFinal;
        fim.hidden = false;
        return;
      }
      indice += 1;
      pintar(indice);
      agendar();
    }

    function comecar() {
      indice = 0;
      pausado = false;
      fim.hidden = true;
      caixa.classList.remove("pausado");
      pausa.textContent = "❚❚";
      pintar(0);
      agendar();
    }

    function abrir() {
      caixa.hidden = false;
      document.body.classList.add("cinema-aberto");
      comecar();
      if (tocarMusica) tocarMusica();
    }

    function fechar() {
      clearTimeout(timer);
      caixa.hidden = true;
      document.body.classList.remove("cinema-aberto");
    }

    function alternarPausa() {
      pausado = !pausado;
      caixa.classList.toggle("pausado", pausado);
      pausa.textContent = pausado ? "▶" : "❚❚";
      if (pausado) clearTimeout(timer);
      else agendar();
    }

    botao.addEventListener("click", abrir);
    $("#cinemaFechar").addEventListener("click", fechar);
    pausa.addEventListener("click", alternarPausa);
    $("#cinemaRepetir").addEventListener("click", comecar);
    document.addEventListener("keydown", (e) => {
      if (caixa.hidden) return;
      if (e.key === "Escape") fechar();
      if (e.code === "Space" && !e.target.closest("button")) {
        e.preventDefault();
        alternarPausa();
      }
    });
  }

  function montarPromessas() {
    const ul = $("#listaPromessas");
    CONFIG.promessas.forEach((texto) => {
      const li = document.createElement("li");
      li.className = "revelar";
      li.textContent = texto;
      ul.appendChild(li);
    });
  }

  function montarContador(id, prefixo) {
    const caixa = $(id);
    const unidades = [
      ["dias", prefixo + "-dias"],
      ["horas", prefixo + "-horas"],
      ["min", prefixo + "-min"],
      ["seg", prefixo + "-seg"],
    ];
    unidades.forEach(([nome, elId]) => {
      const bloco = document.createElement("div");
      bloco.className = "contador-bloco";
      bloco.innerHTML = "<strong id=\"" + elId + "\">0</strong><span></span>";
      bloco.querySelector("span").textContent = nome;
      caixa.appendChild(bloco);
    });
  }

  function iniciarContadores() {
    montarContador("#contadorConheceu", "conheceu");
    montarContador("#contadorNamoro", "namoro");

    const conheceu = new Date(CONFIG.dataConheceu + "T00:00:00");
    const namoro = new Date(CONFIG.dataNamoro + "T00:00:00");

    function preencher(prefixo, inicio) {
      if (Number.isNaN(inicio.getTime())) return;
      let diff = Math.max(0, Date.now() - inicio.getTime());
      const dias = Math.floor(diff / 86400000);
      diff -= dias * 86400000;
      const horas = Math.floor(diff / 3600000);
      diff -= horas * 3600000;
      const min = Math.floor(diff / 60000);
      diff -= min * 60000;
      const seg = Math.floor(diff / 1000);
      $("#" + prefixo + "-dias").textContent = dias;
      $("#" + prefixo + "-horas").textContent = String(horas).padStart(2, "0");
      $("#" + prefixo + "-min").textContent = String(min).padStart(2, "0");
      $("#" + prefixo + "-seg").textContent = String(seg).padStart(2, "0");
    }

    function tick() {
      preencher("conheceu", conheceu);
      preencher("namoro", namoro);
    }

    tick();
    setInterval(tick, 1000);
  }

  function observarRevelar() {
    const els = $$(".revelar");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("visto"));
      return;
    }
    const io = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visto");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.16 }
    );
    els.forEach((el) => io.observe(el));
  }

  function petalas() {
    const canvas = $("#petalas");
    if (!canvas || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    const ctx = canvas.getContext("2d");
    let w = 0;
    let h = 0;
    const flakes = [];

    function resize() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    }

    function criar(qtd) {
      for (let i = 0; i < qtd; i += 1) {
        flakes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 4 + Math.random() * 7,
          s: 0.4 + Math.random() * 0.9,
          a: Math.random() * Math.PI * 2,
          cor: Math.random() > 0.5 ? "rgba(232,180,196,0.7)" : "rgba(196,92,116,0.55)",
        });
      }
    }

    function desenhar() {
      ctx.clearRect(0, 0, w, h);
      flakes.forEach((p) => {
        p.y += p.s;
        p.x += Math.sin(p.a) * 0.6;
        p.a += 0.01;
        if (p.y > h + 10) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.a);
        ctx.fillStyle = p.cor;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      requestAnimationFrame(desenhar);
    }

    resize();
    criar(28);
    window.addEventListener("resize", resize);
    desenhar();
  }

  function soltarCoracao(x, y) {
    const span = document.createElement("span");
    span.className = "coracao-solto";
    span.textContent = ["♥", "♡", "❤"][Math.floor(Math.random() * 3)];
    span.style.left = x - 8 + "px";
    span.style.top = y - 8 + "px";
    span.style.fontSize = 1.1 + Math.random() + "rem";
    document.body.appendChild(span);
    setTimeout(() => span.remove(), 1600);
  }

  function chuvaDeCoracoes() {
    const total = 28;
    for (let i = 0; i < total; i += 1) {
      setTimeout(() => {
        soltarCoracao(
          Math.random() * window.innerWidth,
          window.innerHeight - 40 - Math.random() * 80
        );
      }, i * 50);
    }
  }

  function musica() {
    const btn = $("#btnMusica");
    if (!CONFIG.youtubeId) {
      btn.hidden = true;
      return;
    }

    let player = null;
    let pronto = false;
    let querTocar = false;
    let pedidoDePlayer = false;

    function estadoTocando() {
      if (!player || typeof YT === "undefined" || !YT.PlayerState) return false;
      try {
        const estado = player.getPlayerState();
        return estado === YT.PlayerState.PLAYING || estado === YT.PlayerState.BUFFERING;
      } catch (e) {
        return false;
      }
    }

    function atualizarBotao() {
      btn.classList.toggle("tocando", estadoTocando());
    }

    const criarPlayer = function () {
      if (player || !document.getElementById("ytplayer") || !(window.YT && YT.Player)) return;
      player = new YT.Player("ytplayer", {
        width: "100%",
        height: "100%",
        videoId: CONFIG.youtubeId,
        playerVars: {
          autoplay: querTocar ? 1 : 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          loop: 1,
          playlist: CONFIG.youtubeId,
          origin: window.location.origin,
          enablejsapi: 1,
        },
        events: {
          onReady: function (e) {
            pronto = true;
            try {
              const iframe = player.getIframe();
              if (iframe) {
                iframe.setAttribute(
                  "allow",
                  "autoplay; encrypted-media; fullscreen; picture-in-picture"
                );
              }
            } catch (err) {}
            if (querTocar) {
              try {
                player.playVideo();
              } catch (err) {}
            }
            atualizarBotao();
          },
          onStateChange: function (e) {
            atualizarBotao();
            if (
              querTocar &&
              window.YT &&
              YT.PlayerState &&
              e.data === YT.PlayerState.ENDED
            ) {
              try {
                player.seekTo(0, true);
                player.playVideo();
              } catch (err) {}
            }
          },
          onError: function () {
            atualizarBotao();
          },
        },
      });
    };

    function garantirPlayer() {
      pedidoDePlayer = true;
      if (window.YT && YT.Player) criarPlayer();
    }

    window.onYouTubeIframeAPIReady = function () {
      if (pedidoDePlayer) criarPlayer();
    };

    if (!(window.YT && YT.Player)) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    function tocar() {
      querTocar = true;
      garantirPlayer();
      if (pronto && player) {
        try {
          player.playVideo();
        } catch (err) {}
        atualizarBotao();
      }
    }

    function pausar() {
      querTocar = false;
      if (pronto && player) {
        try {
          player.pauseVideo();
        } catch (err) {}
      }
      atualizarBotao();
    }

    btn.addEventListener("click", () => {
      if (estadoTocando()) pausar();
      else tocar();
    });

    return tocar;
  }

  function abrirCarta() {
    const capa = $("#capa");
    const envelope = $("#envelope");
    const site = $("#site");
    tocarMusica = musica();

    let abriu = false;
    function abrir() {
      if (abriu) return;
      abriu = true;
      site.hidden = false;
      if (tocarMusica) tocarMusica();
      envelope.classList.add("aberto");
      setTimeout(() => {
        capa.classList.add("saida");
        site.classList.add("visivel");
        observarRevelar();
        try {
          desenharCeu();
        } catch (err) {}
        setTimeout(() => capa.remove(), 1000);
      }, 650);
    }

    envelope.addEventListener("click", abrir);
    envelope.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        abrir();
      }
    });

    try {
      const q = new URLSearchParams(location.search);
      const hash = (location.hash || "").toLowerCase();
      const querAmor =
        q.has("amor") ||
        String(q.get("secao") || "").toLowerCase() === "amor" ||
        hash === "#amor" ||
        hash === "#barra-amor";
      if (querAmor) abrir();
    } catch (err) {}
  }

  aplicarTextos();
  montarCarta();
  montarMotivoDoDia();
  montarMotivos();
  montarHistoria();
  montarCapaFoto();
  montarFotos();
  iniciarLightbox();
  iniciarCinema();
  montarBilhetes();
  iniciarBilhetes();
  iniciarCeu();
  montarRoleta();
  montarPromessas();
  iniciarContadores();
  petalas();
  abrirCarta();

  $("#btnCoracoes").addEventListener("click", chuvaDeCoracoes);
  document.addEventListener("click", (e) => {
    if (
      e.target.closest(
        ".capa, .btn-musica, a, button, .player-moldura, .lightbox, .polaroid, .cinema, .bilhete-modal, .roleta-cena, .ceu-moldura, .amor-secao"
      )
    ) {
      return;
    }
    soltarCoracao(e.clientX, e.clientY);
  });
})();
