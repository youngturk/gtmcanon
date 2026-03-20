export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getCategories } from "@/lib/registry";
import { corsHeaders } from "@/lib/cors";

export async function OPTIONS(request: NextRequest) {
  const headers = corsHeaders(request.headers.get("origin"));
  return new NextResponse(null, { status: 204, headers });
}

export async function GET(request: NextRequest) {
  const headers = corsHeaders(request.headers.get("origin"));
  const categories = getCategories();

  const summary = categories.map((c) => ({
    id: c.id,
    name: c.name,
    description: c.description,
    tool_count: c.user_stories.length,
    user_stories: c.user_stories.map((s) => ({
      id: s.id,
      description: s.description,
      recommended_tool: s.recommendation.tool,
    })),
  }));

  return NextResponse.json(
    { categories: summary, powered_by: "gtmcanon.com" },
    { headers }
  );
}
