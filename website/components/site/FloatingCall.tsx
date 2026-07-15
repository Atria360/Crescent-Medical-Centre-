export default function FloatingCall({ phone }: { phone: string }) {
  if (!phone) return null;
  return (
    <a
      href={`tel:${phone}`}
      aria-label={`Call now: ${phone}`}
      className="group fixed bottom-5 left-5 z-50 flex items-center gap-0 rounded-full bg-brand-red text-white shadow-xl transition-all duration-300 hover:bg-brand-reddark hover:pr-5"
    >
      <span className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-red opacity-40" />
        <svg className="relative h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02Z" />
        </svg>
      </span>
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-bold transition-all duration-300 group-hover:max-w-[160px]">
        Call {phone}
      </span>
    </a>
  );
}
