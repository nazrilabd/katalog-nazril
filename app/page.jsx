import Link from "next/link";
import KartuProduk from "@/components/KartuProduk";
import Tombol from "@/components/Tombol";
import { toko } from "@/lib/toko";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HalamanKatalog({ searchParams }) {
  const sp = await searchParams;
  const q = typeof sp?.q === "string" ? sp.q.trim() : "";
  const kategori = typeof sp?.kategori === "string" ? sp.kategori.trim() : "";

  let daftarProduk = null;
  let daftarKategori = [];
  let pesanError = null;

  try {
    const supabase = createClient();

    // Ambil daftar kategori unik dari semua produk di database
    const { data: dataKategori, error: errorKategori } = await supabase
      .from("produk")
      .select("kategori");

    if (!errorKategori && dataKategori) {
      daftarKategori = Array.from(
        new Set(
          dataKategori
            .map((p) => p.kategori?.trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));
    }

    // Query produk dengan filter kategori dan pencarian
    let query = supabase.from("produk").select("*");

    if (kategori) {
      query = query.ilike("kategori", kategori);
    }

    if (q) {
      const escapedQ = q.replace(/[%_]/g, "\\$&");
      query = query.ilike("nama", `%${escapedQ}%`);
    }

    const { data, error } = await query.order("id", { ascending: true });

    if (error) {
      pesanError = `Gagal memuat produk: ${error.message}`;
    } else {
      daftarProduk = data;
    }
  } catch (err) {
    pesanError = `Gagal memuat produk: ${err.message || "Terjadi kesalahan pada server."}`;
  }

  const isFiltering = Boolean(q || kategori);

  return (
    <>
      <section className="py-10 sm:py-14">
        <h1 className="max-w-2xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          {toko.nama}
        </h1>
        <p className="mt-3 max-w-xl text-lg text-teks-lembut">{toko.tagline}</p>
        <p className="mt-4 text-sm text-teks-lembut">{toko.jamBuka}</p>
      </section>

      <section aria-labelledby="judul-produk" className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 id="judul-produk" className="text-xl font-bold">
              Produk kami
            </h2>
            {isFiltering && daftarProduk && (
              <span className="text-xs text-teks-lembut">
                {daftarProduk.length} produk ditemukan
              </span>
            )}
          </div>

          {/* Form Pencarian */}
          <form method="GET" action="/" className="flex gap-2">
            {kategori && <input type="hidden" name="kategori" value={kategori} />}
            <input
              type="search"
              name="q"
              defaultValue={q}
              placeholder="Cari nama produk..."
              className="w-full flex-1 rounded-lg border border-garis bg-latar px-3.5 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
            />
            <Tombol type="submit" varian="utama" className="shrink-0 px-4 py-2 text-sm">
              Cari
            </Tombol>
            {isFiltering && (
              <Tombol href="/" varian="garis" className="shrink-0 px-3 py-2 text-sm">
                Reset
              </Tombol>
            )}
          </form>

          {/* Filter Kategori */}
          {daftarKategori.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Link
                href={q ? `/?q=${encodeURIComponent(q)}` : "/"}
                className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  !kategori
                    ? "bg-utama text-white"
                    : "bg-permukaan text-teks hover:bg-garis"
                }`}
              >
                Semua
              </Link>
              {daftarKategori.map((kat) => {
                const isActive = kategori.toLowerCase() === kat.toLowerCase();
                const queryObj = new URLSearchParams();
                if (q) queryObj.set("q", q);
                if (!isActive) queryObj.set("kategori", kat);
                const queryStr = queryObj.toString();
                const href = queryStr ? `/?${queryStr}` : "/";

                return (
                  <Link
                    key={kat}
                    href={href}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      isActive
                        ? "bg-utama text-white"
                        : "bg-permukaan text-teks hover:bg-garis"
                    }`}
                  >
                    {kat}
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {pesanError ? (
          <p className="rounded-lg border border-bahaya bg-permukaan px-4 py-3 text-sm text-bahaya">
            {pesanError}
          </p>
        ) : daftarProduk && daftarProduk.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {daftarProduk.map((produk) => (
              <KartuProduk key={produk.id} produk={produk} />
            ))}
          </div>
        ) : isFiltering ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-garis bg-permukaan/50 py-12 text-center">
            <p className="text-sm text-teks-lembut">
              Tidak ada produk yang cocok dengan{" "}
              {q && (
                <>
                  pencarian <span className="font-semibold text-teks">"{q}"</span>
                </>
              )}
              {q && kategori && " dan "}
              {kategori && (
                <>
                  kategori <span className="font-semibold text-teks">"{kategori}"</span>
                </>
              )}
              .
            </p>
            <Tombol href="/" varian="garis" className="text-xs">
              Hapus semua filter
            </Tombol>
          </div>
        ) : (
          <p className="py-8 text-teks-lembut">Belum ada produk</p>
        )}
      </section>
    </>
  );
}
