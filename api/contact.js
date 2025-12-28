import { Resend } from "resend";

export default async function handler(req, res) {
  // GET should not crash
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ ok: false, error: "RESEND_API_KEY missing in Vercel env vars" });
  }

  const resend = new Resend(apiKey);

  try {
    const { name, company, email, subject, message } = req.body || {};
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const result = await resend.emails.send({
      from: "Studio17 <no-reply@studio17.world>", // must be verified in Resend
      to: ["info@studio17.world"],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `Name: ${name}\nCompany: ${company || "-"}\nEmail: ${email}\n\n${message}`,
    });

    return res.status(200).json({ ok: true, id: result.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err?.message || "Failed to send" });
  }
}
