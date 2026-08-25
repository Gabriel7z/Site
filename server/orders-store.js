import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), "data");
const FILE = path.join(DIR, "orders.json");

function ensureFile() {
  fs.mkdirSync(DIR, { recursive: true });
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]\n", "utf8");
  }
}

export function readOrders() {
  ensureFile();
  try {
    const parsed = JSON.parse(fs.readFileSync(FILE, "utf8"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function findOrder(orderId) {
  const id = String(orderId || "");
  return readOrders().find((order) => order.orderId === id) || null;
}

export function upsertOrder(record) {
  if (!record?.orderId) return record;
  const all = readOrders();
  const index = all.findIndex((order) => order.orderId === record.orderId);
  if (index >= 0) {
    all[index] = { ...all[index], ...record, orderId: record.orderId };
  } else {
    all.unshift(record);
  }
  fs.writeFileSync(FILE, `${JSON.stringify(all, null, 2)}\n`, "utf8");
  return index >= 0 ? all[index] : record;
}
