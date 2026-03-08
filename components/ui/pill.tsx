import { cn } from "@/lib/utils";

interface PillProps {
  label: string;
  tone?: "default" | "accent";
}

export function Pill({ label, tone = "default" }: PillProps): React.JSX.Element {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        tone === "default" ? "bg-brand-sand text-brand-teal" : "bg-brand-coral text-white"
      )}
    >
      {label}
    </span>
  );
}
