import { supabase } from "@/lib/supabase";
import { Calendar, ArrowLeft, FileImage, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import ViewCounter from "@/components/ViewCounter";
import { sanitizeContent } from "@/lib/sanitize";

export default async function PublikasiDetailPage({ params }) {
  const { category, id } = await params;
  const { userId } = await auth();
  const isAdmin = !!userId;

  // Validate category
  if (category !== "berita" && category !== "pengumuman") {
    notFound();
  }

  // Fetch the specific post
  let query = supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("category", category);
    
  // If not admin, only allow published posts
  if (!isAdmin) {
    query = query.eq("status", "publish");
  }

  const { data: post, error } = await query.single();

  if (error || !post) {
    notFound();
  }

  return (
    <div className="w-full bg-surface-soft min-h-screen pt-8 pb-24 relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* View Counter (Silent) - Only tracks non-admins on published posts */}
      {!isAdmin && post.status === 'publish' && <ViewCounter postId={post.id} />}

      {/* Draft Warning Badge for Admins */}
      {post.status === 'draft' && (
        <div className="bg-amber-100 text-amber-800 px-4 py-2 flex items-center justify-center gap-2 font-medium text-sm sticky top-0 z-50 shadow-sm border-b border-amber-200">
          <EyeOff className="w-4 h-4" />
          Ini adalah mode Preview. Artikel ini masih berstatus DRAFT dan belum bisa dilihat publik.
        </div>
      )}

      {/* Header with back button */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 mb-8 mt-8 relative z-10">
        <Link 
          href={`/publikasi/${category}`}
          className="inline-flex items-center gap-2 text-mute hover:text-primary transition-colors font-medium text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke daftar {category}
        </Link>
      </div>

      <article className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
        <div className="bg-canvas/80 backdrop-blur-xl rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

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
          <div className="w-full relative bg-surface-dark/5 flex items-center justify-center min-h-[40vh] max-h-[75vh] overflow-hidden">
            {post.image_url ? (
              <div className="relative w-full h-[60vh] max-h-[75vh]">
                <Image 
                  src={post.image_url} 
                  alt={post.title}
                  fill
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  className="object-contain"
                  priority
                />
              </div>
            ) : (
              <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center text-gray-300">
                <FileImage className="w-16 h-16 mb-2 opacity-50" />
                <span className="text-sm font-medium">Tidak ada gambar</span>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div className="p-8 md:p-12 lg:p-16 pt-12">
            <div 
              className="sun-editor-editable transition-all"
              dangerouslySetInnerHTML={{ __html: sanitizeContent(post.content) }}
            />
          </div>
          
        </div>
      </article>
    </div>
  );
}
