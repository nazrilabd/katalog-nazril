import NavAdmin from "@/components/NavAdmin";
import TabelProduk from "@/components/TabelProduk";
import Tombol from "@/components/Tombol";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function HalamanAdmin() {
  const supabase = await createAdminClient();
  let { data: daftarProduk, error } = await supabase
    .from("produk")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    const { createClient } = await import("@/lib/supabase/server");
    const serverSupabase = createClient();
    const res = await serverSupabase
      .from("produk")
      .select("*")
      .order("id", { ascending: true });

    if (!res.error) {
      daftarProduk = res.data;
      error = null;
    }
  }

  const produk = daftarProduk || [];

  return (
    <div className="flex flex-col gap-6 py-8">
      <NavAdmin />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold">Produk</h1>
        {/* US-08 (bonus): tambah produk */}
        <Tombol href="/admin/produk/baru">Tambah produk</Tombol>
      </div>

      {error ? (
        <p className="rounded-lg border border-bahaya bg-permukaan px-4 py-3 text-sm text-bahaya">
          Gagal memuat produk: {error.message}
        </p>
      ) : produk.length === 0 ? (
        <p className="py-8 text-teks-lembut">Belum ada produk</p>
      ) : (
        <TabelProduk daftarProduk={produk} />
      )}
    </div>
  );
}
