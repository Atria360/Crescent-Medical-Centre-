import type { BlockData } from "@/lib/content";
import { s } from "@/lib/content";
import type { Location } from "@/lib/locations";

export default function TopBar({ settings, location }: { settings: BlockData; location: Location }) {
  return (
    <div className="border-b border-gray-100 bg-white text-[13px] text-brand-dark">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2">
        <div className="flex items-center gap-6">
          <a href="tel:911" className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4 text-brand-red" />
            {s(settings, "topbar_left_1", "Emergency Call 911")}
          </a>
          <a href="tel:811" className="hidden items-center gap-2 sm:flex">
            <PhoneIcon className="h-4 w-4 text-brand-red" />
            {s(settings, "topbar_left_2", "Medical Advice Call 811")}
          </a>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden items-center gap-2 md:flex">
            <PinIcon className="h-4 w-4 text-brand-dark" />
            {location.address}
          </span>
          {location.phone ? (
            <a href={`tel:${location.phone}`} className="flex items-center gap-2 font-semibold">
              <PhoneIcon className="h-4 w-4 text-brand-dark" />
              {location.phone}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24 11.36 11.36 0 0 0 3.57.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.57 1 1 0 0 1-.25 1.02Z" />
    </svg>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
    </svg>
  );
}
