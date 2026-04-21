import Link from "next/link";
import { isAllowedAdminToken, resolveAdminToken } from "@/app/admin/content/auth";
import { ContentForm } from "@/app/admin/content/content-form";

export const dynamic = "force-dynamic";

interface NewContentPageProps {
  searchParams: Promise<{ token?: string; type?: string }>;
}

export default async function NewContentPage({ searchParams }: NewContentPageProps): Promise<React.JSX.Element> {
  const resolvedSearchParams = await searchParams;
  const adminToken = await resolveAdminToken(resolvedSearchParams.token);
  const linkToken = resolvedSearchParams.token && isAllowedAdminToken(resolvedSearchParams.token) ? adminToken : "";
  const defaultContentType = resolvedSearchParams.type === "guide" ? "guide" : "eigen_post";

  if (!isAllowedAdminToken(adminToken)) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-brand-teal">Geen toegang</h1>
        <Link href="/admin/content" className="mt-4 inline-flex font-semibold text-brand-orange">
          Terug naar login
        </Link>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <Link href={`/admin/content${linkToken ? `?token=${encodeURIComponent(linkToken)}` : ""}`} className="text-sm font-semibold text-brand-orange">
          Terug naar content
        </Link>
        <h1 className="text-3xl font-bold text-brand-teal">New content</h1>
        <p className="text-brand-teal/70">Maak een Guide of Eigen post. Instafirst updates blijven via Meta lopen.</p>
      </header>

      <ContentForm adminToken={adminToken} defaultContentType={defaultContentType} />
    </section>
  );
}
