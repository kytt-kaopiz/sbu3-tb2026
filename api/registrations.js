const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const KEY = "tb2026_registrations";

async function redis(cmd) {
  const r = await fetch(`${UPSTASH_URL}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${UPSTASH_TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  const d = await r.json();
  return d.result;
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const raw = await redis(["GET", KEY]);
    return res.json(JSON.parse(raw || "[]"));
  }

  if (req.method === "POST") {
    const raw = await redis(["GET", KEY]);
    const rows = JSON.parse(raw || "[]");
    const entry = { ...req.body, id: Date.now().toString(), createdAt: new Date().toISOString() };
    rows.push(entry);
    await redis(["SET", KEY, JSON.stringify(rows)]);
    return res.json({ ok: true, entry });
  }

  if (req.method === "PUT") {
    const raw = await redis(["GET", KEY]);
    const rows = JSON.parse(raw || "[]");
    const updated = rows.map(r => r.id === req.body.id ? { ...r, ...req.body } : r);
    await redis(["SET", KEY, JSON.stringify(updated)]);
    return res.json({ ok: true });
  }

  if (req.method === "DELETE") {
    const raw = await redis(["GET", KEY]);
    const rows = JSON.parse(raw || "[]");
    const filtered = rows.filter(r => r.id !== req.query.id);
    await redis(["SET", KEY, JSON.stringify(filtered)]);
    return res.json({ ok: true });
  }

  res.status(405).end();
}
