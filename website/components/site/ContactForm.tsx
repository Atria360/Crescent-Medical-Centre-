"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function ContactForm({
  withSubject = true,
  defaultSubject = "",
}: {
  withSubject?: boolean;
  defaultSubject?: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({
    subject: defaultSubject,
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    const supabase = createClient();
    const { error } = await supabase.from("messages").insert({
      subject: withSubject ? form.subject : defaultSubject,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
    });
    if (error) {
      setState("error");
    } else {
      setState("sent");
      setForm({ subject: defaultSubject, name: "", email: "", phone: "", message: "" });
    }
  }

  if (state === "sent") {
    return (
      <div className="rounded-card bg-teal/10 p-8 text-center">
        <p className="text-lg font-bold text-teal">Thank you!</p>
        <p className="mt-2 text-sm text-brand-body">
          Your message has been received. We&apos;ll get back to you shortly.
        </p>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-teal";

  return (
    <form onSubmit={submit} className="space-y-4">
      {withSubject && (
        <select
          required
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
          className={inputCls}
        >
          <option value="" disabled>
            Select Subject *
          </option>
          <option>Book An Appointment</option>
          <option>Request an Enquiry</option>
          <option>Others</option>
        </select>
      )}
      <input
        required
        placeholder="Name *"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={inputCls}
      />
      <input
        required
        type="email"
        placeholder="Email *"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={inputCls}
      />
      <input
        required
        type="tel"
        placeholder="Phone *"
        value={form.phone}
        onChange={(e) => setForm({ ...form, phone: e.target.value })}
        className={inputCls}
      />
      <textarea
        rows={4}
        placeholder="Message (Optional)"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className={inputCls}
      />
      {state === "error" && (
        <p className="text-sm font-bold text-brand-red">
          Something went wrong — please try again or call us.
        </p>
      )}
      <button type="submit" disabled={state === "sending"} className="btn-teal disabled:opacity-60">
        {state === "sending" ? "Sending…" : "Submit"}
      </button>
    </form>
  );
}
