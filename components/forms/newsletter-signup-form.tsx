"use client";

import { useState } from "react";

type SubmitState = "idle" | "loading" | "success" | "error";
interface NewsletterResponsePayload {
  ok?: boolean;
  message?: string;
  reason?: string;
}

export function NewsletterSignupForm(): React.JSX.Element {
  const [state, setState] = useState<SubmitState>("idle");
  const [message, setMessage] = useState("");

  function clearFeedbackIfNeeded(): void {
    if (state !== "idle") {
      setState("idle");
      setMessage("");
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();

    setState("loading");
    setMessage("");

    try {
      const response = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email })
      });

      const raw = await response.text();
      let payload: NewsletterResponsePayload = {};
      try {
        payload = (raw ? JSON.parse(raw) : {}) as NewsletterResponsePayload;
      } catch {
        payload = {};
      }

      if (!response.ok || !payload.ok) {
        setState("error");
        setMessage(payload.message ?? payload.reason ?? "Inschrijven lukt nu niet. Probeer het zo nog eens.");
        return;
      }

      setState("success");
      setMessage(payload.message ?? "Top, je bent ingeschreven voor de nieuwsbrief.");
      form.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Er ging iets mis. Probeer het later opnieuw.");
    }
  }

  return (
    <form className="space-y-2.5" onSubmit={handleSubmit} noValidate>
      <label className="block">
        <span className="sr-only">Je naam</span>
        <input
          name="name"
          type="text"
          placeholder="Je naam"
          onChange={clearFeedbackIfNeeded}
          disabled={state === "loading"}
          className="h-10 w-full rounded-xl border border-brand-sand/25 bg-white/95 px-3 text-sm text-brand-teal disabled:cursor-not-allowed disabled:opacity-75"
        />
      </label>
      <label className="block">
        <span className="sr-only">Je e-mailadres</span>
        <input
          name="email"
          type="email"
          placeholder="Je e-mailadres"
          required
          onChange={clearFeedbackIfNeeded}
          disabled={state === "loading"}
          className="h-10 w-full rounded-xl border border-brand-sand/25 bg-white/95 px-3 text-sm text-brand-teal disabled:cursor-not-allowed disabled:opacity-75"
        />
      </label>

      <button
        type="submit"
        disabled={state === "loading"}
        className={`inline-flex min-w-52 justify-center rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed ${
          state === "loading" ? "bg-brand-coral/75" : "bg-brand-coral hover:opacity-90"
        }`}
        aria-busy={state === "loading"}
      >
        {state === "loading" ? "Bezig met inschrijven..." : "Inschrijven nieuwsbrief"}
      </button>

      {state === "loading" ? (
        <p className="text-xs text-brand-sand/80" role="status" aria-live="polite">
          We verwerken je inschrijving...
        </p>
      ) : null}

      {message && state === "success" ? (
        <p className="rounded-lg border border-brand-aqua/35 bg-brand-aqua/15 px-3 py-2 text-xs text-brand-sand" role="status" aria-live="polite">
          {message}
        </p>
      ) : null}

      {message && state === "error" ? (
        <p className="rounded-lg border border-brand-coral/35 bg-brand-coral/15 px-3 py-2 text-xs text-brand-peach" role="alert" aria-live="assertive">
          {message}
        </p>
      ) : null}
    </form>
  );
}
