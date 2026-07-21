import AdminShell from "@/components/admin/AdminShell";
import { LocationProvider } from "@/components/admin/LocationContext";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <LocationProvider>
      <AdminShell>{children}</AdminShell>
    </LocationProvider>
  );
}
