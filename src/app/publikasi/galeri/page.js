"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Image as ImageIcon } from "lucide-react";

export default function GaleriPage() {
  const [galleries, setGalleries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      const { data } = await supabase
        .from('galleries')
        .select('*')
        .order('created_at', { ascending: false });
      
      setGalleries(data || []);
      setIsLoading(false);
    };

    fetchGalleries();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 animate-in fade-in duration-500">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-ink tracking-tight mb-4">
          Galeri Kegiatan
        </h1>
        <p className="text-xl text-mute max-w-2xl">
          Dokumentasi foto kegiatan dan momen penting di lingkungan UPT BKN Tarakan.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : galleries.length === 0 ? (
        <div className="bg-surface-card rounded-[3rem] p-8 md:p-16 min-h-[40vh] flex flex-col items-center justify-center text-center shadow-sm">
          <h2 className="text-2xl font-bold text-ink mb-2">Belum ada foto galeri</h2>
          <p className="text-mute">Dokumentasi kegiatan yang diunggah akan tampil di sini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleries.map(item => (
            <div key={item.id} className="bg-surface-card rounded-[2rem] overflow-hidden group hover:shadow-lg transition-shadow duration-300 border border-gray-100/50">
              <div className="aspect-[4/3] relative bg-gray-100 flex items-center justify-center overflow-hidden">
                {item.image_url ? (
                  <img 
                    src={item.image_url} 
                    alt={item.caption}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-300" />
                )}
                
                {/* Overlay on hover for caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <p className="text-white font-medium text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {item.caption}
                  </p>
                  <p className="text-white/70 text-xs mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                    {new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
