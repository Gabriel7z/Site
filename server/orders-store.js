import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { sanitizeStoredOrder } from "./lib.js";

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
    return Array.isArray(parsed) ? parsed.map(sanitizeStoredOrder) : [];
  } catch {
    return [];
  }
}

export function scrubOrderFile() {
  const all = readOrders();
  fs.writeFileSync(FILE, `${JSON.stringify(all, null, 2)}\n`, "utf8");
  return all;
}

export function findOrder(orderId) {
  const id = String(orderId || "");
  return readOrders().find((order) => order.orderId === id) || null;
}

export function upsertOrder(record) {
  if (!record?.orderId) return record;
  const next = sanitizeStoredOrder(record);
  const all = readOrders();
  const index = all.findIndex((order) => order.orderId === next.orderId);
  if (index >= 0) {
    all[index] = sanitizeStoredOrder({ ...all[index], ...next, orderId: next.orderId });
  } else {
    all.unshift(next);
  }
  fs.writeFileSync(FILE, `${JSON.stringify(all, null, 2)}\n`, "utf8");
  return index >= 0 ? all[index] : next;
}
