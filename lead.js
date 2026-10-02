// Sends every form or chat lead to your Telegram app instantly.
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const b = req.body || {};
  if (b.website) return res.status(200).json({ ok: true }); // spam trap
  const clean = (v, n) => String(v || "").replace(/[\u0000-\u001f]/g, " ").trim().slice(0, n);
  const name = clean(b.name, 80), phone = clean(b.phone, 25);
  if (!name || !/^[+\d][\d\s-]{7,20}$/.test(phone)) return res.status(400).json({ error: "Invalid details" });
  const text = [
    "New lead: Quest Growth Empire",
    "Source: " + clean(b.source, 30),
    "Name: " + name,
    "Phone: " + phone,
    "Need: " + clean(b.need, 60),
    "Message:\n" + String(b.message || "").slice(0, 2500),
  ].join("\n");
  const r = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text }),
  });
  if (!r.ok) return res.status(502).json({ error: "Delivery failed" });
  res.status(200).json({ ok: true });
}
