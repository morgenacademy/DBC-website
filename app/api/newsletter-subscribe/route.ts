import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

interface NewsletterBody {
  name?: string;
  email?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getMailchimpConfig(): { apiKey: string; audienceId: string; serverPrefix: string } | null {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID;
  const serverPrefix = process.env.MAILCHIMP_SERVER_PREFIX ?? apiKey?.split("-")[1];

  if (!apiKey || !audienceId || !serverPrefix) return null;

  return { apiKey, audienceId, serverPrefix };
}

export async function POST(request: Request): Promise<Response> {
  const body = (await request.json()) as NewsletterBody;
  const email = body.email?.trim().toLowerCase() ?? "";
  const name = body.name?.trim() ?? "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: false, message: "Vul een geldig e-mailadres in." }, { status: 400 });
  }

  const config = getMailchimpConfig();
  if (!config) {
    return NextResponse.json(
      { ok: false, message: "Nieuwsbrief is nog niet gekoppeld. Voeg Mailchimp-gegevens toe in de omgevingsvariabelen." },
      { status: 500 }
    );
  }

  const memberHash = createHash("md5").update(email).digest("hex");
  const endpoint = `https://${config.serverPrefix}.api.mailchimp.com/3.0/lists/${config.audienceId}/members/${memberHash}`;

  const response = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      email_address: email,
      status_if_new: "subscribed",
      merge_fields: {
        FNAME: name
      }
    })
  });

  if (!response.ok) {
    const errorPayload = await response.text();
    return NextResponse.json(
      {
        ok: false,
        message: "Inschrijven is nu niet gelukt. Probeer het zo nog een keer.",
        details: errorPayload
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, message: "Gelukt! Je bent ingeschreven voor de nieuwsbrief." });
}
