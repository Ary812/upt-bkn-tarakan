"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Calendar, ArrowRight, FileImage } from "lucide-react";
import Link from "next/link";

export default function PengumumanPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPengumuman = async () => {
      const { data } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'publish')
        .eq('category', 'pengumuman')
        .order('created_at', { ascending: false });
      
      setPosts(data || []);
      setIsLoading(false);
    };

    fetchPengumuman();
  }, []);

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

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="bg-surface-card rounded-[3rem] p-8 md:p-16 min-h-[40vh] flex flex-col items-center justify-center text-center shadow-sm">
          <h2 className="text-2xl font-bold text-ink mb-2">Belum ada pengumuman</h2>
          <p className="text-mute">Pengumuman yang diterbitkan akan tampil di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <Link key={post.id} href={`/publikasi/pengumuman/${post.id}`} className="block group">
              <div className="bg-surface-card rounded-[2rem] overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 border border-gray-100/50 h-full">
                <div className="aspect-[4/3] relative bg-gray-100 flex items-center justify-center">
                  {post.image_url ? (
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <FileImage className="w-12 h-12 text-gray-300" />
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col flex-1 relative z-10 group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="flex items-center gap-2 text-mute mb-4">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-medium">
                      {new Date(post.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-ink leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-mute text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                    {post.content}
                  </p>
                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-bold text-primary link-hover">Baca Selengkapnya</span>
                    <div className="w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center text-ink group-hover:bg-primary group-hover:text-white transition-colors">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
