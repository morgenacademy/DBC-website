import Link from "next/link";

export default function NotFound(): React.JSX.Element {
  return (
    <div className="mx-auto flex min-h-[55vh] w-full max-w-3xl flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="font-display text-sm uppercase tracking-[0.24em] text-brand-coral">404</p>
      <h1 className="text-4xl font-bold text-brand-teal">Pagina niet gevonden</h1>
      <p className="max-w-lg text-sm text-brand-teal/70">Deze route bestaat niet of is verplaatst binnen het nieuwe Den Bosch City platform.</p>
      <Link href="/discover" className="rounded-full bg-brand-coral px-5 py-2.5 text-sm font-semibold text-white">
        Ontdek Den Bosch
      </Link>
    </div>
  );
}
