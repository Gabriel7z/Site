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

  function shipLabel(method) {
    if (method === "pickup") return "Retirada em Brasília";
    if (method === "delivery") return "Entrega pelos Correios";
    return "Pedido digital — sem postagem";
  }

  function statusLabel(order) {
    if (order.shipped) return "Seu pedido acabou de ser enviado";
    if (order.status === "approved") return "Pagamento aprovado";
    if (order.status === "pending" || order.status === "in_process") return "Aguardando pagamento no Mercado Pago";
    return "Pagamento não confirmado";
  }

  function render(order) {
    const box = document.getElementById("track-result");
    const base = apiBase();
    const items = (order.items || [])
      .map((item) => `<li>${escapeHtml(item.name)} × ${Number(item.qty)}</li>`)
      .join("");
    const tracking = order.trackingCode
      ? `<p><strong>Código dos Correios:</strong> ${escapeHtml(order.trackingCode)}</p>
         <p><a class="btn btn-ghost" href="${escapeHtml(order.trackingUrl)}" target="_blank" rel="noopener">Ver nos Correios</a></p>`
      : order.shippingMethod === "delivery"
        ? "<p>Quando postarmos, o código dos Correios aparece aqui. O rastreio da loja já é o número acima.</p>"
        : "";
    const cupom = base
      ? `<p><a class="btn btn-gold" href="${escapeHtml(base)}/api/order/${encodeURIComponent(order.orderId)}/cupom.pdf" download>Baixar cupom PDF</a></p>`
      : "";
    box.innerHTML = `
      <p class="kicker">${escapeHtml(statusLabel(order))}</p>
      <h2>Rastreio ${escapeHtml(order.trackingId || order.orderId)}</h2>
      <p><strong>${escapeHtml(order.customerName || "Cliente")}</strong></p>
      <p>${escapeHtml(shipLabel(order.shippingMethod))}</p>
      ${order.addressText ? `<p>${escapeHtml(order.addressText)}</p>` : ""}
      <ul>${items}</ul>
      ${tracking}
      ${cupom}
    `;
    box.hidden = false;
  }

  async function lookup(orderId) {
    const error = document.getElementById("track-error");
    const result = document.getElementById("track-result");
    error.hidden = true;
    result.hidden = true;
    const id = String(orderId || "").trim().toUpperCase();
    if (!/^CEME-[A-Z0-9-]+$/i.test(id)) {
      error.textContent = "Número de pedido inválido.";
      error.hidden = false;
      return;
    }
    const base = apiBase();
    if (!base) {
      error.textContent = "Abra a loja em http://127.0.0.1:3001 para consultar o pedido.";
      error.hidden = false;
      return;
    }
    try {
      const res = await fetch(`${base}/api/order/${encodeURIComponent(id)}`);
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        error.textContent =
          data.error === "payment_pending" || data.error === "payment_not_confirmed" || data.error === "payment_rejected"
            ? "O Mercado Pago não confirmou este pagamento. O pedido só aparece depois da aprovação."
            : "Não encontramos esse pedido. Confira o número do comprovante.";
        error.hidden = false;
        return;
      }
      render(data);
    } catch {
      error.textContent = "Não encontramos esse pedido. Confira o número do comprovante.";
      error.hidden = false;
    }
  }

  document.getElementById("track-form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    lookup(document.getElementById("track-order").value);
  });

  const fromUrl = new URLSearchParams(location.search).get("pedido");
  if (fromUrl) {
    document.getElementById("track-order").value = fromUrl;
    lookup(fromUrl);
  }
})();
