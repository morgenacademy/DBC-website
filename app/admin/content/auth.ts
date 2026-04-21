import { cookies } from "next/headers";

const ADMIN_TOKEN_ENV_KEYS = ["CONTENT_ADMIN_TOKEN", "ADMIN_CONTENT_TOKEN"];
const ADMIN_TOKEN_COOKIE = "dbc_content_admin";

export function getExpectedAdminToken(): string | null {
  for (const key of ADMIN_TOKEN_ENV_KEYS) {
    const value = process.env[key];
    if (value) return value;
  }

  return null;
}

export function isAllowedAdminToken(token: string): boolean {
  const expectedToken = getExpectedAdminToken();
  return !expectedToken || token === expectedToken;
}

export async function getStoredAdminToken(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.get(ADMIN_TOKEN_COOKIE)?.value ?? "";
}

export async function resolveAdminToken(tokenFromUrl?: string): Promise<string> {
  if (tokenFromUrl && isAllowedAdminToken(tokenFromUrl)) {
    return tokenFromUrl;
  }

  const storedToken = await getStoredAdminToken();
  return isAllowedAdminToken(storedToken) ? storedToken : "";
}

export async function storeAdminToken(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    path: "/admin/content",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production"
  });
}
