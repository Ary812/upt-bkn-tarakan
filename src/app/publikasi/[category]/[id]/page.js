import { supabase } from "@/lib/supabase";
import { Calendar, ArrowLeft, FileImage } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PublikasiDetailPage({ params }) {
  const { category, id } = params;

  // Validate category
  if (category !== "berita" && category !== "pengumuman") {
    notFound();
  }

  // Fetch the specific post
  const { data: post, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("category", category)
    .eq("status", "publish")
    .single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="w-full bg-surface-soft min-h-screen pt-8 pb-24">
      {/* Header with back button */}
      <div className="max-w-4xl mx-auto px-4 md:px-8 mb-8">
        <Link 
          href={`/publikasi/${category}`}
          className="inline-flex items-center gap-2 text-mute hover:text-primary transition-colors font-medium text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke daftar {category}
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="bg-canvas rounded-[3rem] shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Post Header */}
          <div className="p-8 md:p-12 lg:p-16 pb-0">
            <div className="flex flex-wrap items-center gap-4 mb-6">
              <span className="inline-flex px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wide">
                {category}
              </span>
              <div className="flex items-center gap-2 text-mute">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-ink leading-tight tracking-tight mb-12">
              {post.title}
            </h1>
          </div>

          {/* Hero Image */}
          <div className="w-full aspect-[21/9] bg-gray-100 relative">
            {post.image_url ? (
              <img 
                src={post.image_url} 
                alt={post.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-300">
                <FileImage className="w-16 h-16 mb-2 opacity-50" />
                <span className="text-sm font-medium">Tidak ada gambar</span>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="p-8 md:p-12 lg:p-16">
            <div className="prose prose-lg md:prose-xl prose-stone max-w-none text-ink-soft leading-relaxed whitespace-pre-wrap">
              {post.content}
            </div>
          </div>
          
        </div>
      </article>
    </div>
  );
}
