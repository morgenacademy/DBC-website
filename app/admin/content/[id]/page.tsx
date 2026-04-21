import Link from "next/link";
import { notFound } from "next/navigation";
import { ContentForm } from "@/app/admin/content/content-form";
import { getContentRepository } from "@/lib/repositories";

export const dynamic = "force-dynamic";

interface EditContentPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ token?: string }>;
}

function getExpectedAdminToken(): string | null {
  return process.env.CONTENT_ADMIN_TOKEN ?? process.env.ADMIN_CONTENT_TOKEN ?? null;
}

function isAllowed(token: string): boolean {
  const expectedToken = getExpectedAdminToken();
  return !expectedToken || token === expectedToken;
}

export default async function EditContentPage({ params, searchParams }: EditContentPageProps): Promise<React.JSX.Element> {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const adminToken = resolvedSearchParams.token ?? "";

  if (!isAllowed(adminToken)) {
    return (
      <section className="mx-auto max-w-md px-4 py-16">
        <h1 className="text-2xl font-bold text-brand-teal">Geen toegang</h1>
        <Link href="/admin/content" className="mt-4 inline-flex font-semibold text-brand-orange">
          Terug naar login
        </Link>
      </section>
    );
  }

  const contentRepository = await getContentRepository();
  const item = contentRepository.listContent({ status: "all" }).find((candidate) => candidate.id === resolvedParams.id);

  if (!item || (item.contentType !== "guide" && item.contentType !== "eigen_post")) {
    notFound();
  }

  return (
    <section className="mx-auto w-full max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
      <header className="space-y-2">
        <Link href={`/admin/content?token=${encodeURIComponent(adminToken)}`} className="text-sm font-semibold text-brand-orange">
          Terug naar content
        </Link>
        <h1 className="text-3xl font-bold text-brand-teal">Edit content</h1>
        <p className="text-brand-teal/70">{item.title}</p>
      </header>

      <ContentForm adminToken={adminToken} item={item} />
    </section>
  );
}
