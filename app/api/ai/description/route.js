// app/api/ai/description/route.js
"use server";
import { createClient } from "@/lib/supabase/server";

/**
 * Placeholder endpoint for AI‑generated product description.
 * In a real implementation you would call an LLM service (e.g., OpenAI) from a serverless function.
 * This stub returns a static example description.
 */
export async function POST(req) {
  const { productId } = await req.json();
  // Fetch product name for context (optional)
  const supabase = createClient();
  const { data: product } = await supabase
    .from("produk")
    .select("nama")
    .eq("id", productId)
    .single();

  const description = product
    ? `Deskripsi AI untuk ${product.nama}: Produk berkualitas tinggi, cocok untuk kebutuhan Anda.`
    : "Deskripsi produk tidak ditemukan.";

  return new Response(JSON.stringify({ description }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
