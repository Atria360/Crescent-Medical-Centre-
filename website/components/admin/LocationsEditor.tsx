"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LOCATION_FIELDS, type Field } from "@/lib/cms-schemas";
import { TextField, ImageField, ColorField, inputCls } from "./fields";
import { parseRecipients, invalidRecipients } from "@/lib/email-address";
import { useAdminLocation } from "./LocationContext";

type Data = Record<string, unknown>;

export default function LocationsEditor() {
  const { locations, currentSlug, ready } = useAdminLocation();
  const [data, setData] = useState<Data | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  // The test-send button reads the saved row from the database, so it has to
  // warn when the field on screen hasn't been saved yet.
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (!ready || !currentSlug) return;
    let active = true;
    setData(null);
    const supabase = createClient();
    supabase
      .from("locations")
      .select("*")
      .eq("slug", currentSlug)
      .maybeSingle()
      .then(({ data: row }) => {
        if (!active) return;
        setData((row as Data) ?? {});
        setDirty(false);
      });
    return () => {
      active = false;
    };
  }, [currentSlug, ready]);

  async function save() {
    if (!data) return;
    setSaving(true);
    setError("");
    const supabase = createClient();
    const payload: Data = {};
    for (const f of LOCATION_FIELDS) payload[f.name] = data[f.name];
    const { error } = await supabase.from("locations").update(payload).eq("slug", currentSlug);
    if (error) setError(error.message);
    else {
      setSaved(true);
      setDirty(false);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }

  const area = locations.find((l) => l.slug === currentSlug)?.area ?? currentSlug;

  if (data === null) return <p className="text-sm text-brand-gray">Loading…</p>;

  return (
    <div className="max-w-3xl">
      <p className="mb-6 rounded-lg bg-teal/10 px-4 py-2.5 text-sm text-teal">
        Editing branding &amp; contact for the <b>{area}</b> location. Use the location switcher in
        the sidebar to edit the other clinic.
      </p>
      <div className="space-y-6">
        {LOCATION_FIELDS.map((f) => (
          <div key={f.name}>
            <LocField
              field={f}
              value={data[f.name]}
              onChange={(v) => {
                setData({ ...data, [f.name]: v });
                setDirty(true);
              }}
            />
            {f.name === "form_email" && (
              <FormEmailStatus
                slug={currentSlug}
                area={area}
                formEmail={typeof data.form_email === "string" ? data.form_email : ""}
                publicEmail={typeof data.email === "string" ? data.email : ""}
                dirty={dirty}
              />
            )}
          </div>
        ))}
      </div>
      <div className="sticky bottom-0 mt-8 flex items-center gap-4 border-t border-gray-200 bg-brand-light py-4">
        <button onClick={save} disabled={saving} className="btn-teal disabled:opacity-60">
          {saving ? "Saving…" : "Save changes"}
        </button>
        {saved && <span className="text-sm font-bold text-teal">Saved ✓ — live on the site</span>}
        {error && <span className="text-sm font-bold text-brand-red">{error}</span>}
      </div>
    </div>
  );
}

function LocField({
  field, value, onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  if (field.type === "color") {
    return <ColorField label={field.label} value={typeof value === "string" ? value : ""} onChange={onChange} />;
  }
  if (field.type === "image") {
    return <ImageField label={field.label} value={typeof value === "string" ? value : ""} onChange={onChange} />;
  }
  if (field.type === "text" || field.type === "textarea") {
    return (
      <TextField
        label={field.label}
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
        textarea={field.type === "textarea"}
        help={field.help}
      />
    );
  }
  // list (hours)
  const items: Record<string, string>[] = Array.isArray(value) ? (value as Record<string, string>[]) : [];
  const sub = field.of ?? [];
  return (
    <fieldset className="rounded-card border border-gray-200 bg-white p-5">
      <legend className="px-2 text-xs font-bold uppercase tracking-wider text-brand-gray">{field.label}</legend>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <input
              value={item[sub[0]?.name] ?? ""}
              onChange={(e) => onChange(items.map((it, idx) => (idx === i ? { ...it, [sub[0].name]: e.target.value } : it)))}
              className={inputCls}
            />
            <button
              type="button"
              onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              className="shrink-0 text-sm font-bold text-brand-red hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, Object.fromEntries(sub.map((sf) => [sf.name, ""]))])}
          className="rounded-full border-2 border-dashed border-teal px-5 py-2 text-sm font-bold text-teal hover:bg-teal hover:text-white"
        >
          + Add line
        </button>
      </div>
    </fieldset>
  );
}

/**
 * Shows exactly where this clinic's contact-form enquiries will land, flags a
 * malformed address, and sends a real test email so staff can confirm the
 * inbox receives it.
 */
function FormEmailStatus({
  slug, area, formEmail, publicEmail, dirty,
}: {
  slug: string;
  area: string;
  formEmail: string;
  publicEmail: string;
  dirty: boolean;
}) {
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<
    { ok: boolean; to?: string[]; error?: string; provider?: string } | null
  >(null);

  const recipients = parseRecipients(formEmail);
  const fallback = parseRecipients(publicEmail);
  const effective = recipients.length ? recipients : fallback;
  const usingFallback = recipients.length === 0 && fallback.length > 0;
  const bad = invalidRecipients(formEmail);

  async function sendTest() {
    setSending(true);
    setResult(null);
    try {
      const res = await fetch("/api/contact/test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location: slug }),
      });
      setResult(await res.json());
    } catch {
      setResult({ ok: false, error: "Could not reach the server." });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mt-3 rounded-lg border border-gray-200 bg-white p-4">
      {effective.length > 0 ? (
        <p className="text-sm text-brand-dark">
          Enquiries from the <b>{area}</b> contact form go to{" "}
          <b className="text-teal">{effective.join(", ")}</b>
          {usingFallback && (
            <span className="text-brand-gray"> (falling back to the public email)</span>
          )}
          .
        </p>
      ) : (
        <p className="text-sm font-bold text-brand-red">
          No valid recipient set — enquiries will only appear in Messages, not by email.
        </p>
      )}

      {bad.length > 0 && (
        <p className="mt-2 text-sm font-bold text-brand-red">
          Not a valid email address: {bad.join(", ")}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={sendTest}
          disabled={sending || dirty || effective.length === 0}
          className="rounded-full bg-teal px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-dark disabled:opacity-50"
        >
          {sending ? "Sending…" : "Send test email"}
        </button>
        {dirty && (
          <span className="text-xs text-brand-gray">Save your changes first to test them.</span>
        )}
      </div>

      {result && (
        <div className="mt-3 text-sm">
          {result.ok ? (
            <p className="font-bold text-teal">
              Test email sent to {(result.to ?? []).join(", ")} — check that inbox (and its spam
              folder).
            </p>
          ) : (
            <>
              <p className="font-bold text-brand-red">Test email failed.</p>
              {result.error && (
                <p className="mt-1 leading-snug text-brand-gray">{result.error}</p>
              )}
              {result.provider === "formsubmit" && (
                <p className="mt-1 leading-snug text-brand-gray">
                  On the no-API-key fallback, a new address must first click the one-time
                  activation email FormSubmit sends it.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
