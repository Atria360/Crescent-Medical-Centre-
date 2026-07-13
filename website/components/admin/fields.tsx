"use client";

import { useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MEDIA_BUCKET, SUPABASE_URL, mediaUrl } from "@/lib/config";

export const inputCls =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-teal";

export function TextField({
  label, value, onChange, textarea = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-gray">
        {label}
      </span>
      {textarea ? (
        <textarea rows={4} value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={inputCls} />
      )}
    </label>
  );
}

export function ImageField({
  label, value, onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    setUploading(true);
    setError("");
    const supabase = createClient();
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `uploads/${Date.now()}-${safeName}`;
    const { error } = await supabase.storage.from(MEDIA_BUCKET).upload(path, file, {
      cacheControl: "3600",
      upsert: false,
    });
    if (error) {
      setError(error.message);
    } else {
      onChange(`${SUPABASE_URL}/storage/v1/object/public/${MEDIA_BUCKET}/${path}`);
    }
    setUploading(false);
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-brand-gray">
        {label}
      </span>
      <div className="flex items-start gap-3">
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(value)}
            alt=""
            className="h-20 w-20 shrink-0 rounded-lg border border-gray-200 object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400">
            none
          </div>
        )}
        <div className="min-w-0 flex-1 space-y-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Image URL"
            className={inputCls}
          />
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="rounded-full bg-teal px-4 py-1.5 text-xs font-bold text-white hover:bg-teal-dark disabled:opacity-60"
            >
              {uploading ? "Uploading…" : "Upload image"}
            </button>
            {value && (
              <button
                type="button"
                onClick={() => onChange("")}
                className="text-xs font-bold text-brand-red hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          {error && <p className="text-xs font-bold text-brand-red">{error}</p>}
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
              e.target.value = "";
            }}
          />
        </div>
      </div>
    </div>
  );
}
