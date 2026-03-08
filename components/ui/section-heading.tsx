interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left"
}: SectionHeadingProps): React.JSX.Element {
  const alignment = align === "center" ? "text-center items-center" : "text-left items-start";

  return (
    <div className={`flex flex-col gap-2 ${alignment}`}>
      {eyebrow ? (
        <p className="font-display text-sm uppercase tracking-[0.24em] text-brand-coral">{eyebrow}</p>
      ) : null}
      <h2 className="text-balance font-sans text-3xl font-bold text-brand-teal sm:text-4xl">{title}</h2>
      {description ? <p className="max-w-2xl text-pretty text-base text-brand-teal/75">{description}</p> : null}
    </div>
  );
}
