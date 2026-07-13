"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BLOCK_SCHEMAS, COLLECTION_SCHEMAS } from "@/lib/cms-schemas";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  const groups = ["Global", "Home", "About", "Pages"] as const;

  const linkCls = (href: string) =>
    `block rounded-lg px-3 py-2 text-sm transition-colors ${
      pathname === href
        ? "bg-teal text-white font-bold"
        : "text-gray-300 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="flex min-h-screen bg-brand-light">
      <aside className="hidden w-72 shrink-0 flex-col bg-brand-dark px-4 py-6 lg:flex">
        <Link href="/admin" className="px-3 text-lg font-bold text-white">
          Crescent CMS
        </Link>
        <nav className="mt-6 flex-1 space-y-6 overflow-y-auto pb-6">
          <div>
            <Link href="/admin" className={linkCls("/admin")}>Dashboard</Link>
            <Link href="/admin/messages" className={linkCls("/admin/messages")}>
              Messages (Inbox)
            </Link>
          </div>

          <div>
            <p className="px-3 pb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              Collections
            </p>
            {COLLECTION_SCHEMAS.map((c) => (
              <Link key={c.table} href={`/admin/collections/${c.table}`} className={linkCls(`/admin/collections/${c.table}`)}>
                {c.label}
              </Link>
            ))}
          </div>

          {groups.map((g) => (
            <div key={g}>
              <p className="px-3 pb-2 text-xs font-bold uppercase tracking-widest text-gray-500">
                {g} sections
              </p>
              {BLOCK_SCHEMAS.filter((b) => b.group === g).map((b) => (
                <Link key={b.key} href={`/admin/sections/${b.key}`} className={linkCls(`/admin/sections/${b.key}`)}>
                  {b.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div className="space-y-2 border-t border-white/10 pt-4">
          <a href="/" target="_blank" className="block px-3 text-sm text-gray-300 hover:text-white">
            View site ↗
          </a>
          <button onClick={signOut} className="block w-full px-3 text-left text-sm text-gray-300 hover:text-white">
            Sign out
          </button>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3 lg:hidden">
          <Link href="/admin" className="font-bold">Crescent CMS</Link>
          <div className="flex gap-4 text-sm">
            <a href="/" target="_blank" className="text-teal">View site</a>
            <button onClick={signOut} className="text-brand-red">Sign out</button>
          </div>
        </div>
        <div className="p-6 lg:p-10">{children}</div>
      </div>
    </div>
  );
}
