"use client";

export default function ChatOpenButton({ label = "Chat with us" }: { label?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("crescent:open-chat"))}
      className="inline-flex items-center gap-2 rounded-full border border-white/70 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-white/10"
    >
      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 3C6.98 3 3 6.58 3 11c0 2.05.86 3.92 2.29 5.36-.1 1.2-.5 2.32-1.15 3.28a.5.5 0 0 0 .5.77 7.9 7.9 0 0 0 3.86-1.6c1.1.38 2.28.59 3.5.59 5.02 0 9-3.58 9-8s-3.98-8-9-8Z" />
      </svg>
      {label}
    </button>
  );
}
