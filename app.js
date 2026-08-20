(function () {
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
  } = window.CemeLoja;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const CART_KEY = "ceme-cart";
  const cart = createCart(PRODUCTS, lerCarrinho());
  const state = {
    filter: "Todos",
    query: "",
    currentAudio: null,
  };

  function lerCarrinho() {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    } catch (e) {
      return [];
    }
  }

  function salvarCarrinho() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart.snapshot()));
    renderCart();
  }

  function stopAudio() {
    $$("audio").forEach((a) => {
      a.pause();
      a.currentTime = 0;
    });
    $$(".audio-btn").forEach((b) => {
      b.classList.remove("is-playing");
      b.setAttribute("aria-pressed", "false");
      const label = b.querySelector(".audio-label");
      if (label) label.textContent = "Ouvir áudio";
    });
    state.currentAudio = null;
  }

  function toggleAudio(btn, src) {
    const audio = btn.parentElement.querySelector("audio");
    if (!audio) return;
    if (state.currentAudio && state.currentAudio !== audio) stopAudio();
    if (audio.paused) {
      audio.src = src;
      audio.play().catch(() => {});
      btn.classList.add("is-playing");
      btn.setAttribute("aria-pressed", "true");
      const label = btn.querySelector(".audio-label");
      if (label) label.textContent = "Pausar áudio";
      state.currentAudio = audio;
      audio.onended = () => stopAudio();
    } else {
      stopAudio();
    }
  }

  function productCard(p) {
    return `
      <article class="card" data-id="${p.id}" data-category="${p.category}">
        <button class="card-media" type="button" data-open="${p.id}" aria-label="Ver detalhes de ${p.name}">
          <img src="${p.image}" alt="${p.name} — ${p.tagline}" loading="lazy" width="900" height="1272">
        </button>
        <div class="card-body">
          <span class="pill">${p.category} · ${p.volume}</span>
          <h3>${p.name}</h3>
          <p class="tagline">${p.tagline}</p>
          <p class="price">${money(p.price)}</p>
          <div class="audio-row">
            <button class="audio-btn" type="button" data-audio="${p.audio}" aria-pressed="false">
              <span class="audio-icon" aria-hidden="true"></span>
              <span class="audio-label">Ouvir áudio</span>
            </button>
            <audio preload="none"></audio>
          </div>
          <div class="card-actions">
            <button class="btn btn-ghost" type="button" data-add="${p.id}">Adicionar</button>
            <button class="btn btn-gold" type="button" data-buy="${p.id}">Comprar</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const grid = $("#product-grid");
    const empty = $("#product-empty");
    const count = $("#product-count");
    if (!grid) return;
    const list = filterProducts(PRODUCTS, state.filter, state.query);
    grid.innerHTML = list.map(productCard).join("");
    if (empty) empty.hidden = list.length > 0;
    if (count) {
      count.textContent =
        list.length === PRODUCTS.length
          ? `${PRODUCTS.length} biomoduladores`
          : `${list.length} de ${PRODUCTS.length} biomoduladores`;
    }
  }

  function renderFilters() {
    const wrap = $("#product-filters");
    if (!wrap) return;
    wrap.innerHTML = CATEGORIES.map(
      (c) =>
        `<button type="button" class="filter-btn ${c === state.filter ? "is-active" : ""}" data-filter="${c}" aria-pressed="${c === state.filter}">${c}</button>`
    ).join("");
  }

  function openModal(id) {
    const p = findProduct(PRODUCTS, id);
    if (!p) return;
    stopAudio();
    closeCart();
    closeMenu();
    const modal = $("#product-modal");
    $("#modal-img").src = p.image;
    $("#modal-img").alt = p.name;
    $("#modal-name").textContent = p.name;
    $("#modal-tag").textContent = `${p.category} · ${p.volume}`;
    $("#modal-price").textContent = money(p.price);
    $("#modal-desc").textContent = p.description;
    $("#modal-indications").innerHTML = p.indications.map((i) => `<li>${i}</li>`).join("");
    $("#modal-add").dataset.add = p.id;
    $("#modal-buy").dataset.buy = p.id;
    $("#modal-audio").dataset.audio = p.audio;
    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (history.replaceState) {
      history.replaceState(null, "", `#produto-${p.id}`);
    }
    const closeBtn = $("#modal-close");
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    const modal = $("#product-modal");
    if (!modal || modal.hidden) return;
    stopAudio();
    modal.classList.remove("is-open");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    if (location.hash.indexOf("#produto-") === 0 && history.replaceState) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

  function renderCart() {
    const badge = $("#cart-count");
    const n = cart.count();
    if (badge) {
      badge.textContent = n;
      badge.hidden = n === 0;
    }
    const list = $("#cart-list");
    const empty = $("#cart-empty");
    const footer = $("#cart-footer");
    if (!list) return;
    const linhas = cart.lines();
    if (!linhas.length) {
      list.innerHTML = "";
      if (empty) empty.hidden = false;
      if (footer) footer.hidden = true;
      return;
    }
    if (empty) empty.hidden = true;
    if (footer) footer.hidden = false;
    list.innerHTML = linhas
      .map(
        (l) => `
          <li class="cart-item">
            <img src="${l.image}" alt="">
            <div>
              <strong>${l.name}</strong>
              <span>${money(l.price)}</span>
              <div class="qty">
                <button type="button" data-qty-minus="${l.id}" aria-label="Diminuir">−</button>
                <input type="number" min="1" value="${l.qty}" data-qty="${l.id}" aria-label="Quantidade de ${l.name}">
                <button type="button" data-qty-plus="${l.id}" aria-label="Aumentar">+</button>
              </div>
            </div>
            <button type="button" class="icon-btn" data-remove="${l.id}" aria-label="Remover ${l.name}">×</button>
          </li>`
      )
      .join("");
    $("#cart-total").textContent = money(cart.total());
  }

  function openCart() {
    closeModal();
    closeMenu();
    $("#cart-drawer").classList.add("is-open");
    $("#cart-drawer").setAttribute("aria-hidden", "false");
    $("#overlay").hidden = false;
  }

  function closeCart() {
    $("#cart-drawer").classList.remove("is-open");
    $("#cart-drawer").setAttribute("aria-hidden", "true");
    $("#overlay").hidden = true;
  }

  function closeMenu() {
    const nav = $("#site-nav");
    const toggle = $("#menu-toggle");
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function setError(id, msg) {
    const field = document.getElementById(id);
    const err = document.getElementById(`${id}-error`);
    if (!field || !err) return;
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    err.textContent = msg || "";
  }

  function handleForm(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const resultado = validatePrescritora(data);
    ["nome", "sobrenome", "email", "telefone", "apresentacao", "motivo"].forEach((id) => {
      setError(id, resultado.errors[id] || "");
    });
    if (!resultado.ok) {
      const first = form.querySelector("[aria-invalid='true']");
      if (first) first.focus();
      return;
    }
    window.open(waLink(prescritoraText(data), WHATSAPP), "_blank", "noopener");
    form.reset();
    $("#form-success").hidden = false;
    $("#form-success").scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function setupNav() {
    const toggle = $("#menu-toggle");
    const nav = $("#site-nav");
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    $$("#site-nav a").forEach((a) =>
      a.addEventListener("click", () => {
        closeMenu();
      })
    );
    const header = $("#site-header");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function setupFaq() {
    $$(".faq-item").forEach((item) => {
      const btn = item.querySelector("button");
      const panel = item.querySelector(".faq-panel");
      if (!btn || !panel) return;
      btn.addEventListener("click", () => {
        const aberto = item.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", String(aberto));
      });
    });
  }

  function setupReveal() {
    const blocos = $$(".revelar");
    if (!("IntersectionObserver" in window) || !blocos.length) {
      blocos.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    blocos.forEach((el) => io.observe(el));
  }

  function onClick(e) {
    const t = e.target.closest(
      "[data-filter],[data-open],[data-add],[data-buy],[data-audio],[data-remove],[data-qty-minus],[data-qty-plus]"
    );
    if (!t) return;
    if (t.dataset.filter) {
      state.filter = t.dataset.filter;
      renderFilters();
      renderProducts();
    } else if (t.dataset.open) {
      openModal(t.dataset.open);
    } else if (t.dataset.add) {
      cart.add(t.dataset.add);
      salvarCarrinho();
      openCart();
    } else if (t.dataset.buy) {
      const p = findProduct(PRODUCTS, t.dataset.buy);
      window.open(waLink(buyNowText(p), WHATSAPP), "_blank", "noopener");
    } else if (t.dataset.audio) {
      toggleAudio(t, t.dataset.audio);
    } else if (t.dataset.remove) {
      cart.remove(t.dataset.remove);
      salvarCarrinho();
    } else if (t.dataset.qtyMinus) {
      const id = t.dataset.qtyMinus;
      const item = cart.snapshot().find((i) => i.id === id);
      if (item) {
        cart.setQty(id, item.qty - 1);
        salvarCarrinho();
      }
    } else if (t.dataset.qtyPlus) {
      const id = t.dataset.qtyPlus;
      const item = cart.snapshot().find((i) => i.id === id);
      if (item) {
        cart.setQty(id, item.qty + 1);
        salvarCarrinho();
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderFilters();
    renderProducts();
    renderCart();
    setupNav();
    setupFaq();
    setupReveal();
    document.addEventListener("click", onClick);
    document.addEventListener("change", (e) => {
      const input = e.target.closest("[data-qty]");
      if (input) {
        cart.setQty(input.dataset.qty, Number(input.value) || 1);
        salvarCarrinho();
      }
    });
    const busca = $("#product-search");
    if (busca) {
      busca.addEventListener("input", () => {
        state.query = busca.value;
        renderProducts();
      });
    }
    $("#cart-open").addEventListener("click", openCart);
    $("#cart-close").addEventListener("click", closeCart);
    $("#cart-checkout").addEventListener("click", () => {
      const texto = cart.checkoutText();
      if (!texto) return;
      window.open(waLink(texto, WHATSAPP), "_blank", "noopener");
    });
    $("#overlay").addEventListener("click", () => {
      closeCart();
      closeMenu();
    });
    $("#modal-close").addEventListener("click", closeModal);
    $("#product-modal").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeCart();
        closeModal();
        closeMenu();
      }
    });
    const phone = $("#telefone");
    phone.addEventListener("input", () => {
      phone.value = maskPhone(phone.value);
    });
    $("#distribuidora-form").addEventListener("submit", handleForm);
    $$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));

    const produto = produtoDaUrl(location.search, location.hash, PRODUCTS);
    if (produto) openModal(produto);
  });
})();
