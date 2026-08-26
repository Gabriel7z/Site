const BRASILIA_TZ = "America/Sao_Paulo";
const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
const MONTHS_FULL = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function roundMoney(n) {
  return Math.round(Number(n || 0) * 100) / 100;
}

function partsAt(ms) {
  const bag = {};
  for (const part of new Intl.DateTimeFormat("en-US", {
    timeZone: BRASILIA_TZ,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  }).formatToParts(new Date(ms))) {
    if (part.type !== "literal") bag[part.type] = Number(part.value);
  }
  return bag;
}

function monthKey(year, month) {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function dayKey(year, month, day) {
  return `${monthKey(year, month)}-${String(day).padStart(2, "0")}`;
}

function monthMeta(year, month) {
  return {
    key: monthKey(year, month),
    label: `${MONTHS_FULL[month - 1]} de ${year}`,
    short: `${MONTHS_SHORT[month - 1]}/${String(year).slice(2)}`,
  };
}

function shiftMonth(year, month, delta) {
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1 };
}

function shiftDay(year, month, day, delta) {
  const date = new Date(Date.UTC(year, month - 1, day + delta, 15, 0, 0));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() + 1, day: date.getUTCDate() };
}

function shippingBucket(method) {
  if (method === "pickup") return "pickup";
  if (method === "delivery") return "delivery";
  return "digital";
}

function emptyBucket() {
  return { count: 0, revenue: 0 };
}

export function ownerDashboardStats(orders = [], now = Date.now()) {
  const list = Array.isArray(orders) ? orders : [];
  const nowParts = partsAt(now);
  const thisMeta = monthMeta(nowParts.year, nowParts.month);
  const prevParts = shiftMonth(nowParts.year, nowParts.month, -1);
  const lastMeta = monthMeta(prevParts.year, prevParts.month);

  const monthsMap = new Map();
  const chartKeys = [];
  for (let i = 11; i >= 0; i -= 1) {
    const part = shiftMonth(nowParts.year, nowParts.month, -i);
    const meta = monthMeta(part.year, part.month);
    chartKeys.push(meta.key);
    monthsMap.set(meta.key, { ...meta, revenue: 0, count: 0 });
  }

  const days = [];
  const daysMap = new Map();
  for (let i = 13; i >= 0; i -= 1) {
    const part = shiftDay(nowParts.year, nowParts.month, nowParts.day, -i);
    const row = {
      key: dayKey(part.year, part.month, part.day),
      label: String(part.day).padStart(2, "0"),
      short: String(part.day),
      revenue: 0,
      count: 0,
    };
    days.push(row);
    daysMap.set(row.key, row);
  }

  const products = new Map();
  const shipping = {
    delivery: emptyBucket(),
    pickup: emptyBucket(),
    digital: emptyBucket(),
  };

  let revenue = 0;
  let pending = 0;
  let shipped = 0;

  for (const order of list) {
    const total = roundMoney(order.total);
    revenue += total;
    if (order.shipped) shipped += 1;
    else pending += 1;

    const bucket = shippingBucket(order.shippingMethod);
    shipping[bucket].count += 1;
    shipping[bucket].revenue = roundMoney(shipping[bucket].revenue + total);

    for (const item of order.items || []) {
      const name = String(item.name || item.id || "Item").trim() || "Item";
      const qty = Number(item.qty) || 0;
      const unit = Number(item.unitPrice);
      const line = Number.isFinite(unit) && unit > 0 ? roundMoney(unit * qty) : 0;
      const prev = products.get(name) || { name, qty: 0, revenue: 0 };
      prev.qty += qty;
      prev.revenue = roundMoney(prev.revenue + line);
      products.set(name, prev);
    }

    const created = Number(order.createdAt);
    if (!created) continue;
    const part = partsAt(created);
    const mk = monthKey(part.year, part.month);
    const monthRow = monthsMap.get(mk);
    if (monthRow) {
      monthRow.revenue = roundMoney(monthRow.revenue + total);
      monthRow.count += 1;
    } else {
      monthsMap.set(mk, { ...monthMeta(part.year, part.month), revenue: total, count: 1 });
    }
    const dayRow = daysMap.get(dayKey(part.year, part.month, part.day));
    if (dayRow) {
      dayRow.revenue = roundMoney(dayRow.revenue + total);
      dayRow.count += 1;
    }
  }

  revenue = roundMoney(revenue);
  const months = chartKeys.map((key) => monthsMap.get(key));
  let bestMonth = null;
  for (const row of monthsMap.values()) {
    if (row.revenue <= 0) continue;
    if (!bestMonth || row.revenue > bestMonth.revenue || (row.revenue === bestMonth.revenue && row.key > bestMonth.key)) {
      bestMonth = row;
    }
  }

  const thisMonth = monthsMap.get(thisMeta.key) || { ...thisMeta, revenue: 0, count: 0 };
  const lastMonth = monthsMap.get(lastMeta.key) || { ...lastMeta, revenue: 0, count: 0 };
  let monthDeltaPct = null;
  if (lastMonth.revenue > 0) {
    monthDeltaPct = Math.round(((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 1000) / 10;
  } else if (thisMonth.revenue > 0) {
    monthDeltaPct = 100;
  }

  const topProducts = [...products.values()].sort((a, b) => b.qty - a.qty || b.revenue - a.revenue).slice(0, 5);

  return {
    count: list.length,
    pending,
    shipped,
    revenue,
    ticket: list.length ? roundMoney(revenue / list.length) : 0,
    thisMonth,
    lastMonth,
    bestMonth,
    monthDeltaPct,
    months,
    days,
    topProducts,
    shipping,
  };
}
