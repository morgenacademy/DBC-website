import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

interface NewsletterBody {
  name?: string;
  email?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeServerPrefix(rawPrefix: string | undefined, apiKey: string): string | null {
  const fallbackPrefix = apiKey.split("-")[1]?.trim();
  const input = (rawPrefix?.trim() || fallbackPrefix)?.toLowerCase();
  if (!input) return null;

  const withoutProtocol = input.replace(/^https?:\/\//, "");
  const host = withoutProtocol.split("/")[0];

  if (host.includes("api.mailchimp.com")) {
    const extracted = host.replace(".api.mailchimp.com", "");
    return /^[a-z0-9-]+$/.test(extracted) ? extracted : null;
  }

  return /^[a-z0-9-]+$/.test(host) ? host : null;
}

function getMailchimpConfig(): { apiKey: string; audienceId: string; serverPrefix: string } | null {
  const apiKey = process.env.MAILCHIMP_API_KEY?.trim();
  const audienceId = process.env.MAILCHIMP_AUDIENCE_ID?.trim();
  const serverPrefix = apiKey ? normalizeServerPrefix(process.env.MAILCHIMP_SERVER_PREFIX, apiKey) : null;

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

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${config.apiKey}`).toString("base64")}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        status_if_new: "subscribed",
        merge_fields: {
          FNAME: name
        }
      })
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: "Mailchimp is nu niet bereikbaar. Controleer server prefix en API-key.",
        reason: error instanceof Error ? error.message : "Onbekende netwerkfout"
      },
      { status: 502 }
    );
  }

  if (!response.ok) {
    const rawPayload = await response.text();
    let parsed: { title?: string; detail?: string; status?: number; type?: string } | null = null;
    try {
      parsed = JSON.parse(rawPayload) as { title?: string; detail?: string; status?: number; type?: string };
    } catch {
      parsed = null;
    }

    return NextResponse.json(
      {
        ok: false,
        message: parsed?.detail || parsed?.title || "Inschrijven is nu niet gelukt. Probeer het zo nog een keer.",
        mailchimp: {
          endpoint,
          status: response.status,
          title: parsed?.title,
          detail: parsed?.detail,
          raw: parsed ? undefined : rawPayload
        }
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, message: "Gelukt! Je bent ingeschreven voor de nieuwsbrief." }, { status: 200 });
}
