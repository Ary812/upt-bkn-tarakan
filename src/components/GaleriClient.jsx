"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Maximize2 } from "lucide-react";
import dynamic from "next/dynamic";

const LightboxModal = dynamic(() => import("@/components/LightboxModal"), { ssr: false });

export default function GaleriClient({ galleries }) {
  const [index, setIndex] = useState(-1);

  // Parse photos for lightbox
  const slides = galleries.map((item) => ({
    src: item.image_url,
    alt: item.caption,
    description: item.caption,
    title: new Date(item.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })
  }));

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

      {galleries.length === 0 ? (
        <div className="bg-surface-card rounded-[3rem] p-8 md:p-16 min-h-[40vh] flex flex-col items-center justify-center text-center shadow-sm">
          <h2 className="text-2xl font-bold text-ink mb-2">Belum ada foto galeri</h2>
          <p className="text-mute">Dokumentasi kegiatan yang diunggah akan tampil di sini.</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {galleries.map((item, idx) => (
            <div 
              key={item.id} 
              className="bg-surface-card rounded-[2rem] overflow-hidden group hover:shadow-xl transition-shadow duration-300 border border-gray-100/50 break-inside-avoid relative cursor-pointer"
              onClick={() => setIndex(idx)}
            >
              <div className="relative bg-gray-100 flex items-center justify-center overflow-hidden">
                {item.image_url ? (
                  // We don't know the exact aspect ratio dynamically without reading the image metadata,
                  // so we use standard object-cover with a predefined height or let the container dictate.
                  // For masonry, we typically need actual img tags or predefined heights. Let's use standard img for masonry reflow,
                  // or Next Image with layout responsive if we had sizes. Since it's masonry, standard img is often easier to let it flow naturally.
                  <img 
                    src={item.image_url} 
                    alt={item.caption}
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-square flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-gray-300" />
                  </div>
                )}
                
                {/* Overlay on hover for caption */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md rounded-full p-2 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 delay-100 translate-y-2 group-hover:translate-y-0">
                    <Maximize2 className="w-5 h-5" />
                  </div>
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

      {/* Lightbox Modal */}
      {index >= 0 && (
        <LightboxModal
          open={index >= 0}
          close={() => setIndex(-1)}
          index={index}
          slides={slides}
        />
      )}
    </div>
  );
}
