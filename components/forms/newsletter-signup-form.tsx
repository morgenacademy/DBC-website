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

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
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
        setMessage(payload.message ?? payload.reason ?? "Er ging iets mis.");
        return;
      }

      setState("success");
      setMessage(payload.message ?? "Je bent ingeschreven.");
      event.currentTarget.reset();
    } catch (error) {
      setState("error");
      setMessage(error instanceof Error ? error.message : "Er ging iets mis. Probeer het later opnieuw.");
    }
  }

  return (
    <form className="space-y-2" onSubmit={handleSubmit}>
      <label className="block">
        <span className="sr-only">Je naam</span>
        <input
          name="name"
          type="text"
          placeholder="Je naam"
          className="h-10 w-full rounded-xl border border-brand-sand/25 bg-white/95 px-3 text-sm text-brand-teal"
        />
      </label>
      <label className="block">
        <span className="sr-only">Je e-mailadres</span>
        <input
          name="email"
          type="email"
          placeholder="Je e-mailadres"
          required
          className="h-10 w-full rounded-xl border border-brand-sand/25 bg-white/95 px-3 text-sm text-brand-teal"
        />
      </label>

      <button
        type="submit"
        disabled={state === "loading"}
        className="inline-flex rounded-full bg-brand-coral px-4 py-2 text-sm font-semibold text-white disabled:opacity-70"
      >
        {state === "loading" ? "Bezig..." : "Inschrijven nieuwsbrief"}
      </button>

      {message ? (
        <p className={`text-xs ${state === "success" ? "text-brand-aqua" : "text-brand-peach"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
