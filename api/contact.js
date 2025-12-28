import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { name, company, email, subject, message } = req.body || {};

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ ok: false, error: "Missing required fields" });
    }

    const data = await resend.emails.send({
      // MUST be a verified sender/domain in Resend
      from: "Studio17 <no-reply@studio17.world>",
      to: ["info@studio17.world"],
      replyTo: email,
      subject: `[Contact] ${subject}`,
      text: `Name: ${name}\nCompany: ${company || "-"}\nEmail: ${email}\n\n${message}`,
    });

    return res.status(200).json({ ok: true, id: data.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: "Failed to send email" });
  }
}
