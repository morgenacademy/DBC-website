"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getStoredAdminToken, isAllowedAdminToken, storeAdminToken } from "@/app/admin/content/auth";
import { finalizeContentItem } from "@/lib/content-item-factory";
import { mapContentItemToSupabaseRow } from "@/lib/adapters/instagram";
import { slugify, unique } from "@/lib/utils";
import type { ContentItemDraft, ContentStatus, ContentType, WeekendCategory } from "@/lib/types";

const DEFAULT_CONTENT_TABLE = "content_items";
const DEFAULT_MEDIA_BUCKET = "content-media";

function getString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function parseList(value: string): string[] {
  return value
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeSupabaseUrl(rawUrl: string): string {
  return rawUrl.replace(/\/+$/, "");
}

async function assertAdminToken(token: string): Promise<string> {
  const resolvedToken = token || (await getStoredAdminToken());
  if (!isAllowedAdminToken(resolvedToken)) {
    throw new Error("Geen toegang tot de content editor.");
  }

  return resolvedToken;
}

function getSupabaseWriteConfig(): { url: string; key: string; table: string; mediaBucket: string } {
  const rawUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!rawUrl || !key) {
    throw new Error("Supabase write config ontbreekt. Zet SUPABASE_URL en SUPABASE_SERVICE_ROLE_KEY.");
  }

  return {
    url: normalizeSupabaseUrl(rawUrl),
    key,
    table: process.env.SUPABASE_CONTENT_TABLE ?? DEFAULT_CONTENT_TABLE,
    mediaBucket: process.env.SUPABASE_CONTENT_MEDIA_BUCKET ?? DEFAULT_MEDIA_BUCKET
  };
}

function getPublicObjectUrl(config: { url: string; mediaBucket: string }, path: string): string {
  return `${config.url}/storage/v1/object/public/${config.mediaBucket}/${path}`;
}

async function uploadHeroImage(formData: FormData, slug: string): Promise<string | null> {
  const file = formData.get("heroImageFile");
  if (!(file instanceof File) || file.size === 0) return null;

  const config = getSupabaseWriteConfig();
  const extension = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const safeName = slugify(file.name.replace(/\.[^.]+$/, "")) || "hero";
  const objectPath = `${slug}/${Date.now()}-${safeName}.${extension}`;
  const endpoint = `${config.url}/storage/v1/object/${config.mediaBucket}/${objectPath}`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": file.type || "application/octet-stream",
      "x-upsert": "true"
    },
    body: Buffer.from(await file.arrayBuffer())
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Hero image upload mislukt (${response.status}). ${details}`);
  }

  return getPublicObjectUrl(config, objectPath);
}

async function upsertContentItem(draft: ContentItemDraft): Promise<void> {
  const config = getSupabaseWriteConfig();
  const row = mapContentItemToSupabaseRow(finalizeContentItem(draft));
  const endpoint = `${config.url}/rest/v1/${config.table}?on_conflict=id`;

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      apikey: config.key,
      Authorization: `Bearer ${config.key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify(row)
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`Content opslaan mislukt (${response.status}). ${details}`);
  }
}

export async function saveContentItemAction(formData: FormData): Promise<void> {
  await assertAdminToken(getString(formData, "adminToken"));

  const now = new Date().toISOString();
  const title = getString(formData, "title");
  if (!title) throw new Error("Titel is verplicht.");

  const contentType = (getString(formData, "contentType") || "eigen_post") as ContentType;
  if (contentType !== "guide" && contentType !== "eigen_post") {
    throw new Error("Alleen Guide en Eigen post kunnen via deze editor worden aangemaakt.");
  }

  const explicitStatus = getString(formData, "status") as ContentStatus;
  const intent = getString(formData, "intent");
  const status: ContentStatus = intent === "publish" ? "published" : intent === "draft" ? "draft" : explicitStatus || "draft";
  const slug = slugify(getString(formData, "slug") || title);
  const id = getString(formData, "id") || `site-${slug}-${Date.now()}`;
  const uploadedHeroImage = await uploadHeroImage(formData, slug);
  const imageUrl = uploadedHeroImage ?? getString(formData, "imageUrl");

  if (!imageUrl) {
    throw new Error("Voeg een hero image URL toe of upload een hero image.");
  }

  const bodyParagraphs = getString(formData, "body")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const excerpt = getString(formData, "excerpt");
  const publishedAt = getString(formData, "publishedAt") || now;
  const firstPublishedAt = getString(formData, "firstPublishedAt") || (status === "published" ? publishedAt : undefined);
  const mediaUrls = unique([imageUrl, ...parseList(getString(formData, "mediaUrls"))]);
  const seoTitle = getString(formData, "seoTitle");
  const seoDescription = getString(formData, "seoDescription");
  const googleMapsUrl = getString(formData, "googleMapsUrl");

  const draft: ContentItemDraft = {
    id,
    slug,
    title,
    excerpt,
    caption: excerpt,
    body: bodyParagraphs.length > 0 ? bodyParagraphs : [excerpt],
    contentType,
    sourcePlatform: "editorial",
    mediaType: mediaUrls.length > 1 ? "carousel" : "image",
    image: imageUrl,
    thumbnail: imageUrl,
    mediaUrls,
    publishedAt,
    firstPublishedAt,
    lastMaterialUpdateAt: now,
    relevanceStartAt: getString(formData, "relevanceStartAt") || undefined,
    relevanceEndAt: getString(formData, "relevanceEndAt") || undefined,
    evergreenScore: contentType === "guide" ? 50 : 10,
    freshnessRank: undefined,
    status,
    contentLayer: contentType === "guide" ? "evergreen" : "fast",
    categories: parseList(getString(formData, "categories")) as WeekendCategory[],
    themes: parseList(getString(formData, "themes")),
    moments: parseList(getString(formData, "moments")),
    tags: parseList(getString(formData, "tags")),
    hashtags: [],
    manualTags: ["admin-editor"],
    isFeatured: false,
    featured: false,
    collectionIds: [],
    relatedIds: [],
    seo: {
      title: seoTitle || undefined,
      description: seoDescription || undefined,
      googleMapsUrl: googleMapsUrl || undefined,
      canonicalPath: `/ontdek/${slug}`
    }
  };

  await upsertContentItem(draft);

  revalidatePath("/");
  revalidatePath("/ontdek");
  revalidatePath(`/ontdek/${slug}`);
  redirect("/admin/content");
}

export async function loginContentAdminAction(formData: FormData): Promise<void> {
  const adminToken = getString(formData, "token");
  await assertAdminToken(adminToken);
  await storeAdminToken(adminToken);
  redirect("/admin/content");
}
