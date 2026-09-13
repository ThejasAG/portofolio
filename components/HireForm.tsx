"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Loader } from "lucide-react";
import MagneticButton from "./MagneticButton";
import { usePrefersReducedMotion } from "@/lib/useReducedMotion";

type Errors = Partial<Record<"name" | "email" | "role" | "message" | "form", string>>;

const FIELDS = [
  { name: "name",    label: "Name",           required: true,  type: "text"  },
  { name: "company", label: "Company",         required: false, type: "text"  },
  { name: "email",   label: "Email",           required: true,  type: "email" },
  { name: "role",    label: "Role / project",  required: true,  type: "text"  },
] as const;

export default function HireForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Errors>({});
  const reduced = usePrefersReducedMotion();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    setStatus("sending");
    setErrors({});

    try {
      const res = await fetch("/api/hire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setStatus("sent");
        form.reset();
        return;
      }

      const payload = await res.json().catch(() => ({}));
      setErrors(payload.errors ?? { form: payload.error ?? "Something went wrong." });
      setStatus("idle");
    } catch {
      setErrors({ form: "Couldn't reach the server. Please email directly." });
      setStatus("idle");
    }
  }

  if (status === "sent") {
    return (
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="flex items-center gap-3 py-10 text-lg font-medium tracking-[-0.02em]"
      >
        <Check size={20} strokeWidth={2} className="text-[var(--color-accent)]" />
        Thanks — your message has been sent.
      </motion.p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="mt-8">
      <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
        {FIELDS.map((f, fi) => (
          <motion.div
            key={f.name}
            className={f.name === "role" ? "sm:col-span-2" : ""}
            initial={reduced ? undefined : { opacity: 0, y: 14 }}
            whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              delay: fi * 0.07,
              duration: 0.55,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            <label htmlFor={f.name} className="text-meta block">
              {f.label}
              {f.required && <span aria-hidden> *</span>}
            </label>
            <input
              id={f.name}
              name={f.name}
              type={f.type}
              required={f.required}
              aria-invalid={Boolean(errors[f.name as keyof Errors]) || undefined}
              aria-describedby={errors[f.name as keyof Errors] ? `${f.name}-error` : undefined}
              className="mt-3 min-h-11 w-full border-b border-[var(--color-line)] bg-transparent py-2 text-base outline-none transition-all duration-300 focus:border-[var(--color-accent)] placeholder:text-[var(--color-faint)]"
            />
            {errors[f.name as keyof Errors] && (
              <motion.p
                id={`${f.name}-error`}
                className="mt-2 text-sm text-[var(--color-accent)]"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {errors[f.name as keyof Errors]}
              </motion.p>
            )}
          </motion.div>
        ))}

        <motion.div
          className="sm:col-span-2"
          initial={reduced ? undefined : { opacity: 0, y: 14 }}
          whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ delay: 0.28, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <label htmlFor="message" className="text-meta block">
            Message <span aria-hidden>*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            required
            aria-invalid={Boolean(errors.message) || undefined}
            aria-describedby={errors.message ? "message-error" : undefined}
            className="mt-3 w-full resize-y border-b border-[var(--color-line)] bg-transparent py-2 text-base outline-none transition-all duration-300 focus:border-[var(--color-accent)] placeholder:text-[var(--color-faint)]"
          />
          {errors.message && (
            <motion.p
              id="message-error"
              className="mt-2 text-sm text-[var(--color-accent)]"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {errors.message}
            </motion.p>
          )}
        </motion.div>
      </div>

      <AnimatePresence>
        {errors.form && (
          <motion.p
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-6 text-sm text-[var(--color-accent)]"
          >
            {errors.form}
          </motion.p>
        )}
      </AnimatePresence>

      <div className="mt-10">
        <MagneticButton>
          <button
            type="submit"
            disabled={status === "sending"}
            data-cursor="VIEW"
            className="touch-press group inline-flex min-h-11 items-center gap-2.5 rounded-full bg-[var(--color-fg)] px-7 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--color-bg)] transition-opacity hover:opacity-85 disabled:opacity-50"
          >
            {status === "sending" ? (
              <>
                <Loader size={14} strokeWidth={2} className="animate-spin" />
                Sending…
              </>
            ) : (
              <>
                Send inquiry
                <ArrowRight
                  size={14}
                  strokeWidth={2}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </>
            )}
          </button>
        </MagneticButton>
      </div>
    </form>
  );
}
