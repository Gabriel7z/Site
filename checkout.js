(function () {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const cfg = () => window.CEME_CHECKOUT || {};
  const shop = () => window.CEMEShop;

  const state = {
    step: "data",
    paying: false,
    demo: true,
    orderId: "",
    lastQuoteTotal: 0,
    idempotencyKey: "",
  };

  function t(key) {
    return shop() ? shop().t(key) : key;
  }

  function money(n) {
    return shop() ? shop().money(n) : `R$ ${Number(n).toFixed(2)}`;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function onlyDigits(value) {
    return String(value || "").replace(/\D/g, "");
  }

  function isEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
  }

  function isCpf(value) {
    const cpf = onlyDigits(value);
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
    let sum = 0;
    for (let i = 0; i < 9; i += 1) sum += Number(cpf[i]) * (10 - i);
    let d1 = (sum * 10) % 11;
    if (d1 === 10) d1 = 0;
    if (d1 !== Number(cpf[9])) return false;
    sum = 0;
    for (let i = 0; i < 10; i += 1) sum += Number(cpf[i]) * (11 - i);
    let d2 = (sum * 10) % 11;
    if (d2 === 10) d2 = 0;
    return d2 === Number(cpf[10]);
  }

  function luhn(value) {
    const s = onlyDigits(value);
    if (s.length < 13 || s.length > 19) return false;
    let sum = 0;
    let alt = false;
    for (let i = s.length - 1; i >= 0; i -= 1) {
      let n = Number(s[i]);
      if (alt) {
        n *= 2;
        if (n > 9) n -= 9;
      }
      sum += n;
      alt = !alt;
    }
    return sum % 10 === 0;
  }

  function cardBrand(num) {
    const n = onlyDigits(num);
    if (/^3[47]/.test(n)) return "amex";
    if (/^(5[1-5]|222[1-9]|22[3-9]|2[3-6]|27[01]|2720)/.test(n)) return "mastercard";
    if (/^(4011|4312|4389|4514|4576|5041|5066|5067|5090|6277|6362|6363|6504|6505|6509|6516|6550)/.test(n)) {
      return "elo";
    }
    if (/^(606282|3841|637095|637568|637599|637609|637612)/.test(n)) return "hipercard";
    if (/^4/.test(n)) return "visa";
    return "";
  }

  function mpBrand(brand) {
    if (brand === "mastercard") return "master";
    return brand || undefined;
  }

  function brandLabel(brand) {
    return (
      {
        visa: "Visa",
        mastercard: "Mastercard",
        amex: "Amex",
        elo: "Elo",
        hipercard: "Hipercard",
      }[brand] || "CEME"
    );
  }

  function maskCpf(value) {
    const d = onlyDigits(value).slice(0, 11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
    if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
    return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
  }

  function maskCep(value) {
    const d = onlyDigits(value).slice(0, 8);
    if (d.length <= 5) return d;
    return `${d.slice(0, 5)}-${d.slice(5)}`;
  }

  function maskCard(value) {
    const brand = cardBrand(value);
    const max = brand === "amex" ? 15 : 16;
    const d = onlyDigits(value).slice(0, max);
    if (brand === "amex") {
      return d.replace(/^(\d{0,4})(\d{0,6})(\d{0,5}).*/, (_, a, b, c) =>
        [a, b, c].filter(Boolean).join(" ")
      );
    }
    return d.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
  }

  function maskExpiry(value) {
    const d = onlyDigits(value).slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  }

  function parseExpiry(value) {
    const d = onlyDigits(value);
    if (d.length !== 4) return null;
    const month = Number(d.slice(0, 2));
    const year = 2000 + Number(d.slice(2));
    if (month < 1 || month > 12) return null;
    const now = new Date();
    const exp = new Date(year, month, 1);
    if (exp <= now) return null;
    return { month: String(month).padStart(2, "0"), year: String(year) };
  }

  function cartItems() {
    if (!shop()) return [];
    return shop().getCart();
  }

  function quote() {
    const shipping = Number(cfg().shippingFee || 0);
    const items = cartItems()
      .map((item) => {
        const product = PRODUCTS.find((p) => p.id === item.id);
        if (!product) return null;
        return {
          ...item,
          name: product.name,
          image: product.image,
          volume: product.volume,
          unitPrice: product.price,
          lineTotal: product.price * item.qty,
        };
      })
      .filter(Boolean);
    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    return { items, subtotal, shipping, total: subtotal + shipping };
  }

  function installmentOptions(total) {
    const max = Math.min(12, Math.max(1, Number(cfg().maxInstallments || 3)));
    const options = [];
    for (let n = 1; n <= max; n += 1) {
      const value = Math.round((total / n) * 100) / 100;
      if (n > 1 && value < 20) break;
      options.push({ n, value });
    }
    return options;
  }

  function setError(id, msg) {
    const field = document.getElementById(id);
    const err = document.getElementById(`${id}-error`);
    if (field) field.setAttribute("aria-invalid", msg ? "true" : "false");
    if (err) err.textContent = msg || "";
  }

  function formData() {
    const get = (id) => (document.getElementById(id)?.value || "").trim();
    return {
      name: get("pay-name"),
      email: get("pay-email"),
      phone: get("pay-phone"),
      cpf: get("pay-cpf"),
      cep: get("pay-cep"),
      street: get("pay-street"),
      number: get("pay-number"),
      complement: get("pay-complement"),
      neighborhood: get("pay-neighborhood"),
      city: get("pay-city"),
      state: get("pay-state"),
      cardNumber: get("pay-card-number"),
      cardName: get("pay-card-name"),
      cardExpiry: get("pay-card-expiry"),
      cardCvv: get("pay-card-cvv"),
      installments: Number(document.getElementById("pay-installments")?.value || 1),
    };
  }

  function validateData(data) {
    let ok = true;
    if (data.name.length < 3) {
      setError("pay-name", t("errPayName"));
      ok = false;
    } else setError("pay-name");
    if (!isEmail(data.email)) {
      setError("pay-email", t("errEmail"));
      ok = false;
    } else setError("pay-email");
    if (onlyDigits(data.phone).length < 10) {
      setError("pay-phone", t("errPhone"));
      ok = false;
    } else setError("pay-phone");
    if (!isCpf(data.cpf)) {
      setError("pay-cpf", t("errCpf"));
      ok = false;
    } else setError("pay-cpf");
    if (onlyDigits(data.cep).length !== 8) {
      setError("pay-cep", t("errCep"));
      ok = false;
    } else setError("pay-cep");
    if (data.street.length < 2) {
      setError("pay-street", t("errStreet"));
      ok = false;
    } else setError("pay-street");
    if (!data.number) {
      setError("pay-number", t("errNumber"));
      ok = false;
    } else setError("pay-number");
    if (data.neighborhood.length < 2) {
      setError("pay-neighborhood", t("errNeighborhood"));
      ok = false;
    } else setError("pay-neighborhood");
    if (data.city.length < 2) {
      setError("pay-city", t("errCity"));
      ok = false;
    } else setError("pay-city");
    if (!/^[A-Za-z]{2}$/.test(data.state)) {
      setError("pay-state", t("errState"));
      ok = false;
    } else setError("pay-state");
    return ok;
  }

  function validateCard(data) {
    let ok = true;
    const brand = cardBrand(data.cardNumber);
    const digits = onlyDigits(data.cardNumber);
    const need = brand === "amex" ? 15 : 16;
    if (digits.length !== need || !luhn(digits)) {
      setError("pay-card-number", t("errCard"));
      ok = false;
    } else setError("pay-card-number");
    if (data.cardName.length < 3) {
      setError("pay-card-name", t("errCardName"));
      ok = false;
    } else setError("pay-card-name");
    if (!parseExpiry(data.cardExpiry)) {
      setError("pay-card-expiry", t("errExpiry"));
      ok = false;
    } else setError("pay-card-expiry");
    const cvvLen = brand === "amex" ? 4 : 3;
    if (onlyDigits(data.cardCvv).length !== cvvLen) {
      setError("pay-card-cvv", t("errCvv"));
      ok = false;
    } else setError("pay-card-cvv");
    return ok;
  }

  function renderSummary() {
    const { items, subtotal, shipping, total } = quote();
    const list = $("#checkout-items");
    if (!list) return;
    list.innerHTML = items
      .map(
        (item) => `
        <li>
          <img src="${escapeHtml(item.image)}" alt="">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${item.qty} × ${money(item.unitPrice)}</span>
          </div>
          <em>${money(item.lineTotal)}</em>
        </li>`
      )
      .join("");
    $("#checkout-subtotal").textContent = money(subtotal);
    $("#checkout-shipping").textContent = shipping ? money(shipping) : t("checkoutShippingFree");
    $("#checkout-total").textContent = money(total);
    const payBtn = $("#checkout-pay");
    if (payBtn) payBtn.textContent = t("checkoutPayNow").replace("{price}", money(total));
    renderInstallments(total);
    state.lastQuoteTotal = total;
  }

  function renderInstallments(total) {
    const select = $("#pay-installments");
    if (!select) return;
    const current = select.value;
    select.innerHTML = installmentOptions(total)
      .map((option) => {
        const label =
          option.n === 1
            ? t("installment1x").replace("{price}", money(option.value))
            : t("installmentNx")
                .replace("{n}", String(option.n))
                .replace("{price}", money(option.value));
        return `<option value="${option.n}">${label}</option>`;
      })
      .join("");
    if ([...select.options].some((opt) => opt.value === current)) select.value = current;
  }

  function setStep(step) {
    state.step = step;
    $$(".checkout-step").forEach((el) => {
      el.hidden = el.dataset.step !== step;
    });
    $$(".checkout-progress span").forEach((el) => {
      el.classList.toggle("is-active", el.dataset.step === step);
      el.classList.toggle("is-done", ["data", "pay", "done"].indexOf(el.dataset.step) < ["data", "pay", "done"].indexOf(step));
    });
    const title = $("#checkout-title");
    if (title) {
      title.textContent =
        step === "done" ? t("checkoutSuccessTitle") : t("checkoutTitle");
    }
  }

  function updateCardPreview() {
    const data = formData();
    const digits = onlyDigits(data.cardNumber);
    const brand = cardBrand(digits);
    const display =
      digits.length > 4
        ? maskCard(digits.padEnd(brand === "amex" ? 15 : 16, "•"))
        : t("checkoutCardPlaceholder");
    $("#pay-card-preview-number").textContent = display;
    $("#pay-card-preview-name").textContent = data.cardName || t("phCardName");
    $("#pay-card-preview-expiry").textContent = data.cardExpiry || "MM/AA";
    $("#pay-card-preview-brand").textContent = brandLabel(brand);
    $("#pay-card-visual").classList.toggle("is-amex", brand === "amex");
  }

  async function fillAddressFromCep() {
    const cep = onlyDigits($("#pay-cep").value);
    if (cep.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await res.json();
      if (data.erro) return;
      if (data.logradouro) $("#pay-street").value = data.logradouro;
      if (data.bairro) $("#pay-neighborhood").value = data.bairro;
      if (data.localidade) $("#pay-city").value = data.localidade;
      if (data.uf) $("#pay-state").value = data.uf;
    } catch {
      /* ignore lookup failures */
    }
  }

  function loadMpSdk() {
    if (window.MercadoPago) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://sdk.mercadopago.com/js/v2";
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  async function loadRemoteConfig() {
    const apiUrl = String(cfg().apiUrl || "").replace(/\/$/, "");
    if (!apiUrl) {
      state.demo = true;
      return;
    }
    try {
      const res = await fetch(`${apiUrl}/api/config`);
      const data = await res.json();
      if (data.mpPublicKey) cfg().mpPublicKey = data.mpPublicKey;
      if (typeof data.shippingFee === "number") cfg().shippingFee = data.shippingFee;
      if (data.maxInstallments) cfg().maxInstallments = data.maxInstallments;
      state.demo = !!data.demo;
    } catch {
      state.demo = !cfg().mpPublicKey;
    }
  }

  function showDemoBanner() {
    const banner = $("#checkout-demo-banner");
    if (banner) banner.hidden = !state.demo;
  }

  async function tokenizeCard(data) {
    const key = cfg().mpPublicKey;
    if (!key || state.demo) return null;
    await loadMpSdk();
    const mp = new window.MercadoPago(key, { locale: "pt-BR" });
    const expiry = parseExpiry(data.cardExpiry);
    const tokenRes = await mp.createCardToken({
      cardNumber: onlyDigits(data.cardNumber),
      cardholderName: data.cardName,
      cardExpirationMonth: expiry.month,
      cardExpirationYear: expiry.year,
      securityCode: onlyDigits(data.cardCvv),
      identificationType: "CPF",
      identificationNumber: onlyDigits(data.cpf),
    });
    return tokenRes;
  }

  function demoPay(data) {
    return new Promise((resolve, reject) => {
      window.setTimeout(() => {
        const decision = (() => {
          const num = onlyDigits(data.cardNumber);
          if (num === "4000000000000002" || num === "4000000000009995") return "rejected";
          return luhn(num) ? "approved" : "invalid";
        })();
        if (decision === "invalid") {
          reject(Object.assign(new Error("invalid_card"), { code: "invalid_card" }));
          return;
        }
        if (decision === "rejected") {
          reject(Object.assign(new Error("rejected"), { code: "rejected" }));
          return;
        }
        resolve({
          status: "approved",
          demo: true,
          orderId: `CEME-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
        });
      }, 900);
    });
  }

  async function payOnApi(payload) {
    const apiUrl = String(cfg().apiUrl || "").replace(/\/$/, "");
    const res = await fetch(`${apiUrl}/api/pay`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw Object.assign(new Error(data.error || "pay_failed"), { code: data.error, data });
    }
    return data;
  }

  function setPayMessage(msg, kind) {
    const el = $("#checkout-pay-message");
    if (!el) return;
    el.hidden = !msg;
    el.textContent = msg || "";
    el.classList.toggle("is-error", kind === "error");
  }

  async function submitPayment() {
    if (state.paying) return;
    const data = formData();
    if (!validateCard(data)) return;
    const { items, total } = quote();
    if (!items.length || total <= 0) return;

    state.paying = true;
    const btn = $("#checkout-pay");
    if (btn) {
      btn.disabled = true;
      btn.textContent = t("checkoutProcessing");
    }
    setPayMessage("");

    try {
      const tokenRes = await tokenizeCard(data);
      const payload = {
        items: items.map((item) => ({ id: item.id, qty: item.qty })),
        installments: data.installments,
        token: tokenRes?.id || null,
        paymentMethodId: tokenRes?.payment_method_id || mpBrand(cardBrand(data.cardNumber)),
        issuerId: tokenRes?.issuer_id || undefined,
        idempotencyKey: state.idempotencyKey,
        payer: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
          cep: data.cep,
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
        },
      };
      if (state.demo) payload.card = { number: onlyDigits(data.cardNumber) };

      const result = String(cfg().apiUrl || "")
        ? await payOnApi(payload)
        : await demoPay(data);

      if (result.status !== "approved" && result.status !== "in_process") {
        throw Object.assign(new Error(result.status || "rejected"), { code: result.status });
      }

      state.orderId = result.orderId;
      $("#checkout-order-id").textContent = result.orderId;
      $("#checkout-success-text").textContent = t(
        result.demo || state.demo ? "checkoutDemoSuccess" : "checkoutSuccessText"
      ).replace("{order}", result.orderId);
      if (shop()) shop().clearCart();
      setStep("done");
    } catch (err) {
      const code = err.code || "";
      setPayMessage(
        code === "rejected" ? t("checkoutDeclined") : t("checkoutPayError"),
        "error"
      );
    } finally {
      state.paying = false;
      if (btn) {
        btn.disabled = false;
        btn.textContent = t("checkoutPayNow").replace("{price}", money(quote().total));
      }
    }
  }

  function open() {
    if (!shop() || !cartItems().length) return;
    shop().closeCart();
    shop().closeModal();
    state.idempotencyKey =
      crypto && crypto.randomUUID ? crypto.randomUUID() : `ceme-${Date.now()}`;
    const modal = $("#checkout-modal");
    modal.hidden = false;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    setStep("data");
    renderSummary();
    showDemoBanner();
    updateCardPreview();
    loadRemoteConfig().then(() => {
      showDemoBanner();
      renderSummary();
    });
    modal.querySelector(".checkout-panel").focus();
  }

  function close() {
    const modal = $("#checkout-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    setPayMessage("");
    if (state.step === "done") setStep("data");
  }

  function refresh() {
    const modal = $("#checkout-modal");
    if (!modal || modal.hidden) return;
    renderSummary();
    updateCardPreview();
    showDemoBanner();
  }

  function bind() {
    const modal = $("#checkout-modal");
    if (!modal) return;

    $("#checkout-close")?.addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    $("#checkout-continue")?.addEventListener("click", () => {
      if (!validateData(formData())) {
        const first = modal.querySelector("[aria-invalid='true']");
        if (first) first.focus();
        return;
      }
      setStep("pay");
      renderSummary();
    });
    $("#checkout-back")?.addEventListener("click", () => setStep("data"));
    $("#checkout-pay")?.addEventListener("click", submitPayment);
    $("#checkout-success-close")?.addEventListener("click", close);

    $("#pay-cpf")?.addEventListener("input", (e) => {
      e.target.value = maskCpf(e.target.value);
    });
    $("#pay-cep")?.addEventListener("input", (e) => {
      e.target.value = maskCep(e.target.value);
    });
    $("#pay-state")?.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^a-zA-Z]/g, "").slice(0, 2).toUpperCase();
    });
    $("#pay-phone")?.addEventListener("input", (e) => {
      const d = onlyDigits(e.target.value).slice(0, 11);
      if (d.length <= 2) e.target.value = d.length ? `(${d}` : "";
      else if (d.length <= 7) e.target.value = `(${d.slice(0, 2)}) ${d.slice(2)}`;
      else e.target.value = `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    });
    $("#pay-card-number")?.addEventListener("input", (e) => {
      e.target.value = maskCard(e.target.value);
      updateCardPreview();
    });
    $("#pay-card-name")?.addEventListener("input", (e) => {
      e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ'\s]/g, "").slice(0, 40);
      updateCardPreview();
    });
    $("#pay-card-expiry")?.addEventListener("input", (e) => {
      e.target.value = maskExpiry(e.target.value);
      updateCardPreview();
    });
    $("#pay-card-cvv")?.addEventListener("input", (e) => {
      const brand = cardBrand($("#pay-card-number").value);
      e.target.value = onlyDigits(e.target.value).slice(0, brand === "amex" ? 4 : 3);
    });
    $("#pay-card-cvv")?.addEventListener("focus", () => {
      $("#pay-card-visual")?.classList.add("is-flipped");
    });
    $("#pay-card-cvv")?.addEventListener("blur", () => {
      $("#pay-card-visual")?.classList.remove("is-flipped");
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.classList.contains("is-open")) close();
    });
  }

  window.CEMECheckout = { open, close, refresh };

  document.addEventListener("DOMContentLoaded", bind);
})();
