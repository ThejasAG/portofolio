import { NextResponse } from "next/server";

/**
 * Hiring inquiry endpoint.
 *
 * Runs server-side only, so RESEND_API_KEY never reaches the browser.
 * Resend is called over its REST API rather than adding an SDK dependency.
 */

export const runtime = "nodejs";

/** Simple in-memory throttle: one submission per IP per window. */
const lastSeen = new Map<string, number>();
const WINDOW_MS = 30_000;

const MAX = { name: 100, company: 120, email: 200, role: 160, message: 4000 };

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Deliberately permissive — the goal is catching typos, not policing addresses. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const name = clean(b.name, MAX.name);
  const company = clean(b.company, MAX.company);
  const email = clean(b.email, MAX.email);
  const role = clean(b.role, MAX.role);
  const message = clean(b.message, MAX.message);

  const errors: Record<string, string> = {};
  if (!name) errors.name = "Please enter your name.";
  if (!email) errors.email = "Please enter your email.";
  else if (!EMAIL_RE.test(email)) errors.email = "That email doesn't look right.";
  if (!role) errors.role = "Please say what this is about.";
  if (!message) errors.message = "Please include a message.";
  else if (message.length < 10) errors.message = "A little more detail, please.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ errors }, { status: 422 });
  }

  // Throttle repeat submissions from the same address.
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const now = Date.now();
  const previous = lastSeen.get(ip);
  if (previous && now - previous < WINDOW_MS) {
    return NextResponse.json(
      { error: "You just sent a message — give it a moment." },
      { status: 429 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  if (!apiKey || !to) {
    // Misconfiguration is a server fault; say so rather than pretending it sent.
    console.error("hire: RESEND_API_KEY or CONTACT_EMAIL is not set");
    return NextResponse.json(
      { error: "The contact form isn't configured yet. Please email directly." },
      { status: 503 }
    );
  }

  const text = [
    `Name: ${name}`,
    company ? `Company: ${company}` : null,
    `Email: ${email}`,
    `Role / project: ${role}`,
    "",
    message,
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || "Portfolio <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `Portfolio inquiry — ${role} (${name})`,
        text,
      }),
    });

    if (!res.ok) {
      console.error("hire: resend responded", res.status, await res.text());
      return NextResponse.json(
        { error: "Couldn't send that. Please email directly." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("hire: request failed", err);
    return NextResponse.json(
      { error: "Couldn't send that. Please email directly." },
      { status: 502 }
    );
  }

  lastSeen.set(ip, now);
  return NextResponse.json({ ok: true });
}
