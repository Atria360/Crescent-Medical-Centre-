"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  subject: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  read: boolean;
  created_at: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[] | null>(null);

  const load = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });
    setMessages((data as Message[]) ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleRead(m: Message) {
    const supabase = createClient();
    await supabase.from("messages").update({ read: !m.read }).eq("id", m.id);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this message?")) return;
    const supabase = createClient();
    await supabase.from("messages").delete().eq("id", id);
    await load();
  }

  if (messages === null) return <p className="text-sm text-brand-gray">Loading…</p>;

  return (
    <div>
      <h1 className="text-2xl">Messages</h1>
      <p className="mt-2 text-sm text-brand-body">
        Contact-form submissions from the website.
      </p>
      <div className="mt-8 space-y-4">
        {messages.length === 0 && (
          <p className="text-sm text-brand-gray">No messages yet.</p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`card border p-6 ${m.read ? "border-gray-100" : "border-teal"}`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                {!m.read && (
                  <span className="rounded-full bg-teal px-2.5 py-0.5 text-xs font-bold text-white">NEW</span>
                )}
                <h2 className="text-base">{m.name}</h2>
                <span className="text-xs text-brand-gray">
                  {new Date(m.created_at).toLocaleString("en-CA")}
                </span>
              </div>
              <div className="flex gap-4 text-sm">
                <button onClick={() => toggleRead(m)} className="font-bold text-teal hover:underline">
                  Mark {m.read ? "unread" : "read"}
                </button>
                <button onClick={() => remove(m.id)} className="font-bold text-brand-red hover:underline">
                  Delete
                </button>
              </div>
            </div>
            {m.subject && (
              <p className="mt-3 text-sm font-bold">{m.subject}</p>
            )}
            <p className="mt-1 whitespace-pre-line text-sm text-brand-body">{m.message}</p>
            <p className="mt-3 text-sm">
              <a href={`mailto:${m.email}`} className="font-bold text-teal hover:underline">{m.email}</a>
              {m.phone && (
                <>
                  {" · "}
                  <a href={`tel:${m.phone}`} className="font-bold text-teal hover:underline">{m.phone}</a>
                </>
              )}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
