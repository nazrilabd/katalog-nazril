"use client";

import { useState } from "react";
import { toko } from "@/lib/toko";
import { formatRupiah } from "@/lib/format";

function dapatkanDaftarVarian(produk) {
  if (!produk) return [];

  // 1. Jika ada kolom/properti varian langsung
  if (Array.isArray(produk.varian) && produk.varian.length > 0) {
    return produk.varian;
  }
  if (typeof produk.varian === "string" && produk.varian.trim()) {
    return produk.varian.split(",").map((v) => v.trim()).filter(Boolean);
  }

  // 2. Cek apakah ada di deskripsi produk (misal "Varian: ..." atau "Pilihan: ...")
  if (typeof produk.deskripsi === "string") {
    const cocok = produk.deskripsi.match(/(?:varian|pilihan)\s*:\s*([^.\n\r]+)/i);
    if (cocok && cocok[1]) {
      const daftar = cocok[1].split(/[,/]/).map((v) => v.trim()).filter(Boolean);
      if (daftar.length > 0) return daftar;
    }
  }

  // 3. Fallback varian berdasarkan nama atau kategori produk
  const nama = (produk.nama || "").toLowerCase();
  const kategori = (produk.kategori || "").toLowerCase();

  if (nama.includes("kopi")) {
    return ["Giling Halus", "Giling Sedang", "Biji Utuh"];
  }
  if (nama.includes("keripik") || nama.includes("singkong")) {
    return ["Balado Pedas", "Original Gurih", "Pedas Manis"];
  }
  if (nama.includes("sambal")) {
    return ["Level Sedang", "Level Pedas", "Level Ekstra Pedas"];
  }
  if (nama.includes("nastar") || nama.includes("kue")) {
    return ["Original", "Keju Spesial"];
  }
  if (nama.includes("tas") || nama.includes("anyaman")) {
    return ["Natural", "Cokelat", "Hitam"];
  }
  if (nama.includes("batik") || nama.includes("kain")) {
    return ["Motif Klasik", "Motif Modern"];
  }

  if (kategori === "minuman") {
    return ["Dingin (Es)", "Hangat / Normal"];
  }
  if (kategori === "camilan" || kategori === "makanan") {
    return ["Original", "Pedas"];
  }
  if (kategori === "pakaian" || kategori === "kain") {
    return ["Ukuran M", "Ukuran L", "Ukuran XL"];
  }

  return [];
}

export default function TombolWhatsApp({ produk }) {
  if (!produk) return null;

  const daftarVarian = dapatkanDaftarVarian(produk);
  const [varianDipilih, setVarianDipilih] = useState(daftarVarian[0] || "");
  const [catatan, setCatatan] = useState("");
  const [jumlah, setJumlah] = useState(1);

  const totalHarga = (Number(produk.harga) || 0) * (Number(jumlah) || 1);
  const nomor = toko.nomorWhatsApp ? toko.nomorWhatsApp.replace(/\D/g, "") : "";

  // Format pesan WhatsApp
  let bagianVarian = "";
  let bagianCatatan = "";

  if (daftarVarian.length > 0) {
    bagianVarian = varianDipilih ? ` (Varian: ${varianDipilih})` : "";
    bagianCatatan = catatan.trim() ? ` [Catatan: ${catatan.trim()}]` : "";
  } else {
    bagianVarian = catatan.trim() ? ` (Pilihan/Catatan: ${catatan.trim()})` : "";
  }

  const bagianJumlah = jumlah > 1 ? ` sebanyak ${jumlah} pcs` : ` sebanyak 1 pcs`;
  const bagianTotal = ` dengan total ${formatRupiah(totalHarga)}`;

  const pesan = `Halo, saya ingin memesan ${produk.nama}${bagianVarian}${bagianCatatan}${bagianJumlah}${bagianTotal}. Apakah stok masih tersedia?`;
  const href = `https://wa.me/${nomor}?text=${encodeURIComponent(pesan)}`;

  return (
    <div className="mt-2 flex flex-col gap-5 border-t border-garis pt-5">
      {/* Pilihan Varian */}
      {daftarVarian.length > 0 ? (
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-teks">Pilih Varian:</label>
          <div className="flex flex-wrap gap-2">
            {daftarVarian.map((varian) => {
              const aktif = varianDipilih === varian;
              return (
                <button
                  key={varian}
                  type="button"
                  onClick={() => setVarianDipilih(aktif ? "" : varian)}
                  className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition-all ${
                    aktif
                      ? "bg-utama text-white shadow-sm"
                      : "border border-garis bg-latar text-teks hover:border-utama hover:bg-permukaan"
                  }`}
                >
                  {varian}
                </button>
              );
            })}
          </div>

          <div className="mt-1 flex flex-col gap-1">
            <label htmlFor="catatan-tambahan" className="text-xs text-teks-lembut">
              Catatan atau request khusus (opsional):
            </label>
            <input
              id="catatan-tambahan"
              type="text"
              placeholder="Misal: tingkat manis, kemasan khusus, dll."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
              className="rounded-lg border border-garis bg-latar px-3.5 py-2 text-xs text-teks placeholder:text-teks-lembut/70 focus:border-utama focus:outline-none"
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="catatan-tambahan" className="text-sm font-semibold text-teks">
            Pilihan varian / catatan (opsional):
          </label>
          <input
            id="catatan-tambahan"
            type="text"
            placeholder="Tuliskan varian (misal warna, ukuran, rasa, atau catatan)..."
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="rounded-lg border border-garis bg-latar px-3.5 py-2 text-sm text-teks placeholder:text-teks-lembut focus:border-utama focus:outline-none"
          />
        </div>
      )}

      {/* Pilihan Jumlah */}
      <div className="flex flex-col gap-2">
        <label htmlFor="input-jumlah" className="text-sm font-semibold text-teks">
          Jumlah:
        </label>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-lg border border-garis bg-latar">
            <button
              type="button"
              onClick={() => setJumlah((prev) => Math.max(1, prev - 1))}
              disabled={jumlah <= 1}
              aria-label="Kurangi jumlah"
              className="flex h-10 w-10 items-center justify-center rounded-l-lg text-lg font-bold text-teks transition-colors hover:bg-permukaan disabled:cursor-not-allowed disabled:opacity-30"
            >
              -
            </button>
            <input
              id="input-jumlah"
              type="number"
              min="1"
              value={jumlah}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (isNaN(val) || val < 1) {
                  setJumlah(1);
                } else {
                  setJumlah(val);
                }
              }}
              className="h-10 w-14 border-x border-garis text-center font-bold text-teks focus:outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            />
            <button
              type="button"
              onClick={() => setJumlah((prev) => prev + 1)}
              aria-label="Tambah jumlah"
              className="flex h-10 w-10 items-center justify-center rounded-r-lg text-lg font-bold text-teks transition-colors hover:bg-permukaan"
            >
              +
            </button>
          </div>

          <div className="flex flex-col">
            <span className="text-xs text-teks-lembut">Total:</span>
            <span className="text-lg font-bold text-harga">
              {formatRupiah(totalHarga)}
            </span>
          </div>
        </div>
      </div>

      {/* Tombol Pesan via WhatsApp */}
      <div>
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-utama px-6 py-3.5 font-semibold text-white shadow-sm transition-colors hover:bg-utama-gelap sm:w-auto"
        >
          <svg
            className="h-5 w-5 fill-current"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.41a8.17 8.17 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.42 0-2.82-.37-4.06-1.07l-.29-.16-3.11.82.83-3.03-.19-.31a8.16 8.16 0 0 1-1.26-4.48c0-4.54 3.69-8.25 8.23-8.25m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.15.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1s.9 2.43 1.03 2.6c.13.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.44.53.6.19 1.15.16 1.58.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.12-.22-.19-.47-.32" />
          </svg>
          Pesan via WhatsApp
        </a>
      </div>
    </div>
  );
}
