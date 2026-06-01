-- Jalankan perintah SQL ini di SQL Editor pada Supabase Dashboard Anda.

-- 1. Tambahkan kolom 'views' jika belum ada
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 2. Buat fungsi (RPC) untuk mempermudah penambahan views tanpa harus update langsung dari sisi klien (mencegah manipulasi user)
-- CATATAN: Karena fungsi ini menggunakan SECURITY INVOKER, pastikan ada Policy UPDATE untuk kolom 'views'
-- CREATE POLICY "Anyone can increment views" ON public.posts FOR UPDATE USING (status = 'publish') WITH CHECK (status = 'publish');

CREATE OR REPLACE FUNCTION increment_post_views(p_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE public.posts
  SET views = views + 1
  WHERE id = p_id AND status = 'publish';
END;
$$ LANGUAGE plpgsql SECURITY INVOKER;
