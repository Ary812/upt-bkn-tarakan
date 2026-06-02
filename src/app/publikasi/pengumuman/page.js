import { supabase } from "@/lib/supabase";
import InfiniteScrollPosts from "@/components/InfiniteScrollPosts";

export const revalidate = 60; // ISR

export default async function PengumumanPage() {
  let posts = [];
  try {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('status', 'publish')
      .eq('category', 'pengumuman')
      .order('created_at', { ascending: false })
      .range(0, 8);
    
    posts = data || [];
  } catch (error) {
    console.error("Error fetching pengumuman:", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight mb-4">
          Pengumuman Resmi
        </h1>
        <p className="text-xl text-mute max-w-2xl">
          Informasi penting dan pengumuman resmi dari UPT BKN Tarakan untuk masyarakat dan ASN.
        </p>
      </div>

      {posts.length === 0 ? (
        <div className="bg-surface-card rounded-[3rem] p-8 md:p-16 min-h-[40vh] flex flex-col items-center justify-center text-center shadow-sm">
          <h2 className="text-2xl font-bold text-ink mb-2">Belum ada pengumuman</h2>
          <p className="text-mute">Pengumuman yang diterbitkan akan tampil di sini.</p>
        </div>
      ) : (
        <InfiniteScrollPosts initialPosts={posts} category="pengumuman" />
      )}
    </div>
  );
}
