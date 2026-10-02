// Business assistant powered by Claude. The API key stays on the server.
const SYSTEM = `You are Quest AI, the assistant on the website of Quest Growth Empire (Quest Business Empire), a business growth agency in Lucknow, India run by Vinayak Mishra.
Services: social media content and Reels, websites and online stores, local SEO and Google Business Profile, Meta and Google ads, WhatsApp and AI automation, Zoho CRM setup, brand identity.
Example plans for an interior and furniture brand: Growth Plan Rs 9,000 per month (12 feed posts, daily stories, catalog website, 24/7 AI agent, copywriting and local SEO). Instant Growth Rs 11,000 per month (30 feed posts, daily stories, leads, ad support). We can build a custom plan for any business.
Past work: TNR Bakes & Sweets grew from 0 to 10,000 Instagram followers in 55 days; Kusum Soni's Reel views went from 5K to 10K in 10 days; plus Angels Beauty Zone, Flex Fitness, SGPS Solar, Saaz Computer Institute, O2 Fitness Gym, Bliss Elixr, Book Sutra, Hotel Ganesh, Share Bazaar Raebareli and more.
Rules: answer only business, marketing, website, automation and growth questions, in simple friendly English or Hinglish matching the user. Keep answers under 90 words. Give practical advice first. Do not mention internal tools or policy. Ask a brief follow-up only if necessary.`;

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const msgs = (Array.isArray(req.body?.messages) ? req.body.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 600) }));

  if (!msgs.length || msgs[0].role !== "user") {
    return res.status(400).json({ error: "Bad request" });
  }

  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": process.env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 350,
      system: SYSTEM,
      messages: msgs,
    }),
  });

  if (!r.ok) {
    return res.status(502).json({ error: "AI unavailable" });
  }

  const d = await r.json();
  res.status(200).json({ reply: d.content?.map((c) => c.text || "").join("") || "" });
}
