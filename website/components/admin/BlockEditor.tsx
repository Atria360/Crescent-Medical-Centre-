"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BlockSchema, Field } from "@/lib/cms-schemas";
import { TextField, ImageField } from "./fields";
import { useAdminLocation } from "./LocationContext";

type Data = Record<string, unknown>;

export default function BlockEditor({ schema }: { schema: BlockSchema }) {
  const { currentSlug, isPrimary, ready } = useAdminLocation();
  const [data, setData] = useState<Data | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [inherited, setInherited] = useState(false);

  // Global blocks use the bare key; the primary location uses the bare key;
  // other locations namespace the key by slug (falling back to the shared copy).
  const effectiveKey = schema.global || isPrimary ? schema.key : `${currentSlug}:${schema.key}`;

  useEffect(() => {
    if (!ready) return;
    let active = true;
    setData(null);
    setInherited(false);
    const supabase = createClient();
    (async () => {
      const { data: row } = await supabase
        .from("content_blocks")
        .select("data")
        .eq("key", effectiveKey)
        .maybeSingle();
      if (!active) return;
      if (row?.data) {
        setData(row.data as Data);
        return;
      }
      // Non-primary location with no custom copy yet → prefill from the shared block.
      if (!schema.global && !isPrimary) {
        const { data: base } = await supabase
          .from("content_blocks")
          .select("data")
          .eq("key", schema.key)
          .maybeSingle();
        if (!active) return;
        setData((base?.data as Data) ?? {});
        setInherited(Boolean(base?.data));
        return;
      }
      setData({});
    })();
    return () => {
      active = false;
    };
  }, [effectiveKey, ready, schema.global, schema.key, isPrimary]);

  async function save() {
    if (!data) return;
    setSaving(true);
    setError("");
    const supabase = createClient();
    const label = schema.global || isPrimary ? schema.label : `${schema.label} — ${currentSlug}`;
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key: effectiveKey, label, data, updated_at: new Date().toISOString() });
    if (error) setError(error.message);
    else {
      setSaved(true);
      setInherited(false);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }

  if (data === null) {
    return <p className="text-sm text-brand-gray">Loading…</p>;
  }

  return (
    <div className="max-w-3xl">
      {schema.global ? (
        <p className="mb-6 rounded-lg bg-teal/10 px-4 py-2.5 text-sm text-teal">
          Shared across all locations.
        </p>
      ) : inherited ? (
        <p className="mb-6 rounded-lg bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          Showing the shared copy from the primary location. Edit and save to give{" "}
          <b>{currentSlug}</b> its own version.
        </p>
      ) : null}
      <div className="space-y-6">
        {schema.fields.map((field) => (
          <FieldEditor
            key={field.name}
            field={field}
            value={data[field.name]}
            onChange={(v) => setData({ ...data, [field.name]: v })}
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

function FieldEditor({
  field, value, onChange,
}: {
  field: Field;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
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
  if (field.type === "image") {
    return (
      <ImageField
        label={field.label}
        value={typeof value === "string" ? value : ""}
        onChange={onChange}
      />
    );
  }
  // list
  const items: Record<string, string>[] = Array.isArray(value)
    ? (value as Record<string, string>[])
    : [];
  const sub = field.of ?? [];

  function updateItem(i: number, name: string, v: string) {
    const next = items.map((item, idx) => (idx === i ? { ...item, [name]: v } : item));
    onChange(next);
  }
  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  }

  return (
    <fieldset className="rounded-card border border-gray-200 bg-white p-5">
      <legend className="px-2 text-xs font-bold uppercase tracking-wider text-brand-gray">
        {field.label}
      </legend>
      <div className="space-y-5">
        {items.map((item, i) => (
          <div key={i} className="rounded-lg border border-gray-100 bg-brand-light p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-bold text-brand-gray">#{i + 1}</span>
              <span className="flex gap-2 text-xs">
                <button type="button" onClick={() => move(i, -1)} className="font-bold text-brand-gray hover:text-teal">↑</button>
                <button type="button" onClick={() => move(i, 1)} className="font-bold text-brand-gray hover:text-teal">↓</button>
                <button
                  type="button"
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  className="font-bold text-brand-red hover:underline"
                >
                  Delete
                </button>
              </span>
            </div>
            <div className="space-y-3">
              {sub.map((sf) =>
                sf.type === "image" ? (
                  <ImageField
                    key={sf.name}
                    label={sf.label}
                    value={item[sf.name] ?? ""}
                    onChange={(v) => updateItem(i, sf.name, v)}
                  />
                ) : (
                  <TextField
                    key={sf.name}
                    label={sf.label}
                    value={item[sf.name] ?? ""}
                    onChange={(v) => updateItem(i, sf.name, v)}
                    textarea={sf.type === "textarea"}
                  />
                )
              )}
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...items, Object.fromEntries(sub.map((sf) => [sf.name, ""]))])}
          className="rounded-full border-2 border-dashed border-teal px-5 py-2 text-sm font-bold text-teal hover:bg-teal hover:text-white"
        >
          + Add item
        </button>
      </div>
    </fieldset>
  );
}
