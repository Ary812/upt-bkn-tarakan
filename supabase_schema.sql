-- ==========================================
-- SKEMA DATABASE (POSTGRESQL) UNTUK UPT BKN TARAKAN
-- Silakan jalankan skrip ini di tab SQL Editor pada dashboard Supabase Anda.
-- ==========================================

-- 1. Buat tabel 'posts' (Untuk Berita & Pengumuman)
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('berita', 'pengumuman')),
  image_url text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'publish')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Buat tabel 'galleries' (Untuk Dokumentasi Galeri)
CREATE TABLE IF NOT EXISTS public.galleries (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  caption text NOT NULL,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Mengatur RLS (Row Level Security) agar aman (Opsional namun sangat disarankan)
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.galleries ENABLE ROW LEVEL SECURITY;

-- 4. Membuat Kebijakan (Policies) Akses Data

-- A. Semua orang (anonim) dapat MELIHAT (Select) postingan yang berstatus 'publish'
CREATE POLICY "Public can view published posts" ON public.posts
  FOR SELECT USING (status = 'publish');

-- B. Semua orang (anonim) dapat MELIHAT (Select) semua galeri
CREATE POLICY "Public can view all galleries" ON public.galleries
  FOR SELECT USING (true);

-- C. (Jika Anda menggunakan Service Role Key di backend Next.js, Anda tidak perlu membuat Policy untuk Insert/Update/Delete karena Service Role Key otomatis mengabaikan RLS).
-- Namun, untuk kemudahan ekstra (opsional) atau jika Anda mengatur integrasi Clerk secara langsung, tambahkan logic authenticated di sini. 
-- Untuk skenario kita (Service Role Key di Next.js Server Actions), kebijakan A dan B sudah cukup untuk Front-End Publik!

-- ==========================================
-- BUCKET STORAGE
-- ==========================================
-- PENTING: Anda juga perlu membuat sebuah Bucket di menu "Storage" Supabase dengan nama: 'public-images'
-- Pastikan pengaturan bucket tersebut diatur menjadi "Public" agar gambar dapat diakses oleh siapa saja.
