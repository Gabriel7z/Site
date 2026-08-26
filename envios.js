(function () {
  const PICKUP_ADDRESS =
    "CLN 211, Bloco D, Sala 211 — Asa Norte, Brasília-DF — CEP 70863-540";
  const KEY_NAME = "ceme-admin-key";
  let ordersCache = [];
  let currentFilter = "all";

  function apiBase() {
    const apiUrl = String(window.CEME_CHECKOUT?.apiUrl || "").replace(/\/$/, "");
    if (!apiUrl) return "";
    if (location.protocol === "https:" && /^http:\/\//i.test(apiUrl)) return "";
    return apiUrl;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function money(n) {
    return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function when(value) {
    const time = Number(value);
    if (!time) return "";
    return new Date(time).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function shipLabel(method) {
    if (method === "pickup") return "Retirada em Brasília";
    if (method === "delivery") return "Correios";
    return "Digital";
  }

  function formatPhone(value) {
    const d = String(value || "").replace(/\D/g, "");
    if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
    return d;
  }

  function formatCep(value) {
    const d = String(value || "").replace(/\D/g, "");
    if (d.length === 8) return `${d.slice(0, 5)}-${d.slice(5)}`;
    return d;
  }

  function waNumber(value) {
    let d = String(value || "").replace(/\D/g, "");
    if (d.startsWith("55") && d.length >= 12) d = d.slice(2);
    return d.length === 11 ? `55${d}` : "";
  }

  function statsOf(orders) {
    let revenue = 0;
    let pending = 0;
    let shipped = 0;
    for (const order of orders) {
      revenue += Number(order.total || 0);
      if (order.shipped) shipped += 1;
      else pending += 1;
    }
    return { count: orders.length, pending, shipped, revenue };
  }

  function addressBlock(order) {
    if (order.shippingMethod === "pickup") {
      return `<div class="order-address">
        <p class="order-address-kicker">Retirada na loja</p>
        <p>${escapeHtml(PICKUP_ADDRESS)}</p>
        <p>Quem retira: <strong>${escapeHtml(order.customerName || "Cliente")}</strong></p>
      </div>`;
    }
    if (order.shippingMethod !== "delivery") {
      return `<div class="order-address is-digital">
        <p class="order-address-kicker">Pedido digital</p>
        <p>Sem postagem — o cliente recebe o conteúdo por e-mail/WhatsApp.</p>
      </div>`;
    }
    const a = order.address || {};
    const line = [a.street, a.number, a.complement].filter(Boolean).join(", ");
    const city = [a.neighborhood, a.city, a.state].filter(Boolean).join(" — ");
    const cep = formatCep(a.cep);
    const text = order.addressText || [line, city, cep ? `CEP ${cep}` : ""].filter(Boolean).join(". ");
    if (!text) {
      return `<div class="order-address">
        <p class="order-address-kicker">Endereço de entrega</p>
        <p>Endereço não informado neste pedido.</p>
      </div>`;
    }
    return `<div class="order-address">
      <p class="order-address-kicker">Endereço de entrega</p>
      ${line ? `<p>${escapeHtml(line)}</p>` : ""}
      ${city ? `<p>${escapeHtml(city)}</p>` : ""}
      ${cep ? `<p>CEP ${escapeHtml(cep)}</p>` : ""}
      ${!line && !city ? `<p>${escapeHtml(text)}</p>` : ""}
    </div>`;
  }

  function contactBlock(order) {
    const phoneLabel = formatPhone(order.phone);
    const wa = waNumber(order.phone);
    const email = String(order.email || "").trim();
    const pay = String(order.paymentId || "").trim();
    const waLink = wa
      ? `<a href="https://wa.me/${escapeHtml(wa)}" target="_blank" rel="noopener">WhatsApp ${escapeHtml(phoneLabel)}</a>`
      : "<span>WhatsApp não informado</span>";
    const mailLink = email
      ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`
      : "<span>E-mail não informado</span>";
    const mp = pay
      ? `venda nº ${escapeHtml(pay)} no Mercado Pago`
      : "a venda deste pedido no Mercado Pago";
    return `<div class="contact-block">
      <p class="contact-links">${waLink}<span aria-hidden="true"> · </span>${mailLink}</p>
      <p class="contact-fallback">Se o WhatsApp não responder, use o e-mail. Se os dois falharem, fale por ${mp}.</p>
    </div>`;
  }

  function notifyHint(order) {
    if (!order.shipped) {
      return "<p class=\"ship-hint\">Quando postar, marque como enviado. O cliente recebe o aviso no e-mail e no WhatsApp.</p>";
    }
    const emailOk = order.notify?.email;
    const mail = emailOk
      ? "E-mail de envio disparado."
      : order.hasEmail
        ? "WhatsApp aberto. Para o e-mail ir sozinho, coloque GMAIL_USER no Render."
        : "Pedido antigo sem e-mail. WhatsApp segue no telefone.";
    return `<p class="ship-hint is-sent">${escapeHtml(mail)}</p>`;
  }

  function card(order) {
    const items = (order.items || [])
      .map((item) => {
        const volume = item.volume ? ` (${escapeHtml(item.volume)})` : "";
        return `<li>${escapeHtml(item.name)}${volume} × ${Number(item.qty)}</li>`;
      })
      .join("");
    const sent = !!order.shipped;
    const created = when(order.createdAt);
    return `<article class="order-card${sent ? " is-shipped" : ""}" data-order="${escapeHtml(order.orderId)}">
      <div class="order-card-head">
        <p class="kicker">${sent ? "Enviado" : "Pendente de envio"} · ${escapeHtml(shipLabel(order.shippingMethod))}</p>
        <p class="order-date">${escapeHtml(created)}</p>
      </div>
      <h2>${escapeHtml(order.orderId)}</h2>
      <p><strong>${escapeHtml(order.customerName || "Cliente")}</strong></p>
      ${contactBlock(order)}
      ${addressBlock(order)}
      <ul>${items}</ul>
      <p><strong>${money(order.total)}</strong>${order.shipping ? ` · frete ${money(order.shipping)}` : ""}</p>
      ${
        order.shippingMethod === "delivery"
          ? `<form class="track-row track-admin">
              <input name="tracking" maxlength="22" placeholder="Código dos Correios" value="${escapeHtml(
                order.trackingCode || ""
              )}">
              <button class="btn btn-ghost" type="submit">Salvar rastreio</button>
            </form>`
          : "<p>Não precisa de código dos Correios.</p>"
      }
      <button type="button" class="ship-mark${sent ? " is-sent" : ""}" data-ship ${sent ? "disabled" : ""} aria-pressed="${sent ? "true" : "false"}">
        <span class="ship-x" aria-hidden="true">${sent ? "×" : ""}</span>
        ${sent ? "Enviado" : "Marcar como enviado"}
      </button>
      ${notifyHint(order)}
    </article>`;
  }

  function showGateError(message) {
    const error = document.getElementById("admin-error");
    error.textContent = message;
    error.hidden = false;
  }

  function showBoardError(message) {
    const error = document.getElementById("owner-error");
    error.textContent = message;
    error.hidden = !message;
  }

  function setFilter(filter) {
    currentFilter = filter;
    document.querySelectorAll(".dash-tab").forEach((tab) => {
      tab.classList.toggle("is-active", tab.getAttribute("data-filter") === filter);
    });
    renderBoard();
  }

  function visibleOrders() {
    const query = String(document.getElementById("dash-search")?.value || "")
      .trim()
      .toLowerCase();
    return ordersCache.filter((order) => {
      if (currentFilter === "pending" && order.shipped) return false;
      if (currentFilter === "shipped" && !order.shipped) return false;
      if (!query) return true;
      const hay = [
        order.orderId,
        order.customerName,
        order.addressText,
        order.address?.city,
        order.address?.neighborhood,
        order.email,
        order.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
  }

  function renderKpis() {
    const stats = statsOf(ordersCache);
    const box = document.getElementById("dash-kpis");
    const cards = [
      { filter: "all", label: "Vendas", value: money(stats.revenue), hint: `${stats.count} pedido${stats.count === 1 ? "" : "s"}` },
      { filter: "all", label: "Histórico", value: String(stats.count), hint: "pagos no Mercado Pago" },
      { filter: "pending", label: "Pendentes", value: String(stats.pending), hint: "esperando postagem" },
      { filter: "shipped", label: "Enviados", value: String(stats.shipped), hint: "já marcados" },
    ];
    box.innerHTML = cards
      .map(
        (card) => `<button type="button" class="dash-kpi${currentFilter === card.filter ? " is-on" : ""}" data-filter="${card.filter}">
          <span>${escapeHtml(card.label)}</span>
          <strong>${escapeHtml(card.value)}</strong>
          <small>${escapeHtml(card.hint)}</small>
        </button>`
      )
      .join("");
  }

  function renderBoard() {
    renderKpis();
    const list = document.getElementById("admin-list");
    const shown = visibleOrders();
    if (!ordersCache.length) {
      list.innerHTML = "<p class=\"dash-empty\">Nenhuma venda paga ainda. O pedido só entra aqui depois que o Mercado Pago confirmar.</p>";
      return;
    }
    if (!shown.length) {
      list.innerHTML = "<p class=\"dash-empty\">Nenhum pedido neste filtro.</p>";
      return;
    }
    list.innerHTML = shown.map((order) => card(order)).join("");
  }

  function showApp(on) {
    document.getElementById("owner-login").hidden = on;
    document.getElementById("owner-app").hidden = !on;
  }

  function key() {
    return sessionStorage.getItem(KEY_NAME) || document.getElementById("admin-key").value;
  }

  async function load(adminKey) {
    document.getElementById("admin-error").hidden = true;
    showBoardError("");
    const base = apiBase();
    if (!base) {
      showGateError("O painel usa a API do Render. Abra a loja pelo endereço publicado.");
      return;
    }
    const res = await fetch(`${base}/api/orders`, { headers: { "x-admin-key": adminKey } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      sessionStorage.removeItem(KEY_NAME);
      showApp(false);
      showGateError(data.error === "unauthorized" ? "Senha incorreta." : "Configure a senha do dono no servidor.");
      return;
    }
    sessionStorage.setItem(KEY_NAME, adminKey);
    ordersCache = data.orders || [];
    showApp(true);
    renderBoard();
  }

  function openWhatsApp(url) {
    if (!url) return;
    window.open(url, "_blank", "noopener");
  }

  document.getElementById("admin-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    load(document.getElementById("admin-key").value);
  });

  document.getElementById("owner-logout")?.addEventListener("click", () => {
    sessionStorage.removeItem(KEY_NAME);
    ordersCache = [];
    document.getElementById("admin-key").value = "";
    showApp(false);
  });

  document.getElementById("dash-kpis")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (button) setFilter(button.getAttribute("data-filter"));
  });

  document.querySelector(".dash-tabs")?.addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (button) setFilter(button.getAttribute("data-filter"));
  });

  document.getElementById("dash-search")?.addEventListener("input", () => renderBoard());

  document.getElementById("admin-list")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target.closest(".track-admin");
    if (!form) return;
    const article = form.closest("[data-order]");
    const orderId = article?.getAttribute("data-order");
    const trackingCode = form.querySelector("[name=tracking]")?.value;
    const adminKey = key();
    const base = apiBase();
    const res = await fetch(`${base}/api/orders/${encodeURIComponent(orderId)}/tracking`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ trackingCode }),
    });
    if (!res.ok) {
      showBoardError("Não foi possível salvar o rastreio.");
      return;
    }
    load(adminKey);
  });

  document.getElementById("admin-list")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-ship]");
    if (!button || button.disabled) return;
    const article = button.closest("[data-order]");
    const orderId = article?.getAttribute("data-order");
    const trackingCode = article?.querySelector("[name=tracking]")?.value || "";
    const adminKey = key();
    const base = apiBase();
    button.disabled = true;
    const res = await fetch(`${base}/api/orders/${encodeURIComponent(orderId)}/shipped`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ trackingCode }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      button.disabled = false;
      showBoardError("Não foi possível marcar como enviado.");
      return;
    }
    openWhatsApp(data.whatsappUrl);
    load(adminKey);
  });

  const saved = sessionStorage.getItem(KEY_NAME);
  if (saved) {
    document.getElementById("admin-key").value = saved;
    load(saved);
  }
})();
