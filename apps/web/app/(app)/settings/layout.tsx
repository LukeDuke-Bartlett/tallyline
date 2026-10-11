import type { ReactNode } from "react";
import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SettingsNav />
      {children}
    </div>
  );
}
