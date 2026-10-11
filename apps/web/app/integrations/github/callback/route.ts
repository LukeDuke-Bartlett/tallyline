import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_URL, SESSION_COOKIE } from "@/lib/api";
import { WORKSPACE_COOKIE } from "@/lib/session";
import { upstreamFetch } from "@/lib/upstream";

// GitHub's "Setup URL" for the App (PLAN-006). After an install GitHub sends
// the browser here with ?installation_id=&setup_action=. The session cookie
// lives on the web host, not the API host, so the bind is forwarded
// server-side; the API verifies the installation belongs to this App before
// binding. The browser always ends on Settings > GitHub with a result code.
function back(req: Request, result: string, code?: number) {
  const q = new URLSearchParams({ github: result });
  if (code) q.set("code", String(code));
  return NextResponse.redirect(new URL(`/settings/github?${q}`, req.url));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  // org member asked an owner to approve the install — nothing to bind yet
  if (url.searchParams.get("setup_action") === "request") {
    return back(req, "requested");
  }
  const raw = url.searchParams.get("installation_id") ?? "";
  if (!/^\d{1,15}$/.test(raw)) return back(req, "error", 400);

  const jar = await cookies();
  const session = jar.get(SESSION_COOKIE)?.value;
  const ws = jar.get(WORKSPACE_COOKIE)?.value;
  if (!session || !ws) return NextResponse.redirect(new URL("/login", req.url));

  let status: number;
  try {
    const upstream = await upstreamFetch(
      `${API_URL}/v1/workspaces/${encodeURIComponent(ws)}/github/setup?installation_id=${raw}`,
      { headers: { cookie: `${SESSION_COOKIE}=${session}` }, cache: "no-store" },
    );
    status = upstream.status;
  } catch {
    status = 502;
  }
  return status >= 200 && status < 300
    ? back(req, "connected")
    : back(req, "error", status);
}
