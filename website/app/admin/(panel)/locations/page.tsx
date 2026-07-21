import LocationsEditor from "@/components/admin/LocationsEditor";

export const dynamic = "force-dynamic";

export default function LocationsPage() {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wider text-teal">Global</p>
      <h1 className="mt-1 text-2xl">Locations &amp; branding</h1>
      <p className="mt-2 max-w-2xl text-sm text-brand-body">
        Logo, colors, address, hours, and contact details for each clinic. The color pickers
        re-theme that location&apos;s entire site.
      </p>
      <div className="mt-8">
        <LocationsEditor />
      </div>
    </div>
  );
}
