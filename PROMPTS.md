# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.**

**File yang dibuat & diubah

1. [lib/supabase/server.js](file:///c:/Users/POLARINDO/katalog-nazril/lib/supabase/server.js) *(baru)*
   - Membuat fungsi `createClient()` untuk koneksi Supabase di sisi server menggunakan `SUPABASE_URL` dan `SUPABASE_SECRET_KEY` dari environment variable.
   - Dilengkapi normalisasi URL (membersihkan trailing `/rest/v1` jika ada) dan mematikan persistensi sesi auth (`persistSession: false`) karena menggunakan secret key.
2. [lib/supabase/index.js](file:///c:/Users/POLARINDO/katalog-nazril/lib/supabase/index.js) *(baru)*
   - Re-export `createClient` dari `server.js` untuk kemudahan import dari `@/lib/supabase`.
3. [app/page.jsx](file:///c:/Users/POLARINDO/katalog-nazril/app/page.jsx)
   - Mengambil daftar produk dari tabel `produk` di Supabase langsung di sisi server (`async Server Component`).
   - Menampilkan produk dengan komponen [`KartuProduk`](file:///c:/Users/POLARINDO/katalog-nazril/components/KartuProduk.jsx).
   - Menampilkan pesan error jika query gagal atau konfigurasi env belum sesuai.
   - Menampilkan teks `"Belum ada produk"` jika tabel kosong.
   - Menghapus komponen `CatatanBelumAktif`.
4. [.env.local](file:///c:/Users/POLARINDO/katalog-nazril/.env.local)
   - Merapikan nilai `SUPABASE_URL` dari `https://.../rest/v1/` menjadi base URL `https://...supabase.co`.
**

**Perbaikan:**

## US-02 Detail produk

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-04 Login admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**

**Hasil:**

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**

**Hasil:**

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
