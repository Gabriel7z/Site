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

  function card(order, key) {
    const items = (order.items || [])
      .map((item) => `<li>${escapeHtml(item.name)} × ${Number(item.qty)}</li>`)
      .join("");
    return `<article class="order-card" data-order="${escapeHtml(order.orderId)}">
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
    </article>`;
  }

  async function load(key) {
    const error = document.getElementById("admin-error");
    const list = document.getElementById("admin-list");
    error.hidden = true;
    const base = apiBase();
    if (!base) {
      error.textContent = "Abra em http://127.0.0.1:3001/envios.html";
      error.hidden = false;
      return;
    }
    const res = await fetch(`${base}/api/orders`, { headers: { "x-admin-key": key } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      error.textContent =
        data.error === "unauthorized"
          ? "Senha incorreta."
          : "Configure ADMIN_KEY no servidor.";
      error.hidden = false;
      return;
    }
    sessionStorage.setItem("ceme-admin-key", key);
    const orders = data.orders || [];
    list.innerHTML = orders.length
      ? orders.map((order) => card(order, key)).join("")
      : "<p>Nenhum pedido ainda.</p>";
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
      document.getElementById("admin-error").textContent = "Não foi possível salvar o rastreio.";
      document.getElementById("admin-error").hidden = false;
      return;
    }
    load(key);
  });

  const saved = sessionStorage.getItem("ceme-admin-key");
  if (saved) {
    document.getElementById("admin-key").value = saved;
    load(saved);
  }
})();
