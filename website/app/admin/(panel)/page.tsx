import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BLOCK_SCHEMAS, COLLECTION_SCHEMAS } from "@/lib/cms-schemas";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [{ count: unread }, { count: total }] = await Promise.all([
    supabase.from("messages").select("*", { count: "exact", head: true }).eq("read", false),
    supabase.from("messages").select("*", { count: "exact", head: true }),
  ]);

  return (
    <div>
      <h1 className="text-2xl">Dashboard</h1>
      <p className="mt-2 text-sm text-brand-body">
        Everything on the website is editable from here. Changes go live immediately.
      </p>

      <Link
        href="/admin/messages"
        className="card mt-8 flex max-w-md items-center justify-between border border-gray-100 p-6 transition-transform hover:-translate-y-0.5"
      >
        <div>
          <h2 className="text-lg">Messages</h2>
          <p className="text-sm text-brand-body">{total ?? 0} total submissions</p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-bold text-white ${unread ? "bg-brand-red" : "bg-teal"}`}>
          {unread ?? 0} new
        </span>
      </Link>

      <h2 className="mt-10 text-lg">Content collections</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COLLECTION_SCHEMAS.map((c) => (
          <Link
            key={c.table}
            href={`/admin/collections/${c.table}`}
            className="card border border-gray-100 p-5 text-sm font-bold transition-transform hover:-translate-y-0.5"
          >
            {c.label}
          </Link>
        ))}
      </div>

      <h2 className="mt-10 text-lg">Page sections</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BLOCK_SCHEMAS.map((b) => (
          <Link
            key={b.key}
            href={`/admin/sections/${b.key}`}
            className="card border border-gray-100 p-5 transition-transform hover:-translate-y-0.5"
          >
            <span className="block text-xs font-bold uppercase tracking-wider text-teal">{b.group}</span>
            <span className="mt-1 block text-sm font-bold">{b.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
