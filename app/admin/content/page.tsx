import Link from "next/link";
import { getContentRepository } from "@/lib/repositories";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface AdminContentPageProps {
  searchParams: Promise<{ token?: string }>;
}

function getExpectedAdminToken(): string | null {
  return process.env.CONTENT_ADMIN_TOKEN ?? process.env.ADMIN_CONTENT_TOKEN ?? null;
}

function isAllowed(token: string): boolean {
  const expectedToken = getExpectedAdminToken();
  return !expectedToken || token === expectedToken;
}

function tokenQuery(token: string): string {
  return token ? `?token=${encodeURIComponent(token)}` : "";
}

function AccessForm(): React.JSX.Element {
  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <form className="space-y-4 rounded-editorial border border-brand-teal/15 bg-white p-5 shadow-card">
        <h1 className="text-2xl font-bold text-brand-teal">Content editor</h1>
        <label className="space-y-2 text-sm font-semibold text-brand-teal">
          Admin token
          <input name="token" type="password" className="w-full rounded-xl border border-brand-teal/20 px-3 py-2" />
        </label>
        <button className="rounded-full bg-brand-orange px-5 py-2 text-sm font-semibold text-white">Open editor</button>
      </form>
    </section>
  );
}

export default async function AdminContentPage({ searchParams }: AdminContentPageProps): Promise<React.JSX.Element> {
  const resolvedSearchParams = await searchParams;
  const adminToken = resolvedSearchParams.token ?? "";

  if (!isAllowed(adminToken)) {
    return <AccessForm />;
  }

  const contentRepository = await getContentRepository();
  const items = contentRepository
    .listContent({ status: "all" })
    .filter((item) => item.contentType === "guide" || item.contentType === "eigen_post");

  return (
    <section className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-teal/55">Intern</p>
          <h1 className="text-3xl font-bold text-brand-teal">Content editor</h1>
          {!getExpectedAdminToken() ? <p className="mt-2 text-sm text-brand-orange">Geen admin token ingesteld; editor is open in deze omgeving.</p> : null}
        </div>
        <Link
          href={`/admin/content/new${tokenQuery(adminToken)}`}
          className="inline-flex rounded-full bg-brand-orange px-5 py-2 text-sm font-bold text-white shadow-card ring-1 ring-brand-orange/20 transition hover:bg-brand-teal"
        >
          New content
        </Link>
      </header>

      <div className="overflow-hidden rounded-editorial border border-brand-teal/15 bg-white shadow-card">
        <table className="w-full min-w-[840px] text-left text-sm">
          <thead className="bg-brand-sand/60 text-xs uppercase tracking-[0.14em] text-brand-teal/60">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3">Public link</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-teal/10">
            {items.length > 0 ? (
              items.map((item) => (
                <tr key={item.id}>
                  <td className="px-4 py-3 font-semibold text-brand-teal">{item.title}</td>
                  <td className="px-4 py-3 text-brand-teal/75">{item.contentType === "guide" ? "Guide" : "Eigen post"}</td>
                  <td className="px-4 py-3 text-brand-teal/75">{item.status}</td>
                  <td className="px-4 py-3 text-brand-teal/75">{formatDate(item.publishedAt)}</td>
                  <td className="px-4 py-3">
                    {item.status === "published" ? (
                      <Link href={`/ontdek/${item.slug}`} className="font-semibold text-brand-orange">
                        View
                        <span className="mt-1 block max-w-[18rem] truncate text-xs font-medium text-brand-teal/55">/ontdek/{item.slug}</span>
                      </Link>
                    ) : (
                      <span className="text-brand-teal/45">Niet live</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/content/${item.id}${tokenQuery(adminToken)}`} className="font-semibold text-brand-orange">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-sm font-semibold text-brand-teal/70">
                  Nog geen Guides of Eigen posts. Maak je eerste item via New content.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
