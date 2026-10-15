# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.**

**tulisan masih data contoh hilang dan data dari website mengambil data dari database**

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
   - Merapikan nilai `SUPABASE_URL` dari `https://.../rest/v1/` menjadi base URL `https://...supabase.co`.**

## US-02 Detail produk

**Prompt: Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.**

**Hasil: ketika mengklik salah satu produk maka akan tampil halaman detail produk**

**Perbaikan: Rangkuman Perubahan

Koneksi Supabase Server (lib/supabase/server.js & lib/supabase/index.js)

Dibuat fungsi createClient() yang mengambil SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable.
Dilengkapi normalisasi URL (membersihkan path /rest/v1 jika ada) dan pengaturan persistSession: false.

Halaman Katalog (app/page.jsx)

Berjalan di sisi server (async Server Component) dengan export const dynamic = "force-dynamic".
Mengambil data dari tabel "produk" via query Supabase (.from("produk").select("*").order("id", { ascending: true })).
Merender setiap item menggunakan komponen KartuProduk tanpa mengubah tampilannya.
Jika query gagal, menampilkan pesan error yang jelas dengan gaya token desain bahaya.
Jika tabel produk kosong, menampilkan teks "Belum ada produk".
Komponen CatatanBelumAktif telah dihapus.**

## US-03 Pesan via WhatsApp

**Prompt: Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.**

**Hasil: tombol di halaman detail: WhatsApp Web (atau aplikasi WhatsApp) terbuka ke nomor tokomu, dengan pesan sudah terisi, misalnya "Halo, saya mau pesan Kopi Bubuk Robusta 250 g (Rp 45.000)**

**Perbaikan: File yang diubah

components/TombolWhatsApp.jsx

Mengubah elemen tombol menjadi tautan (<a>) menuju https://wa.me/<nomor>?text=<pesan>.
Mengambil nomor WhatsApp toko dari lib/toko.js.
Menyusun pesan otomatis yang mencantumkan nama dan harga produk dalam format rupiah menggunakan formatRupiah.
Meng-encode pesan dengan encodeURIComponent.
Menambahkan atribut target="_blank" dan rel="noopener noreferrer" agar terbuka di tab baru.
Mempertahankan kelas Tailwind bawaan agar tampilan tombol tidak berubah.

app/produk/[id]/page.jsx
**

## US-04 Login admin

**Prompt: Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.**

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
