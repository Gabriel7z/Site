(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const state = {
    cart: JSON.parse(localStorage.getItem("ceme-cart") || "[]"),
    filter: "todos",
    currentAudio: null,
    lang: localStorage.getItem("ceme-lang") || "pt",
    lightboxIndex: 0,
    formTried: false,
  };

  const GALLERY = [
    { src: "assets/img/familia-completa.jpg", altKey: "familyAlt2" },
    { src: "assets/img/familia-fundadores.jpg", altKey: "familyAlt1" },
    { src: "assets/img/familia-luana.jpg", altKey: "familyAlt3" },
    { src: "assets/img/familia-livros.jpg", altKey: "familyAlt4" },
    { src: "assets/img/familia-momento-1.jpg", altKey: "familyAlt5" },
  ];

  if (!I18N[state.lang]) state.lang = "pt";

  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || I18N.pt[key] || key;
  }

  function money(n) {
    const locales = { pt: "pt-BR", en: "en-US", de: "de-DE" };
    return n.toLocaleString(locales[state.lang] || "pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  function waLink(text) {
    return `https://wa.me/${WHATSAPP}/?text=${encodeURIComponent(text)}`;
  }

  function localizedProduct(p) {
    const copy = (p.i18n && (p.i18n[state.lang] || p.i18n.pt)) || {};
    return {
      ...p,
      tagline: copy.tagline || "",
      description: copy.description || "",
      indications: copy.indications || [],
      categoryLabel: t(`cat_${p.category}`),
    };
  }

  function applyStaticI18n() {
    const dict = I18N[state.lang] || I18N.pt;
    document.documentElement.lang = dict.htmlLang || "pt-BR";

    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key || dict[key] == null) return;
      if (el.tagName === "TITLE" || el.tagName === "META") {
        if (el.tagName === "TITLE") el.textContent = dict[key];
        else el.setAttribute("content", dict[key]);
      } else {
        el.textContent = dict[key];
      }
    });

    $$("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (key && dict[key] != null) el.setAttribute("placeholder", dict[key]);
    });

    $$("[data-i18n-aria]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria");
      if (key && dict[key] != null) el.setAttribute("aria-label", dict[key]);
    });

    $$("[data-i18n-alt]").forEach((el) => {
      const key = el.getAttribute("data-i18n-alt");
      if (key && dict[key] != null) el.setAttribute("alt", dict[key]);
    });

    const evalText = encodeURIComponent(t("waEval"));
    ["#cta-eval-hero", "#cta-eval-band"].forEach((sel) => {
      const a = $(sel);
      if (a) a.href = `https://wa.me/${WHATSAPP}/?text=${evalText}`;
    });

    $$(".lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === state.lang;
      btn.classList.toggle("is-active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    $$("[data-lightbox]").forEach((btn) => {
      btn.setAttribute("aria-label", t("openPhoto"));
    });

    const waFloat = $("#wa-float");
    if (waFloat) {
      waFloat.href = `https://wa.me/${WHATSAPP}/?text=${encodeURIComponent(t("waEval"))}`;
    }
  }

  function setLanguage(lang) {
    if (!I18N[lang]) return;
    state.lang = lang;
    localStorage.setItem("ceme-lang", lang);
    if (!CATEGORY_KEYS.includes(state.filter)) state.filter = "todos";
    applyStaticI18n();
    renderFilters();
    renderProducts();
    renderCart();
    const modal = $("#product-modal");
    if (modal && !modal.hidden && modal.dataset.openId) {
      openModal(modal.dataset.openId);
    }
  }

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
    showToast(t("toastAdded"));
    openCart();
  }

  function showToast(message) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = message;
    el.hidden = false;
    requestAnimationFrame(() => el.classList.add("is-on"));
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      el.classList.remove("is-on");
      setTimeout(() => {
        el.hidden = true;
      }, 250);
    }, 2200);
  }

  function openLightbox(index) {
    state.lightboxIndex = (index + GALLERY.length) % GALLERY.length;
    const item = GALLERY[state.lightboxIndex];
    const box = $("#lightbox");
    const img = $("#lightbox-img");
    img.src = item.src;
    img.alt = t(item.altKey);
    box.hidden = false;
    box.classList.add("is-open");
    box.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    const box = $("#lightbox");
    if (!box) return;
    box.classList.remove("is-open");
    box.hidden = true;
    box.setAttribute("aria-hidden", "true");
    if ($("#product-modal")?.hidden) document.body.style.overflow = "";
  }

  function setupReveal() {
    const nodes = $$(".reveal");
    if (!nodes.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -40px 0px" }
    );
    nodes.forEach((n) => io.observe(n));
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
    const text = [t("waHelloBuy"), "", ...lines, "", `${t("waTotal")} ${money(cartTotal())}`].join(
      "\n"
    );
    window.open(waLink(text), "_blank", "noopener");
  }

  function buyNow(id) {
    const p = PRODUCTS.find((x) => x.id === id);
    const text = t("waHelloBuyOne")
      .replace("{name}", p.name)
      .replace("{volume}", p.volume)
      .replace("{price}", money(p.price));
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
      if (label) label.textContent = t("listenAudio");
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
      if (label) label.textContent = t("pauseAudio");
      state.currentAudio = audio;
      audio.onended = () => stopAudio();
    } else {
      stopAudio();
    }
  }

  function productCard(raw) {
    const p = localizedProduct(raw);
    return `
      <article class="card" data-id="${p.id}" data-category="${p.category}">
        <button class="card-media" type="button" data-open="${p.id}" aria-label="${t("detailsOf")} ${p.name}">
          <img src="${p.image}" alt="${p.name} — ${p.tagline}" loading="lazy" width="900" height="1272">
        </button>
        <div class="card-body">
          <span class="pill">${p.categoryLabel} · ${p.volume}</span>
          <h3>${p.name}</h3>
          <p class="tagline">${p.tagline}</p>
          <p class="price">${money(p.price)}</p>
          <div class="audio-row">
            <button class="audio-btn" type="button" data-audio="${p.audio}" aria-pressed="false">
              <span class="audio-icon" aria-hidden="true"></span>
              <span class="audio-label">${t("listenAudio")}</span>
            </button>
            <audio preload="none"></audio>
          </div>
          <div class="card-actions">
            <button class="btn btn-ghost" type="button" data-add="${p.id}">${t("add")}</button>
            <button class="btn btn-gold" type="button" data-buy="${p.id}">${t("buy")}</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderProducts() {
    const grid = $("#product-grid");
    if (!grid) return;
    const list =
      state.filter === "todos"
        ? PRODUCTS
        : PRODUCTS.filter((p) => p.category === state.filter);
    grid.innerHTML = list.map(productCard).join("");
  }

  function renderFilters() {
    const wrap = $("#product-filters");
    if (!wrap) return;
    wrap.innerHTML = CATEGORY_KEYS.map(
      (c) =>
        `<button type="button" class="filter-btn ${c === state.filter ? "is-active" : ""}" data-filter="${c}">${t(
          `cat_${c}`
        )}</button>`
    ).join("");
  }

  function openModal(id) {
    const raw = PRODUCTS.find((x) => x.id === id);
    if (!raw) return;
    const p = localizedProduct(raw);
    stopAudio();
    closeCart();
    const modal = $("#product-modal");
    modal.dataset.openId = id;
    $("#modal-img").src = p.image;
    $("#modal-img").alt = p.name;
    $("#modal-name").textContent = p.name;
    $("#modal-tag").textContent = p.tagline;
    $("#modal-price").textContent = money(p.price);
    $("#modal-desc").textContent = p.description;
    $("#modal-indications").innerHTML = p.indications.map((i) => `<li>${i}</li>`).join("");
    $("#modal-add").dataset.add = p.id;
    $("#modal-buy").dataset.buy = p.id;
    $("#modal-add").textContent = t("add");
    $("#modal-buy").textContent = t("buy");
    const audioBtn = $("#modal-audio");
    audioBtn.dataset.audio = p.audio;
    const label = audioBtn.querySelector(".audio-label");
    if (label) label.textContent = t("listenAudio");
    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.body.style.overflow = "hidden";
    modal.querySelector(".modal-panel").focus();
  }

  function closeModal() {
    const modal = $("#product-modal");
    if (!modal) return;
    stopAudio();
    modal.classList.remove("is-open");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    delete modal.dataset.openId;
    document.body.classList.remove("modal-open");
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
                <button type="button" data-qty-minus="${p.id}" aria-label="${t("decrease")}">−</button>
                <input type="number" min="1" value="${item.qty}" data-qty="${p.id}" aria-label="${t("qtyOf")} ${p.name}">
                <button type="button" data-qty-plus="${p.id}" aria-label="${t("increase")}">+</button>
              </div>
            </div>
            <button type="button" class="icon-btn" data-remove="${p.id}" aria-label="${t("remove")} ${p.name}">×</button>
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
    // sem lista vermelha embaixo de cada campo — só marca o input
    err.textContent = "";
  }

  function clearFormFeedback() {
    ["nome", "sobrenome", "email", "telefone", "apresentacao", "motivo"].forEach((id) =>
      setError(id)
    );
    const hint = $("#form-hint");
    if (hint) hint.hidden = true;
  }

  function validateForm(data) {
    let ok = true;
    if (data.nome.trim().length < 2) {
      setError("nome", t("errName"));
      ok = false;
    } else setError("nome");
    if (data.sobrenome.trim().length < 2) {
      setError("sobrenome", t("errSurname"));
      ok = false;
    } else setError("sobrenome");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      setError("email", t("errEmail"));
      ok = false;
    } else setError("email");
    if (data.telefone.replace(/\D/g, "").length < 10) {
      setError("telefone", t("errPhone"));
      ok = false;
    } else setError("telefone");
    if (data.apresentacao.trim().length < 10) {
      setError("apresentacao", t("errAbout"));
      ok = false;
    } else setError("apresentacao");
    if (data.motivo.trim().length < 15) {
      setError("motivo", t("errWhy"));
      ok = false;
    } else setError("motivo");
    const hint = $("#form-hint");
    if (hint) hint.hidden = ok;
    return ok;
  }

  function handleForm(e) {
    e.preventDefault();
    const form = e.currentTarget;
    state.formTried = true;
    const data = Object.fromEntries(new FormData(form).entries());
    if (!validateForm(data)) {
      const first = form.querySelector("[aria-invalid='true']");
      if (first) first.focus();
      return;
    }
    const text = [
      t("waFormHello"),
      "",
      `${t("waFormName")} ${data.nome} ${data.sobrenome}`,
      `${t("waFormEmail")} ${data.email}`,
      `${t("waFormPhone")} ${data.telefone}`,
      "",
      `${t("waFormAbout")} ${data.apresentacao}`,
      "",
      `${t("waFormWhy")} ${data.motivo}`,
    ].join("\n");
    window.open(waLink(text), "_blank", "noopener");
    form.reset();
    state.formTried = false;
    clearFormFeedback();
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
    const langBtn = e.target.closest("[data-lang]");
    if (langBtn && langBtn.dataset.lang) {
      setLanguage(langBtn.dataset.lang);
      return;
    }

    const shot = e.target.closest("[data-lightbox]");
    if (shot && shot.dataset.lightbox != null) {
      openLightbox(Number(shot.dataset.lightbox));
      return;
    }

    const tEl = e.target.closest(
      "[data-filter],[data-open],[data-add],[data-buy],[data-audio],[data-remove],[data-qty-minus],[data-qty-plus]"
    );
    if (!tEl) return;
    if (tEl.dataset.filter) {
      state.filter = tEl.dataset.filter;
      renderFilters();
      renderProducts();
    } else if (tEl.dataset.open) {
      openModal(tEl.dataset.open);
    } else if (tEl.dataset.add) {
      addToCart(tEl.dataset.add);
    } else if (tEl.dataset.buy) {
      buyNow(tEl.dataset.buy);
    } else if (tEl.dataset.audio) {
      toggleAudio(tEl, tEl.dataset.audio);
    } else if (tEl.dataset.remove) {
      removeFromCart(tEl.dataset.remove);
    } else if (tEl.dataset.qtyMinus) {
      const id = tEl.dataset.qtyMinus;
      const item = state.cart.find((i) => i.id === id);
      if (item) setQty(id, item.qty - 1);
    } else if (tEl.dataset.qtyPlus) {
      const id = tEl.dataset.qtyPlus;
      const item = state.cart.find((i) => i.id === id);
      if (item) setQty(id, item.qty + 1);
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    applyStaticI18n();
    renderFilters();
    renderProducts();
    renderCart();
    setupNav();
    setupReveal();
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
    $("#lightbox-close").addEventListener("click", closeLightbox);
    $("#lightbox-prev").addEventListener("click", () => openLightbox(state.lightboxIndex - 1));
    $("#lightbox-next").addEventListener("click", () => openLightbox(state.lightboxIndex + 1));
    $("#lightbox").addEventListener("click", (e) => {
      if (e.target === e.currentTarget) closeLightbox();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeCart();
        closeModal();
        closeLightbox();
      }
      if (!$("#lightbox")?.hidden) {
        if (e.key === "ArrowLeft") openLightbox(state.lightboxIndex - 1);
        if (e.key === "ArrowRight") openLightbox(state.lightboxIndex + 1);
      }
    });
    const phone = $("#telefone");
    phone.addEventListener("input", () => {
      phone.value = maskPhone(phone.value);
      if (state.formTried) {
        const data = Object.fromEntries(new FormData($("#distribuidora-form")).entries());
        validateForm(data);
      }
    });
    ["nome", "sobrenome", "email", "apresentacao", "motivo"].forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener("input", () => {
        if (!state.formTried) return;
        const data = Object.fromEntries(new FormData($("#distribuidora-form")).entries());
        validateForm(data);
      });
    });
    $("#distribuidora-form").addEventListener("submit", handleForm);
    $$(".js-year").forEach((el) => (el.textContent = new Date().getFullYear()));
  });
})();
