import { notFound } from "next/navigation";
import NavAdmin from "@/components/NavAdmin";
import FormUbahProduk from "./FormUbahProduk";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

// US-09: ubah produk
export default async function HalamanUbahProduk({ params }) {
  const { id } = await params;
  const supabase = await createAdminClient();
  let { data: produk, error } = await supabase
    .from("produk")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !produk) {
    const { createClient } = await import("@/lib/supabase/server");
    const serverSupabase = createClient();
    const res = await serverSupabase
      .from("produk")
      .select("*")
      .eq("id", id)
      .single();

    if (!res.error && res.data) {
      produk = res.data;
      error = null;
    }
  }

  if (error || !produk) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <h1 className="text-2xl font-extrabold">Ubah produk</h1>
      <FormUbahProduk produk={produk} />
    </div>
  );
}
