import { supabase } from "@/lib/supabase";
import DOMPurify from "isomorphic-dompurify";

export const revalidate = 0;

export default async function KedudukanTugasFungsiPage() {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('category', 'tugas_fungsi')
    .eq('status', 'publish')
    .single();

  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      <div className="relative max-w-5xl mx-auto px-4 md:px-8 py-12 lg:py-20 animate-in fade-in duration-500">
        <div className="bg-canvas/80 backdrop-blur-xl rounded-[3rem] p-6 md:p-12 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

          <h1 className="text-3xl md:text-5xl font-black text-ink mb-10 md:mb-16 text-center relative z-10 leading-tight">
            {data?.title || 'Kedudukan, Tugas dan Fungsi'}
          </h1>
          
          {data ? (
            <div 
              className="prose prose-lg md:prose-xl max-w-none prose-img:rounded-3xl prose-img:shadow-md prose-headings:text-ink prose-p:text-mute prose-a:text-primary hover:prose-a:text-primary-pressed transition-all relative z-10"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.content) }}
            />
        ) : (
          <div className="flex flex-col items-center justify-center text-center py-12 relative z-10">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="text-3xl">📝</span>
            </div>
            <p className="text-mute max-w-lg leading-relaxed">
              Konten Kedudukan, Tugas dan Fungsi belum tersedia.
            </p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
