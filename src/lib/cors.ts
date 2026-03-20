const ALLOWED_ORIGINS = [
  "https://gtmcanon.com",
  "https://www.gtmcanon.com",
];

export function corsHeaders(origin?: string | null): Record<string, string> {
  const allowed =
    origin && ALLOWED_ORIGINS.includes(origin)
      ? origin
      : ALLOWED_ORIGINS[0];

  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}
