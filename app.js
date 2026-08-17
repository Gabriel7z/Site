(function () {
  const money = (n) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const waLink = (text) =>
    `https://wa.me/${WHATSAPP}/?text=${encodeURIComponent(text)}`;

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const state = {
    cart: JSON.parse(localStorage.getItem("ceme-cart") || "[]"),
    filter: "Todos",
    currentAudio: null,
  };

  function saveCart() {
    localStorage.setItem("ceme-cart", JSON.stringify(state.cart));
    renderCart();
  }

  function cartCount() {
    return state.cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function cartTotal() {
    return state.cart.reduce((sum, item) => {
      const p = PRODUCTS.find((x) => x.id === item.id);
      return sum + (p ? p.price * item.qty : 0);
    }, 0);
  }

  function addToCart(id, qty = 1) {
    const found = state.cart.find((i) => i.id === id);
    if (found) found.qty += qty;
    else state.cart.push({ id, qty });
    saveCart();
    openCart();
  }

  function setQty(id, qty) {
    const item = state.cart.find((i) => i.id === id);
    if (!item) return;
    item.qty = Math.max(1, qty);
    saveCart();
  }

  function removeFromCart(id) {
    state.cart = state.cart.filter((i) => i.id !== id);
    saveCart();
  }

  function checkoutWhatsApp() {
    if (!state.cart.length) return;
    const lines = state.cart.map((item) => {
      const p = PRODUCTS.find((x) => x.id === item.id);
      return `• ${p.name} (${p.volume}) x${item.qty} — ${money(p.price * item.qty)}`;
    });
    const text = [
      "Olá, Família CEME! Gostaria de comprar:",
      "",
      ...lines,
      "",
      `Total: ${money(cartTotal())}`,
    ].join("\n");
    window.open(waLink(text), "_blank", "noopener");
  }

  function buyNow(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    const text = `Olá, Família CEME! Gostaria de comprar o ${p.name} (${p.volume}) por ${money(p.price)}.`;
    window.open(waLink(text), "_blank", "noopener");
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
    if (!grid) return;
    const list =
      state.filter === "Todos"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === state.filter);
    grid.innerHTML = list.map(productCard).join("");
  }

  function renderFilters() {
    const wrap = $("#product-filters");
    if (!wrap) return;
    wrap.innerHTML = CATEGORIES.map(
      (c) =>
        `<button type="button" class="filter-btn ${c === state.filter ? "is-active" : ""}" data-filter="${c}">${c}</button>`
    ).join("");
  }

  function openModal(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    stopAudio();
    const modal = $("#product-modal");
    $("#modal-img").src = p.image;
    $("#modal-img").alt = p.name;
    $("#modal-name").textContent = p.name;
    $("#modal-tag").textContent = p.tagline;
    $("#modal-price").textContent = money(p.price);
    $("#modal-desc").textContent = p.description;
    $("#modal-indications").innerHTML = p.indications.map((i) => `<li>${i}</li>`).join("");
    $("#modal-add").dataset.add = p.id;
    $("#modal-buy").dataset.buy = p.id;
    const audioBtn = $("#modal-audio");
    audioBtn.dataset.audio = p.audio;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-panel").focus();
  }

  function closeModal() {
    const modal = $("#product-modal");
    if (!modal) return;
    stopAudio();
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function renderCart() {
    const badge = $("#cart-count");
    if (badge) {
      badge.textContent = cartCount();
      badge.hidden = cartCount() === 0;
    }
    const list = $("#cart-list");
    const empty = $("#cart-empty");
    const footer = $("#cart-footer");
    if (!list) return;
    if (!state.cart.length) {
      list.innerHTML = "";
      empty.hidden = false;
      footer.hidden = true;
      return;
    }
    empty.hidden = true;
    footer.hidden = false;
    list.innerHTML = state.cart
      .map((item) => {
        const p = PRODUCTS.find((x) => x.id === item.id);
        return `
          <li class="cart-item">
            <img src="${p.image}" alt="">
            <div>
              <strong>${p.name}</strong>
              <span>${money(p.price)}</span>
              <div class="qty">
                <button type="button" data-qty-minus="${p.id}" aria-label="Diminuir">−</button>
                <input type="number" min="1" value="${item.qty}" data-qty="${p.id}" aria-label="Quantidade de ${p.name}">
                <button type="button" data-qty-plus="${p.id}" aria-label="Aumentar">+</button>
              </div>
            </div>
            <button type="button" class="icon-btn" data-remove="${p.id}" aria-label="Remover ${p.name}">×</button>
          </li>
        `;
      })
      .join("");
    $("#cart-total").textContent = money(cartTotal());
  }

  function openCart() {
    $("#cart-drawer").classList.add("is-open");
    $("#cart-drawer").setAttribute("aria-hidden", "false");
    $("#overlay").hidden = false;
  }

  function closeCart() {
    $("#cart-drawer").classList.remove("is-open");
    $("#cart-drawer").setAttribute("aria-hidden", "true");
    $("#overlay").hidden = true;
  }

  function maskPhone(value) {
    const d = value.replace(/\D/g, "").slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function setError(id, msg) {
    const field = document.getElementById(id);
    const err = document.getElementById(`${id}-error`);
    if (!field || !err) return;
    field.setAttribute("aria-invalid", msg ? "true" : "false");
    err.textContent = msg || "";
  }

  function validateForm(data) {
    let ok = true;
    if (data.nome.trim().length < 2) {
      setError("nome", "Informe seu nome.");
      ok = false;
    } else setError("nome");
    if (data.sobrenome.trim().length < 2) {
      setError("sobrenome", "Informe seu sobrenome.");
      ok = false;
    } else setError("sobrenome");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("email", "Informe um e-mail válido.");
      ok = false;
    } else setError("email");
    if (data.telefone.replace(/\D/g, "").length < 10) {
      setError("telefone", "Informe um telefone com DDD.");
      ok = false;
    } else setError("telefone");
    if (data.apresentacao.trim().length < 10) {
      setError("apresentacao", "Conte um pouco sobre você (mínimo 10 caracteres).");
      ok = false;
    } else setError("apresentacao");
    if (data.motivo.trim().length < 15) {
      setError("motivo", "Explique sua motivação (mínimo 15 caracteres).");
      ok = false;
    } else setError("motivo");
    return ok;
  }

  function handleForm(e) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!validateForm(data)) {
      const first = form.querySelector("[aria-invalid='true']");
      if (first) first.focus();
      return;
    }
    const text = [
      "Olá, Família CEME! Quero ser distribuidora/prescritora da Linha CEME.",
      "",
      `Nome: ${data.nome} ${data.sobrenome}`,
      `E-mail: ${data.email}`,
      `Telefone: ${data.telefone}`,
      "",
      `Apresentação: ${data.apresentacao}`,
      "",
      `Motivação: ${data.motivo}`,
    ].join("\n");
    window.open(waLink(text), "_blank", "noopener");
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
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
    const header = $(".site-header");
    const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function onClick(e) {
    const t = e.target.closest("[data-filter],[data-open],[data-add],[data-buy],[data-audio],[data-remove],[data-qty-minus],[data-qty-plus]");
    if (!t) return;
    if (t.dataset.filter) {
      state.filter = t.dataset.filter;
      renderFilters();
      renderProducts();
    } else if (t.dataset.open) {
      openModal(t.dataset.open);
    } else if (t.dataset.add) {
      addToCart(t.dataset.add);
    } else if (t.dataset.buy) {
      buyNow(t.dataset.buy);
    } else if (t.dataset.audio) {
      toggleAudio(t, t.dataset.audio);
    } else if (t.dataset.remove) {
      removeFromCart(t.dataset.remove);
    } else if (t.dataset.qtyMinus) {
      const id = t.dataset.qtyMinus;
      const item = state.cart.find((i) => i.id === id);
      if (item) setQty(id, item.qty - 1);
    } else if (t.dataset.qtyPlus) {
      const id = t.dataset.qtyPlus;
      const item = state.cart.find((i) => i.id === id);
      if (item) setQty(id, item.qty + 1);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    renderFilters();
    renderProducts();
    renderCart();
    setupNav();
    document.addEventListener("click", onClick);
    document.addEventListener("change", (e) => {
      const input = e.target.closest("[data-qty]");
      if (input) setQty(input.dataset.qty, Number(input.value) || 1);
    });
    $("#cart-open").addEventListener("click", openCart);
    $("#cart-close").addEventListener("click", closeCart);
    $("#cart-checkout").addEventListener("click", checkoutWhatsApp);
    $("#overlay").addEventListener("click", () => {
      closeCart();
      closeModal();
    });
    $("#modal-close").addEventListener("click", closeModal);
    $("#product-modal").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeModal();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeCart();
        closeModal();
      }
    });
    const phone = $("#telefone");
    phone.addEventListener("input", () => {
      phone.value = maskPhone(phone.value);
    });
    $("#distribuidora-form").addEventListener("submit", handleForm);
    $$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));
  });
})();
