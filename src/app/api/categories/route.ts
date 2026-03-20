export const runtime = "edge";

import { NextResponse } from "next/server";
import { getCategories } from "@/lib/registry";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://gtmcanon.com",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET() {
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
    { headers: CORS_HEADERS }
  );
}
