"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const SECTIONS = [
  { href: "/settings/members", label: "Members" },
  { href: "/settings/invites", label: "Invites" },
  { href: "/settings/agents", label: "Agents" },
  { href: "/settings/tokens", label: "Tokens" },
  { href: "/settings/github", label: "GitHub" },
  { href: "/settings/providers", label: "Sign-in" },
];

export function SettingsNav() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Settings sections"
      className="flex shrink-0 gap-1 overflow-x-auto border-b border-lining-faint px-3 py-1.5"
    >
      {SECTIONS.map((s) => {
        const active = pathname === s.href;
        return (
          <Link
            key={s.href}
            href={s.href}
            aria-current={active ? "page" : undefined}
            className={`flex h-7 shrink-0 items-center rounded-sm border px-2.5 text-[13px] ${
              active
                ? "border-lining bg-surface-2 text-ink"
                : "border-transparent text-ink-subtle hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {s.label}
          </Link>
        );
      })}
    </nav>
  );
}
