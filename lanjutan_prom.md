Bertindaklah sebagai Senior Full-Stack Engineer. Implementasikan modul aplikasi e-commerce secara menyeluruh berdasarkan spesifikasi User Story (US-13 s.d. US-50) dan Keamanan Lanjutan (K-6 s.d. K-13) berikut dalam arsitektur yang bersih, modular, dan siap produksi.

### 1. Cakupan Fitur & User Story (US-13 s.d. US-50)
- **Frontend & PWA (US-13 - US-28):**
  - US-13 PWA (manifest, service worker)
  - US-14 Generasi deskripsi produk berbasis AI
  - US-15 Urutkan produk & US-16 Paginasi/load more
  - US-17 Produk terkait, US-18 Galeri foto, US-19 Status stok, US-20 Harga coret & badge
  - US-21 Keranjang belanja + checkout pesan via WhatsApp
  - US-22 Halaman Tentang & Kontak, US-23 Bagikan/salin link produk
  - US-24 Favorit tersimpan di LocalStorage browser, US-25 Mode gelap (Dark mode)
  - US-26 Metadata SEO & Open Graph, US-27 sitemap.xml & robots.txt, US-28 Halaman 404 & loading state kustom

- **Backend, Storage & Admin (US-29 - US-35):**
  - US-29 Integration upload foto ke Supabase Storage
  - US-30 Dashboard ringkasan admin
  - US-31 Kelola kategori, US-32 Aktif/nonaktifkan produk, US-33 Cari & paginasi list admin
  - US-34 Validasi form admin di server-side, US-35 Ekspor produk ke CSV

- **Fitur Interaktif & Analitik Admin (US-36 - US-43):**
  - US-36 Histori produk terakhir dilihat, US-37 Bandingkan 2 produk side-by-side
  - US-38 Ulasan & rating produk + US-39 Moderasi ulasan di panel admin
  - US-40 Log/catat klik pesan WhatsApp untuk analitik
  - US-41 Produk terlaris di dashboard, US-42 Banner promo beranda, US-43 Pengaturan toko dari admin

- **Manajemen Tingkat Lanjut & AI (US-44 - US-50):**
  - US-44 Kelola akun admin, US-45 Log aktivitas admin, US-46 Impor produk dari CSV
  - US-47 Atur urutan tampil produk, US-48 Varian harga per ukuran
  - US-49 Halaman dinamis per kategori, US-50 Asisten AI tanya jawab produk (RAG/Chatbot)

### 2. Standar Keamanan Lanjutan (K-6 s.d. K-13)
- K-6 Header keamanan live & K-11 Content-Security-Policy (CSP) ketat
- K-7 Bebas dari dangerouslySetInnerHTML dan eval berbahaya
- K-8 Rute `/admin` diblokir dari indeks mesin pencari (noindex)
- K-9 Error handling aman tanpa bocor stack trace ke client
- K-10 Dependensi bersih dari kerentanan kritis
- K-12 Rate limiting pada form login & entri data
- K-13 Sanitasi log tanpa mencatat data sensitif di console.log

### 3. Instruksi Output
Berikan implementasi terstruktur meliputi skema database/PostgreSQL, struktur folder, handler/API endpoints, serta komponen UI utama yang siap dijalankan secara end-to-end.