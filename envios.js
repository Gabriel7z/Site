(function () {
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

  function shipLabel(method) {
    if (method === "pickup") return "Retirada em Brasília";
    if (method === "delivery") return "Correios";
    return "Digital";
  }

  function notifyHint(order) {
    if (!order.shipped) {
      return "<p class=\"ship-hint\">Quando postar, marque com o X. O cliente recebe: “seu pedido acabou de ser enviado” no e-mail e no WhatsApp.</p>";
    }
    const emailOk = order.notify?.email;
    const mail = emailOk
      ? "E-mail enviado."
      : order.hasEmail
        ? "WhatsApp aberto. E-mail: coloque GMAIL_USER no Render para o aviso chegar sozinho."
        : "Este pedido antigo não tem e-mail guardado. WhatsApp segue no telefone.";
    return `<p class="ship-hint is-sent">${escapeHtml(mail)}</p>`;
  }

  function card(order) {
    const items = (order.items || [])
      .map((item) => `<li>${escapeHtml(item.name)} × ${Number(item.qty)}</li>`)
      .join("");
    const sent = !!order.shipped;
    return `<article class="order-card${sent ? " is-shipped" : ""}" data-order="${escapeHtml(order.orderId)}">
      <p class="kicker">${escapeHtml(order.status || "")} · ${escapeHtml(shipLabel(order.shippingMethod))}</p>
      <h2>${escapeHtml(order.orderId)}</h2>
      <p><strong>${escapeHtml(order.customerName)}</strong>
      ${
        order.phone
          ? ` · <a href="https://wa.me/55${String(order.phone).replace(/\D/g, "")}" target="_blank" rel="noopener">WhatsApp</a>`
          : ""
      }</p>
      <p>${escapeHtml(order.addressText || "Sem endereço de postagem")}</p>
      <ul>${items}</ul>
      <p><strong>${money(order.total)}</strong></p>
      ${
        order.shippingMethod === "delivery"
          ? `<form class="track-row track-admin">
              <input name="tracking" maxlength="22" placeholder="Código dos Correios" value="${escapeHtml(
                order.trackingCode || ""
              )}">
              <button class="btn btn-ghost" type="submit">Salvar rastreio</button>
            </form>`
          : "<p>Não precisa de rastreio.</p>"
      }
      <button type="button" class="ship-mark${sent ? " is-sent" : ""}" data-ship ${sent ? "disabled" : ""} aria-pressed="${sent ? "true" : "false"}">
        <span class="ship-x" aria-hidden="true">${sent ? "×" : ""}</span>
        ${sent ? "Enviado" : "Marcar como enviado"}
      </button>
      ${notifyHint(order)}
    </article>`;
  }

  function showError(message) {
    const error = document.getElementById("admin-error");
    error.textContent = message;
    error.hidden = false;
  }

  async function load(key) {
    const error = document.getElementById("admin-error");
    const list = document.getElementById("admin-list");
    error.hidden = true;
    const base = apiBase();
    if (!base) {
      showError("A lista de envios usa a API do Render. Recarregue a página.");
      return;
    }
    const res = await fetch(`${base}/api/orders`, { headers: { "x-admin-key": key } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      showError(
        data.error === "unauthorized"
          ? "Senha incorreta. Use a senha ADMIN_KEY (ceme-local)."
          : "Configure ADMIN_KEY no servidor."
      );
      return;
    }
    sessionStorage.setItem("ceme-admin-key", key);
    const orders = data.orders || [];
    list.innerHTML = orders.length
      ? orders.map((order) => card(order)).join("")
      : "<p>Nenhum pedido pago ainda. Só entra aqui depois que o Mercado Pago confirmar o pagamento.</p>";
  }

  function openWhatsApp(url) {
    if (!url) return;
    window.open(url, "_blank", "noopener");
  }

  document.getElementById("admin-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    load(document.getElementById("admin-key").value);
  });

  document.getElementById("admin-list")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.target.closest(".track-admin");
    if (!form) return;
    const article = form.closest("[data-order]");
    const orderId = article?.getAttribute("data-order");
    const trackingCode = form.querySelector("[name=tracking]")?.value;
    const key = sessionStorage.getItem("ceme-admin-key") || document.getElementById("admin-key").value;
    const base = apiBase();
    const res = await fetch(`${base}/api/orders/${encodeURIComponent(orderId)}/tracking`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ trackingCode }),
    });
    if (!res.ok) {
      showError("Não foi possível salvar o rastreio.");
      return;
    }
    load(key);
  });

  document.getElementById("admin-list")?.addEventListener("click", async (event) => {
    const button = event.target.closest("[data-ship]");
    if (!button || button.disabled) return;
    const article = button.closest("[data-order]");
    const orderId = article?.getAttribute("data-order");
    const trackingCode = article?.querySelector("[name=tracking]")?.value || "";
    const key = sessionStorage.getItem("ceme-admin-key") || document.getElementById("admin-key").value;
    const base = apiBase();
    button.disabled = true;
    const res = await fetch(`${base}/api/orders/${encodeURIComponent(orderId)}/shipped`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": key },
      body: JSON.stringify({ trackingCode }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      button.disabled = false;
      showError("Não foi possível marcar como enviado.");
      return;
    }
    openWhatsApp(data.whatsappUrl);
    load(key);
  });

  const saved = sessionStorage.getItem("ceme-admin-key");
  if (saved) {
    document.getElementById("admin-key").value = saved;
    load(saved);
  }
})();
