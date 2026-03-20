export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import { getToolById } from "@/lib/registry";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "https://gtmcanon.com",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "id parameter is required. Example: /api/tools?id=send-email" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const result = getToolById(id);

  if (!result) {
    return NextResponse.json(
      {
        error: `Tool "${id}" not found`,
        hint: "Use /api/categories to see available tools, or /api/search?q=... to search",
      },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  const { category, story } = result;

  return NextResponse.json(
    {
      user_story: story.id,
      category: { id: category.id, name: category.name },
      description: story.description,
      recommendation: story.recommendation,
      alternatives: story.alternatives,
      powered_by: "gtmcanon.com",
    },
    { headers: CORS_HEADERS }
  );
}
