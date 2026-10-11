import { api, type Me } from "@/lib/api";
import { GithubPanel, type GithubNotice } from "@/components/settings/github-panel";
import { PageHeader } from "@/components/settings/ui";

function noticeFrom(sp: Record<string, string | string[] | undefined>): GithubNotice {
  const g = typeof sp.github === "string" ? sp.github : "";
  if (g === "connected") return { kind: "connected" };
  if (g === "requested") return { kind: "requested" };
  if (g === "error") {
    const code = Number(typeof sp.code === "string" ? sp.code : "");
    return { kind: "error", code: Number.isInteger(code) ? code : 0 };
  }
  return null;
}

export default async function GithubSettingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const me = await api<Me>("/v1/auth/me");
  if (!me.data) return <main className="p-8 text-sm text-ink-subtle">Not signed in.</main>;
  const role = me.data.memberships.find(
    (m) => m.workspaceSlug === me.data!.workspaceSlug,
  )?.role;
  return (
    <main className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <PageHeader title="GitHub" meta={me.data.workspaceSlug} />
      <GithubPanel
        canAdmin={role === "owner" || role === "admin"}
        notice={noticeFrom(await searchParams)}
      />
    </main>
  );
}
