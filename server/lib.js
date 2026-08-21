export const MAX_QTY = 20;
export const MIN_INSTALLMENT = 20;

export function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
}

export function isCpf(value) {
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

export function isCep(value) {
  return onlyDigits(value).length === 8;
}

export function luhn(value) {
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

export function catalogMap(products) {
  const map = new Map();
  for (const product of products) {
    map.set(product.id, {
      id: product.id,
      name: product.name,
      volume: product.volume,
      price: Number(product.price),
    });
  }
  return map;
}

export function quoteCart(products, items, shippingFee = 0) {
  const catalog = catalogMap(products);
  if (!Array.isArray(items) || !items.length) {
    const error = new Error("empty_cart");
    error.code = "empty_cart";
    throw error;
  }

  const lines = [];
  let subtotal = 0;

  for (const item of items) {
    const product = catalog.get(item && item.id);
    if (!product) {
      const error = new Error("invalid_item");
      error.code = "invalid_item";
      throw error;
    }
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) {
      const error = new Error("invalid_qty");
      error.code = "invalid_qty";
      throw error;
    }
    const lineTotal = product.price * qty;
    subtotal += lineTotal;
    lines.push({
      id: product.id,
      name: product.name,
      volume: product.volume,
      qty,
      unitPrice: product.price,
      lineTotal,
    });
  }

  const shipping = Math.max(0, Number(shippingFee) || 0);
  return {
    lines,
    subtotal,
    shipping,
    total: subtotal + shipping,
  };
}

export function installmentOptions(total, maxInstallments = 3) {
  const max = Math.min(12, Math.max(1, Number(maxInstallments) || 1));
  const options = [];
  for (let n = 1; n <= max; n += 1) {
    const value = Math.round((total / n) * 100) / 100;
    if (n > 1 && value < MIN_INSTALLMENT) break;
    options.push({ n, value, total });
  }
  return options;
}

export function validatePayer(payer) {
  const name = String(payer?.name || "").trim();
  const email = String(payer?.email || "").trim().toLowerCase();
  const phone = onlyDigits(payer?.phone);
  const cpf = onlyDigits(payer?.cpf);
  const cep = onlyDigits(payer?.cep);
  const street = String(payer?.street || "").trim();
  const number = String(payer?.number || "").trim();
  const neighborhood = String(payer?.neighborhood || "").trim();
  const city = String(payer?.city || "").trim();
  const state = String(payer?.state || "").trim().toUpperCase();
  const complement = String(payer?.complement || "").trim();

  const errors = [];
  if (name.length < 3) errors.push("name");
  if (!isEmail(email)) errors.push("email");
  if (phone.length < 10 || phone.length > 11) errors.push("phone");
  if (!isCpf(cpf)) errors.push("cpf");
  if (!isCep(cep)) errors.push("cep");
  if (street.length < 2) errors.push("street");
  if (!number) errors.push("number");
  if (neighborhood.length < 2) errors.push("neighborhood");
  if (city.length < 2) errors.push("city");
  if (!/^[A-Z]{2}$/.test(state)) errors.push("state");

  if (errors.length) {
    const error = new Error("invalid_payer");
    error.code = "invalid_payer";
    error.fields = errors;
    throw error;
  }

  return {
    name,
    email,
    phone,
    cpf,
    cep,
    street,
    number,
    complement,
    neighborhood,
    city,
    state,
  };
}

export function makeOrderId() {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `CEME-${Date.now().toString(36).toUpperCase()}-${rand}`;
}

export function demoCardDecision(cardNumber) {
  const num = onlyDigits(cardNumber);
  if (num === "4000000000000002") return "rejected";
  if (num === "4000000000009995") return "rejected";
  if (!luhn(num)) return "invalid";
  return "approved";
}
