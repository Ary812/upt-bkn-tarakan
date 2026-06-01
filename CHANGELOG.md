# Changelog

Semua perubahan, penambahan fitur, dan perbaikan terkait proyek website UPT BKN Tarakan akan didokumentasikan pada file ini.

Format pencatatan mengacu pada standar [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased] - 2026-05-31

### Ditambahkan (Added)
- Halaman detail dinamis untuk membaca berita dan pengumuman secara penuh (`/publikasi/[category]/[id]`).
- Integrasi Git (`git init` dan *initial commit*) untuk melacak versi (*version control*).
- Konfigurasi editor `.vscode/settings.json` untuk menghilangkan *warning* linter `Unknown at rule @tailwind` di `globals.css`.
- File log riwayat perubahan (`CHANGELOG.md`).
- Arsitektur **Server-Side Rendering (SSR)** pada halaman utama (`page.js`), halaman Berita, dan halaman Pengumuman.
- Konfigurasi `next.config.mjs` untuk mengizinkan optimasi gambar dari *domain* Supabase dan Unsplash.
- Komponen `RichTextEditor` berbasis `react-quill` dengan fitur unggah gambar khusus (*custom handler*) langsung ke Supabase Storage.
- Halaman panel admin baru untuk grup "Profil & Layanan" (Sejarah, Tugas & Fungsi, Struktur Organisasi, Maklumat Pelayanan, Layanan) dengan logika satu data tunggal (`SingleContentEditor`).
- Migrasi secara menyeluruh dari `react-quill` ke `suneditor-react` sebagai mesin utama Text Editor untuk stabilitas yang lebih baik. Fitur bawaan seperti Spasi Baris (*Line Height*), perataan teks/gambar, dan pengubahan ukuran *font* kini berfungsi secara *native*.
- Penambahan tautan media sosial YouTube pada *Footer*.

### Diubah (Changed)
- Peningkatan tampilan halaman publikasi dan profil (Opsi Layout A) dengan kontainer lebih lebar (`max-w-5xl`), ukuran *font* lebih besar (`prose-xl`), dan penambahan elemen estetika *background grid noise* agar ruang kosong terlihat padat dan elegan.
- Injeksi gaya spesifik Quill (*alignment*, *size*) ke dalam `globals.css` sehingga hasil tulisan *RichTextEditor* terender persis sama antara tampilan admin dan publik.
- Logika *Hero Section* Beranda kini mengambil post terbaru apa pun (baik itu berita maupun pengumuman) dan menampilkan label (BERITA UTAMA / PENGUMUMAN UTAMA) secara dinamis.
- Desain tata letak *Footer* diperkecil menjadi lebih padat, ringkas, dan proporsional tanpa mengorbankan keterbacaan (penurunan ukuran *font*, modifikasi rasio kolom, dan tinggi sematan peta).
- Tautan "Baca Selengkapnya" pada Beranda, halaman Berita, dan halaman Pengumuman kini mengarah ke halaman baca secara spesifik.
- Seluruh tag gambar standar (`<img>`) pada Header, Footer, Beranda, Publikasi, dan Halaman Detail diganti menjadi `<Image>` bawaan Next.js untuk kompresi WebP otomatis, *lazy-loading*, dan peningkatan skor performa.
- Modifikasi tinggi Header dan batas *margin* kontainer utama (`pt-32`) agar proporsi menu melayang tidak lagi saling tumpang tindih (*overlap*) dengan isi halaman.
- Halaman Manajemen Berita dan Pengumuman di Admin kini menggunakan `RichTextEditor` alih-alih teks biasa.
- Halaman-halaman publik Profil dan Layanan kini me-render data berformat HTML secara langsung dari database menggunakan *plugin* `@tailwindcss/typography`.
- Menu navigasi *sidebar* admin dirombak dengan pengelompokan yang lebih rapi (Manajemen Konten & Profil/Layanan).

### Diperbaiki (Fixed)
- Solusi *Error* "new row violates row-level security": Mekanisme unggah gambar diubah dari sisi klien menjadi *Server Actions* (`uploadImageAction`) menggunakan *Service Role Key* Supabase.
- Status draf yang sebelumnya hilang kini muncul di Dashboard Admin, dengan bantuan *Server Actions* khusus (`getAdminPosts` dan `getAdminGalleries`) untuk membay-pass kebijakan data publik (RLS).
- Membersihkan baris komentar pada *environment variables* (`.env.local`) yang merusak sintaks parsing kunci API.
