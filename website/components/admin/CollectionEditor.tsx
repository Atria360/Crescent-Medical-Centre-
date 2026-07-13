"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { CollectionSchema, Column } from "@/lib/cms-schemas";
import { TextField, ImageField, inputCls } from "./fields";
import { mediaUrl } from "@/lib/config";

type Row = Record<string, unknown> & { id: string };

export default function CollectionEditor({ schema }: { schema: CollectionSchema }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [error, setError] = useState("");
  const [feeSections, setFeeSections] = useState<{ id: string; title: string }[]>([]);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from(schema.table).select("*").order(schema.orderBy);
    setRows((data as Row[]) ?? []);
    if (schema.table === "fee_items") {
      const { data: sections } = await supabase.from("fee_sections").select("id, title").order("sort");
      setFeeSections(sections ?? []);
    }
  }, [schema.table, schema.orderBy]);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm(`Delete this ${schema.singular}?`)) return;
    const supabase = createClient();
    const { error } = await supabase.from(schema.table).delete().eq("id", id);
    if (error) setError(error.message);
    await load();
  }

  const tableCols = schema.columns.filter((c) => c.inTable);

  if (rows === null) return <p className="text-sm text-brand-gray">Loading…</p>;

  return (
    <div>
      {error && <p className="mb-4 text-sm font-bold text-brand-red">{error}</p>}

      {editing !== null ? (
        <RowForm
          schema={schema}
          feeSections={feeSections}
          row={editing === "new" ? null : editing}
          onDone={async () => {
            setEditing(null);
            await load();
          }}
          onCancel={() => setEditing(null)}
        />
      ) : (
        <>
          <button onClick={() => setEditing("new")} className="btn-teal mb-6">
            + Add {schema.singular}
          </button>
          <div className="overflow-x-auto rounded-card border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-brand-light text-left">
                  {tableCols.map((c) => (
                    <th key={c.name} className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-brand-gray">
                      {c.label}
                    </th>
                  ))}
                  <th className="w-32 px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 last:border-0">
                    {tableCols.map((c) => (
                      <td key={c.name} className="max-w-xs truncate px-4 py-3 align-middle">
                        <CellValue col={c} value={row[c.name]} feeSections={feeSections} />
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setEditing(row)} className="mr-3 font-bold text-teal hover:underline">
                        Edit
                      </button>
                      <button onClick={() => remove(row.id)} className="font-bold text-brand-red hover:underline">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={tableCols.length + 1} className="px-4 py-8 text-center text-brand-gray">
                      Nothing here yet — add the first {schema.singular}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

function CellValue({
  col, value, feeSections,
}: {
  col: Column;
  value: unknown;
  feeSections: { id: string; title: string }[];
}) {
  if (col.type === "image" && typeof value === "string" && value) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={mediaUrl(value)} alt="" className="h-10 w-10 rounded object-cover" />;
  }
  if (col.type === "boolean") return <span>{value ? "✓" : "—"}</span>;
  if (col.name === "section_id") {
    return <span>{feeSections.find((s) => s.id === value)?.title ?? "?"}</span>;
  }
  return <span>{String(value ?? "")}</span>;
}

function RowForm({
  schema, row, feeSections, onDone, onCancel,
}: {
  schema: CollectionSchema;
  row: Row | null;
  feeSections: { id: string; title: string }[];
  onDone: () => void;
  onCancel: () => void;
}) {
  const [data, setData] = useState<Record<string, unknown>>(() => {
    if (row) return { ...row };
    const init: Record<string, unknown> = {};
    for (const c of schema.columns) {
      init[c.name] =
        c.type === "boolean" ? false : c.type === "number" ? 0 : "";
    }
    return init;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function save() {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const payload: Record<string, unknown> = {};
    for (const c of schema.columns) payload[c.name] = data[c.name];
    const q = row
      ? supabase.from(schema.table).update(payload).eq("id", row.id)
      : supabase.from(schema.table).insert(payload);
    const { error } = await q;
    if (error) {
      setError(error.message);
      setSaving(false);
    } else {
      onDone();
    }
  }

  return (
    <div className="max-w-2xl rounded-card border border-gray-200 bg-white p-7 shadow-sm">
      <h2 className="text-xl">{row ? `Edit ${schema.singular}` : `New ${schema.singular}`}</h2>
      <div className="mt-6 space-y-5">
        {schema.columns.map((c) => {
          const v = data[c.name];
          if (c.type === "image") {
            return (
              <ImageField
                key={c.name}
                label={c.label}
                value={typeof v === "string" ? v : ""}
                onChange={(nv) => setData({ ...data, [c.name]: nv })}
              />
            );
          }
          if (c.type === "boolean") {
            return (
              <label key={c.name} className="flex items-center gap-3 text-sm font-bold">
                <input
                  type="checkbox"
                  checked={Boolean(v)}
                  onChange={(e) => setData({ ...data, [c.name]: e.target.checked })}
                  className="h-4 w-4 accent-teal"
                />
                {c.label}
              </label>
            );
          }
          if (c.type === "number") {
            return (
              <label key={c.name} className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-gray">
                  {c.label}
                </span>
                <input
                  type="number"
                  value={Number(v ?? 0)}
                  onChange={(e) => setData({ ...data, [c.name]: Number(e.target.value) })}
                  className={inputCls}
                />
              </label>
            );
          }
          if (c.type === "select") {
            const options =
              c.name === "section_id"
                ? feeSections.map((s) => ({ value: s.id, label: s.title }))
                : (c.options ?? []).map((o) => ({ value: o, label: o }));
            return (
              <label key={c.name} className="block">
                <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-gray">
                  {c.label}
                </span>
                <select
                  value={typeof v === "string" ? v : ""}
                  onChange={(e) => setData({ ...data, [c.name]: e.target.value })}
                  className={inputCls}
                >
                  <option value="" disabled>Select…</option>
                  {options.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>
            );
          }
          return (
            <TextField
              key={c.name}
              label={c.label}
              value={typeof v === "string" ? v : ""}
              onChange={(nv) => setData({ ...data, [c.name]: nv })}
              textarea={c.type === "textarea"}
            />
          );
        })}
      </div>
      {error && <p className="mt-4 text-sm font-bold text-brand-red">{error}</p>}
      <div className="mt-7 flex gap-3">
        <button onClick={save} disabled={saving} className="btn-teal disabled:opacity-60">
          {saving ? "Saving…" : "Save"}
        </button>
        <button onClick={onCancel} className="btn rounded-full border border-gray-300 text-brand-gray hover:bg-gray-100">
          Cancel
        </button>
      </div>
    </div>
  );
}
