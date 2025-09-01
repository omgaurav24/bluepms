/* app/api/contact/route.ts */
import type { NextRequest } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();

    if (!name || !email || !message) {
      return new Response("Missing fields", { status: 400 });
    }

    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const pass = process.env.SMTP_PASS;
    const from = process.env.MAIL_FROM || user || "connect@bluepms.com";
    const to = process.env.MAIL_TO || "karthickpk@bluepms.com";

    if (!user || !pass) {
      return new Response("SMTP credentials missing", { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,     // 465 TLS, 587 STARTTLS
      auth: { user, pass },
      requireTLS: port === 587, // for Gmail
    });

    const subject = `BLUEPMS Callback Request – ${name}`;
    const html = `
      <div style="font-family: ui-sans-serif, system-ui; line-height:1.6">
        <h2>Callback request from BLUEPMS site</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Message:</strong></p>
        <pre style="white-space:pre-wrap">${escapeHtml(message)}</pre>
      </div>
    `;

    await transporter.sendMail({
      from,
      to,
      subject,
      replyTo: email,
      html,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    return new Response("OK", { status: 200 });
  } catch (err: any) {
    console.error(err);
    return new Response(err?.message || "Email failed", { status: 500 });
  }
}

function escapeHtml(s: string) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}