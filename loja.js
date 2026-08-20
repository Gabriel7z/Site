(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) {
    module.exports = api;
  } else {
    root.CemeLoja = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  const WHATSAPP_PADRAO = "5561999291377";

  function money(n) {
    return Number(n).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  function waLink(text, phone) {
    const destino = String(phone || WHATSAPP_PADRAO).replace(/\D/g, "");
    return `https://wa.me/${destino}/?text=${encodeURIComponent(text)}`;
  }

  function maskPhone(value) {
    const d = String(value || "")
      .replace(/\D/g, "")
      .slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function filterProducts(products, category, query) {
    const lista = Array.isArray(products) ? products : [];
    const filtro = category && category !== "Todos" ? category : "";
    const q = String(query || "")
      .trim()
      .toLowerCase();
    return lista.filter((p) => {
      if (filtro && p.category !== filtro) return false;
      if (!q) return true;
      const hay = [p.name, p.tagline, p.description, p.category, p.volume]
        .concat(p.indications || [])
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }

  function findProduct(products, id) {
    return (products || []).find((p) => p.id === id) || null;
  }

  function createCart(products, initial) {
    const catalogo = products || [];
    let items = Array.isArray(initial)
      ? initial.map((i) => ({ id: i.id, qty: Math.max(1, Number(i.qty) || 1) }))
      : [];

    function snapshot() {
      return items.map((i) => ({ id: i.id, qty: i.qty }));
    }

    function add(id, qty) {
      const produto = findProduct(catalogo, id);
      if (!produto) return snapshot();
      const q = Math.max(1, Number(qty) || 1);
      const found = items.find((i) => i.id === id);
      if (found) found.qty += q;
      else items.push({ id, qty: q });
      return snapshot();
    }

    function setQty(id, qty) {
      const n = Number(qty);
      if (!Number.isFinite(n) || n <= 0) {
        items = items.filter((i) => i.id !== id);
        return snapshot();
      }
      const found = items.find((i) => i.id === id);
      if (!found) return snapshot();
      found.qty = Math.floor(n);
      return snapshot();
    }

    function remove(id) {
      items = items.filter((i) => i.id !== id);
      return snapshot();
    }

    function clear() {
      items = [];
      return snapshot();
    }

    function count() {
      return items.reduce((sum, i) => sum + i.qty, 0);
    }

    function lines() {
      return items
        .map((item) => {
          const p = findProduct(catalogo, item.id);
          if (!p) return null;
          return {
            id: p.id,
            name: p.name,
            volume: p.volume,
            qty: item.qty,
            price: p.price,
            subtotal: p.price * item.qty,
            image: p.image,
          };
        })
        .filter(Boolean);
    }

    function total() {
      return lines().reduce((sum, line) => sum + line.subtotal, 0);
    }

    function checkoutText() {
      const pedido = lines();
      if (!pedido.length) return "";
      return [
        "Olá, Família CEME! Gostaria de comprar:",
        "",
        ...pedido.map((l) => `• ${l.name} (${l.volume}) x${l.qty} — ${money(l.subtotal)}`),
        "",
        `Total: ${money(total())}`,
      ].join("\n");
    }

    return { add, setQty, remove, clear, count, lines, total, checkoutText, snapshot };
  }

  function buyNowText(product) {
    if (!product) return "";
    return `Olá, Família CEME! Gostaria de comprar o ${product.name} (${product.volume}) por ${money(product.price)}.`;
  }

  function validatePrescritora(data) {
    const d = data || {};
    const errors = {};
    if (String(d.nome || "").trim().length < 2) errors.nome = "Informe seu nome.";
    if (String(d.sobrenome || "").trim().length < 2) errors.sobrenome = "Informe seu sobrenome.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(d.email || "").trim())) {
      errors.email = "Informe um e-mail válido.";
    }
    if (String(d.telefone || "").replace(/\D/g, "").length < 10) {
      errors.telefone = "Informe um telefone com DDD.";
    }
    if (String(d.apresentacao || "").trim().length < 10) {
      errors.apresentacao = "Conte um pouco sobre você (mínimo 10 caracteres).";
    }
    if (String(d.motivo || "").trim().length < 15) {
      errors.motivo = "Explique sua motivação (mínimo 15 caracteres).";
    }
    return { ok: Object.keys(errors).length === 0, errors };
  }

  function prescritoraText(data) {
    const d = data || {};
    return [
      "Olá, Família CEME! Quero ser distribuidora/prescritora da Linha CEME.",
      "",
      `Nome: ${String(d.nome || "").trim()} ${String(d.sobrenome || "").trim()}`.trim(),
      `E-mail: ${String(d.email || "").trim()}`,
      `Telefone: ${String(d.telefone || "").trim()}`,
      "",
      `Apresentação: ${String(d.apresentacao || "").trim()}`,
      "",
      `Motivação: ${String(d.motivo || "").trim()}`,
    ].join("\n");
  }

  function produtoDaUrl(search, hash, products) {
    try {
      const q = new URLSearchParams(String(search || "").replace(/^\?/, ""));
      const id = q.get("produto") || q.get("p");
      if (id && findProduct(products, id)) return id;
    } catch (e) {}
    const h = String(hash || "");
    const match = h.match(/^#produto-([a-z0-9-]+)/i);
    if (match && findProduct(products, match[1])) return match[1];
    return null;
  }

  return {
    WHATSAPP_PADRAO,
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
  };
});
