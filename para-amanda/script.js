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

  function montarFotos() {
    const grade = $("#polaroides");
    CONFIG.fotos.forEach((foto) => {
      const fig = document.createElement("figure");
      fig.className = "polaroid revelar";
      const quadro = document.createElement("div");
      quadro.className = "polaroid-foto";
      quadro.textContent = "♥";
      const img = document.createElement("img");
      img.alt = foto.legenda;
      const tentativas = candidatosFoto(foto.src);
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
      const cap = document.createElement("figcaption");
      cap.textContent = foto.legenda;
      fig.append(quadro, cap);
      grade.appendChild(fig);
    });
  }

  function preencherPolaroid(fig, arquivo) {
    const quadro = fig.querySelector(".polaroid-foto");
    const antiga = quadro.querySelector("img");
    if (antiga) antiga.remove();
    const img = document.createElement("img");
    img.alt = fig.querySelector("figcaption").textContent;
    img.src = URL.createObjectURL(arquivo);
    img.addEventListener("load", () => {
      quadro.textContent = "";
      quadro.appendChild(img);
    });
  }

  function escolherFotos() {
    const input = $("#inputFotos");
    const botao = $("#btnFotos");
    if (!input || !botao) return;

    botao.addEventListener("click", () => input.click());
    input.addEventListener("change", () => {
      const arquivos = [...input.files].filter((f) => f.type.startsWith("image/"));
      if (!arquivos.length) return;
      const quadros = $$("#polaroides .polaroid");
      arquivos.forEach((arquivo, i) => {
        if (quadros[i]) {
          preencherPolaroid(quadros[i], arquivo);
          return;
        }
        const foto = CONFIG.fotos[i] || { legenda: "nós" };
        const fig = document.createElement("figure");
        fig.className = "polaroid revelar visto";
        fig.innerHTML =
          '<div class="polaroid-foto">♥</div><figcaption></figcaption>';
        fig.querySelector("figcaption").textContent = foto.legenda;
        $("#polaroides").appendChild(fig);
        preencherPolaroid(fig, arquivo);
      });
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
      const estado = player.getPlayerState();
      return estado === YT.PlayerState.PLAYING || estado === YT.PlayerState.BUFFERING;
    }

    function atualizarBotao() {
      btn.classList.toggle("tocando", estadoTocando());
    }

    const criarPlayer = function () {
      if (player || !document.getElementById("ytplayer")) return;
      player = new YT.Player("ytplayer", {
        width: "100%",
        height: "100%",
        videoId: CONFIG.youtubeId,
        playerVars: {
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          loop: 1,
          playlist: CONFIG.youtubeId,
        },
        events: {
          onReady: function () {
            pronto = true;
            if (querTocar) player.playVideo();
            atualizarBotao();
          },
          onStateChange: atualizarBotao,
          onError: function () {
            btn.hidden = true;
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
        player.playVideo();
        atualizarBotao();
      }
    }

    function pausar() {
      querTocar = false;
      if (pronto && player) player.pauseVideo();
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
    const tocar = musica();

    function abrir() {
      envelope.classList.add("aberto");
      setTimeout(() => {
        capa.classList.add("saida");
        site.hidden = false;
        site.classList.add("visivel");
        observarRevelar();
        if (tocar) tocar();
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
  }

  aplicarTextos();
  montarCarta();
  montarMotivos();
  montarHistoria();
  montarFotos();
  escolherFotos();
  montarPromessas();
  iniciarContadores();
  petalas();
  abrirCarta();

  $("#btnCoracoes").addEventListener("click", chuvaDeCoracoes);
  document.addEventListener("click", (e) => {
    if (e.target.closest(".capa, .btn-musica, a, button, .player-moldura")) return;
    soltarCoracao(e.clientX, e.clientY);
  });
})();
