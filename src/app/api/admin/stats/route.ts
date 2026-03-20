export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getQueryStats, type KVNamespace } from "@/lib/analytics";

async function secureCompare(a: string, b: string): Promise<boolean> {
  const encoder = new TextEncoder();
  const bufA = encoder.encode(a);
  const bufB = encoder.encode(b);
  if (bufA.length !== bufB.length) return false;

  const keyData = crypto.getRandomValues(new Uint8Array(32));
  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const [sigA, sigB] = await Promise.all([
    crypto.subtle.sign("HMAC", key, bufA),
    crypto.subtle.sign("HMAC", key, bufB),
  ]);

  const viewA = new Uint8Array(sigA);
  const viewB = new Uint8Array(sigB);
  let result = 0;
  for (let i = 0; i < viewA.length; i++) {
    result |= viewA[i] ^ viewB[i];
  }
  return result === 0;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const token = process.env.ADMIN_STATS_TOKEN;

  if (
    !token ||
    !authHeader ||
    !(await secureCompare(authHeader, `Bearer ${token}`))
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const kv = (
    request as unknown as { env?: { ANALYTICS?: KVNamespace } }
  ).env?.ANALYTICS ?? null;

  const stats = await getQueryStats(kv);

  return NextResponse.json(stats);
}
