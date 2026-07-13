"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { BlockSchema, Field } from "@/lib/cms-schemas";
import { TextField, ImageField } from "./fields";

type Data = Record<string, unknown>;

export default function BlockEditor({ schema }: { schema: BlockSchema }) {
  const [data, setData] = useState<Data | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("content_blocks")
      .select("data")
      .eq("key", schema.key)
      .maybeSingle()
      .then(({ data: row }) => setData((row?.data as Data) ?? {}));
  }, [schema.key]);

  async function save() {
    if (!data) return;
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase
      .from("content_blocks")
      .upsert({ key: schema.key, label: schema.label, data, updated_at: new Date().toISOString() });
    if (error) setError(error.message);
    else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setSaving(false);
  }

  if (data === null) {
    return <p className="text-sm text-brand-gray">Loading…</p>;
  }

  return (
    <div className="max-w-3xl">
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
