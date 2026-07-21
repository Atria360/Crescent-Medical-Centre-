"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LOCATION_FIELDS, type Field } from "@/lib/cms-schemas";
import { TextField, ImageField, ColorField, inputCls } from "./fields";
import { useAdminLocation } from "./LocationContext";

type Data = Record<string, unknown>;

export default function LocationsEditor() {
  const { locations, currentSlug, ready } = useAdminLocation();
  const [data, setData] = useState<Data | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

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
        if (active) setData((row as Data) ?? {});
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
          <LocField
            key={f.name}
            field={f}
            value={data[f.name]}
            onChange={(v) => setData({ ...data, [f.name]: v })}
          />
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
