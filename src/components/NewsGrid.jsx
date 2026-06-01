"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, FileImage } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function NewsGrid({ latestNews }) {
  const newsRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".news-card", {
        scrollTrigger: {
          trigger: newsRef.current,
          start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, newsRef);

    return () => ctx.revert();
  }, [latestNews]);

  return (
    <section ref={newsRef} className="max-w-7xl mx-auto px-4 md:px-8 mb-24">
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl md:text-4xl font-bold text-ink tracking-tight mb-3">
            Informasi Terbaru
          </h2>
          <p className="text-mute text-lg">Berita dan pengumuman terkini seputar UPT BKN Tarakan.</p>
        </div>
        <Link 
          href="/publikasi/berita"
          className="hidden md:flex items-center gap-2 font-bold text-primary hover:text-primary-pressed transition-colors link-hover"
        >
          Lihat Semua Berita
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>

      {latestNews.length === 0 ? (
        <div className="py-12 text-center text-mute bg-canvas rounded-[2rem] border border-gray-100">
          Belum ada berita yang diterbitkan.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {latestNews.map((news) => (
            <div key={news.id} className="news-card">
              <Link href={`/publikasi/${news.category}/${news.id}`} className="block group h-full">
                <div className="bg-surface-card rounded-[2.5rem] overflow-hidden flex flex-col h-full hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 border border-gray-100/50">
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-gray-100 flex items-center justify-center">
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm ${
                        news.category === 'berita' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        {news.category}
                      </span>
                    </div>
                    {news.image_url ? (
                      <Image 
                        src={news.image_url} 
                        alt={news.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="absolute inset-0 object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    ) : (
                      <FileImage className="w-12 h-12 text-gray-300" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </div>
                  <div className="p-8 md:p-10 flex flex-col flex-1 bg-surface-card relative z-10">
                    <div className="flex items-center gap-2 text-mute mb-4">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {new Date(news.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-ink leading-tight mb-4 group-hover:text-primary transition-colors line-clamp-2">
                      {news.title}
                    </h3>
                    <p className="text-mute text-base leading-relaxed mb-8 flex-1 line-clamp-3">
                      {news.content.substring(0, 150)}...
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-sm font-bold text-primary link-hover uppercase tracking-wider">Baca Selengkapnya</span>
                      <div className="w-12 h-12 rounded-full bg-surface-soft flex items-center justify-center text-ink group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:-rotate-45">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-12 text-center md:hidden">
        <Link 
          href="/publikasi/berita"
          className="inline-flex items-center gap-2 font-bold text-primary px-6 py-3 rounded-full bg-surface-soft hover:bg-surface-card transition-colors btn-magnetic btn-soft-sliding"
        >
          Lihat Semua Berita
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}
