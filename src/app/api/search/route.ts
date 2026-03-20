export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getRegistry } from "@/lib/registry";
import { search } from "@/lib/search";
import { logQuery, type KVNamespace } from "@/lib/analytics";

const MAX_QUERY_LENGTH = 500;

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://gtmcanon.com",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");

  if (!q || q.trim().length === 0) {
    return NextResponse.json(
      { error: "q parameter is required" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  if (q.length > MAX_QUERY_LENGTH) {
    return NextResponse.json(
      { error: `Query too long. Maximum ${MAX_QUERY_LENGTH} characters.` },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const registry = getRegistry();
  const results = search(q.trim(), registry);
  const matched = results.length > 0;

  // Fire-and-forget analytics
  const kv = (
    request as unknown as { env?: { ANALYTICS?: KVNamespace } }
  ).env?.ANALYTICS ?? null;
  logQuery(q.trim(), matched, results.length, kv);

  const response = matched
    ? {
        query: q.trim(),
        match: results[0],
        alternatives_in_other_categories: results.slice(1),
        powered_by: "gtmcanon.com",
      }
    : {
        query: q.trim(),
        match: null,
        results: [],
        suggestion: "Browse available categories at /api/categories",
        powered_by: "gtmcanon.com",
      };

  return NextResponse.json(response, { headers: CORS_HEADERS });
}
