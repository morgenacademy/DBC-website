import type { ContentItem, ContentType } from "@/lib/types";
import { saveContentItemAction } from "@/app/admin/content/actions";

interface ContentFormProps {
  adminToken: string;
  item?: ContentItem;
  defaultContentType?: Extract<ContentType, "guide" | "eigen_post">;
}

function joinValues(values: string[] | undefined): string {
  return values?.join(", ") ?? "";
}

function toTextareaBody(item: ContentItem | undefined): string {
  return item?.body.join("\n\n") ?? "";
}

export function ContentForm({ adminToken, item, defaultContentType = "eigen_post" }: ContentFormProps): React.JSX.Element {
  const contentType = item?.contentType === "guide" || item?.contentType === "eigen_post" ? item.contentType : defaultContentType;
  const extraMediaUrls = item ? item.mediaUrls.filter((url) => url !== item.image) : [];
  const primarySaveIntent = item?.status === "published" ? "save" : "draft";
  const primarySaveLabel = item?.status === "published" ? "Save" : "Save draft";

  return (
    <form action={saveContentItemAction} className="space-y-6 rounded-editorial border border-brand-teal/15 bg-white p-5 shadow-card">
      <input type="hidden" name="adminToken" value={adminToken} />
      <input type="hidden" name="id" value={item?.id ?? ""} />
      <input type="hidden" name="publishedAt" value={item?.publishedAt ?? ""} />
      <input type="hidden" name="firstPublishedAt" value={item?.firstPublishedAt ?? ""} />

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Type
          <select name="contentType" defaultValue={contentType} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2">
            <option value="guide">Guide</option>
            <option value="eigen_post">Eigen post</option>
          </select>
        </label>

        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Status
          <select name="status" defaultValue={item?.status ?? "draft"} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </label>
      </div>

      <label className="space-y-2 text-sm font-semibold text-brand-teal">
        Titel
        <input name="title" required defaultValue={item?.title ?? ""} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
      </label>

      <label className="space-y-2 text-sm font-semibold text-brand-teal">
        Slug
        <input
          name="slug"
          defaultValue={item?.slug ?? ""}
          placeholder="Laat leeg om automatisch te maken"
          className="w-full rounded-xl border border-brand-teal/20 px-3 py-2"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-brand-teal">
        Intro / excerpt
        <textarea name="excerpt" required defaultValue={item?.excerpt ?? ""} rows={3} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
      </label>

      <label className="space-y-2 text-sm font-semibold text-brand-teal">
        Body
        <textarea
          name="body"
          required
          defaultValue={toTextareaBody(item)}
          rows={14}
          placeholder="Gebruik witregels tussen alinea's."
          className="w-full rounded-xl border border-brand-teal/20 px-3 py-2"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Hero image URL
          <input name="imageUrl" defaultValue={item?.image ?? ""} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>

        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Hero image upload
          <input name="heroImageFile" type="file" accept="image/*" className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>
      </div>

      <label className="space-y-2 text-sm font-semibold text-brand-teal">
        Extra media URLs
        <textarea
          name="mediaUrls"
          defaultValue={joinValues(extraMediaUrls)}
          rows={3}
          placeholder="Een URL per regel of kommagescheiden."
          className="w-full rounded-xl border border-brand-teal/20 px-3 py-2"
        />
      </label>

      <label className="space-y-2 text-sm font-semibold text-brand-teal">
        Google Maps URL
        <input
          name="googleMapsUrl"
          defaultValue={item?.seo?.googleMapsUrl ?? ""}
          placeholder="https://www.google.com/maps/..."
          className="w-full rounded-xl border border-brand-teal/20 px-3 py-2"
        />
      </label>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Relevance start
          <input name="relevanceStartAt" type="datetime-local" defaultValue={item?.relevanceStartAt?.slice(0, 16) ?? ""} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Relevance end
          <input name="relevanceEndAt" type="datetime-local" defaultValue={item?.relevanceEndAt?.slice(0, 16) ?? ""} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Categories
          <input name="categories" defaultValue={joinValues(item?.categories)} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Themes
          <input name="themes" defaultValue={joinValues(item?.themes)} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Moments
          <input name="moments" defaultValue={joinValues(item?.moments)} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Tags
          <input name="tags" defaultValue={joinValues(item?.tags)} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          SEO title
          <input name="seoTitle" defaultValue={item?.seo?.title ?? ""} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          SEO description
          <input name="seoDescription" defaultValue={item?.seo?.description ?? ""} className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button name="intent" value={primarySaveIntent} className="rounded-full border border-brand-teal/25 bg-white px-5 py-2 text-sm font-semibold text-brand-teal">
          {primarySaveLabel}
        </button>
        <button name="intent" value="publish" className="rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-white">
          Publish
        </button>
      </div>
    </form>
  );
}
