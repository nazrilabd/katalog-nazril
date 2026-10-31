// app/api/products/route.js
"use server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/products
 * Supports query params:
 *   - sort: column name (e.g., harga, nama)
 *   - order: asc|desc
 *   - page: number (default 1)
 *   - limit: items per page (default 12)
 */
export async function GET(req) {
  const url = new URL(req.url);
  const sort = url.searchParams.get("sort") || "id";
  const order = url.searchParams.get("order") || "asc";
  const page = parseInt(url.searchParams.get("page") || "1", 10);
  const limit = parseInt(url.searchParams.get("limit") || "12", 10);
  const from = (page - 1) * limit;

  const supabase = createClient();
  const { data, error, count } = await supabase
    .from("produk")
    .select("*", { count: "exact" })
    .order(sort, { ascending: order === "asc" })
    .range(from, from + limit - 1);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(
    JSON.stringify({ data, pagination: { page, limit, total: count } }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
