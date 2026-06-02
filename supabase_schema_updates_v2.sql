-- Migrasi SQL untuk Fase 2
-- Tambahkan kolom updated_at pada tabel posts dan galleries
-- Serta trigger otomatis untuk update kolom tersebut

-- 1. Tambah kolom jika belum ada
ALTER TABLE public.posts 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

ALTER TABLE public.galleries 
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 2. Buat fungsi trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Hapus trigger jika sudah ada (mencegah error duplikasi jika di-run ulang)
DROP TRIGGER IF EXISTS posts_updated_at ON public.posts;
DROP TRIGGER IF EXISTS galleries_updated_at ON public.galleries;

-- 4. Pasang trigger ke tabel
CREATE TRIGGER posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER galleries_updated_at
  BEFORE UPDATE ON public.galleries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Selesai
