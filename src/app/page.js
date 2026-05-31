"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { ArrowRight, Calendar, FileImage } from "lucide-react";
import { supabase } from "@/lib/supabase";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const heroRef = useRef(null);
  const newsRef = useRef(null);
  
  const [latestNews, setLatestNews] = useState([]);
  const [heroData, setHeroData] = useState({
    title: "Seleksi CASN 2026 Akan Segera Dibuka",
    excerpt: "Persiapkan diri Anda untuk mengikuti Seleksi Calon Aparatur Sipil Negara (CASN) tahun 2026. Pantau terus informasi resmi melalui portal BKN.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
    href: "/publikasi/pengumuman"
  });
  
  useEffect(() => {
    const fetchPublicData = async () => {
      // Fetch latest 6 published berita
      const { data: newsData } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'publish')
        .eq('category', 'berita')
        .order('created_at', { ascending: false })
        .limit(6);
        
      if (newsData) {
        // assign random aspect ratio class to mimic masonry
        const aspects = ["aspect-[4/5]", "aspect-square", "aspect-[3/4]"];
        const formattedNews = newsData.map((item, idx) => ({
          ...item,
          aspect: aspects[idx % aspects.length]
        }));
        setLatestNews(formattedNews);
      }

      // Fetch 1 latest post (berita or pengumuman) for hero
      const { data: heroRes } = await supabase
        .from('posts')
        .select('*')
        .eq('status', 'publish')
        .order('created_at', { ascending: false })
        .limit(1);

      if (heroRes && heroRes.length > 0) {
        setHeroData({
          title: heroRes[0].title,
          excerpt: heroRes[0].content.substring(0, 150) + "...",
          image: heroRes[0].image_url || "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600",
          href: `/publikasi/${heroRes[0].category}/${heroRes[0].id}`,
          category: heroRes[0].category
        });
      }
    };

    fetchPublicData();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // Hero Animation
      gsap.from(".hero-content", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.5,
      });

      // News Cards Animation
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
    });

    return () => ctx.revert();
  }, [latestNews]); // re-run animation when data loads

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section ref={heroRef} className="max-w-7xl mx-auto px-4 md:px-8 mt-8 mb-24">
        <div className="relative w-full min-h-[60vh] md:min-h-[75vh] rounded-[3rem] overflow-hidden group bg-surface-card flex flex-col justify-end p-8 md:p-16">
          <img 
            src={heroData.image} 
            alt={heroData.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface-dark/90 via-surface-dark/40 to-transparent" />
          
          <div className="relative z-10 max-w-3xl">
            <span className="hero-content inline-block px-4 py-1.5 mb-6 rounded-full bg-accent text-white text-sm font-bold tracking-wide shadow-sm uppercase">
              {heroData.category === 'berita' ? 'BERITA UTAMA' : 'PENGUMUMAN UTAMA'}
            </span>
            <h1 className="hero-content text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight mb-6">
              {heroData.title}
            </h1>
            <p className="hero-content text-white/80 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-8">
              {heroData.excerpt}
            </p>
            <Link 
              href={heroData.href}
              className="hero-content inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3.5 rounded-[1.5rem] btn-magnetic btn-primary-sliding shadow-[0_8px_20px_rgba(30,58,138,0.3)] hover:shadow-[0_12px_25px_rgba(30,58,138,0.4)] transition-all"
            >
              Baca Selengkapnya
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* News Grid Section */}
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
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {latestNews.map((news) => (
              <div key={news.id} className="news-card break-inside-avoid">
                <Link href={`/publikasi/${news.category}/${news.id}`} className="block group">
                  <div className="bg-surface-card rounded-[2rem] overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 border border-gray-100/50">
                    <div className={`relative w-full ${news.aspect} overflow-hidden bg-gray-100 flex items-center justify-center`}>
                      {news.image_url ? (
                        <img 
                          src={news.image_url} 
                          alt={news.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <FileImage className="w-12 h-12 text-gray-300" />
                      )}
                    </div>
                    <div className="p-6 md:p-8 flex flex-col flex-1 bg-surface-card relative z-10 group-hover:-translate-y-1 transition-transform duration-300">
                      <div className="flex items-center gap-2 text-mute mb-4">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {new Date(news.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-ink leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-mute text-sm leading-relaxed mb-6 flex-1 line-clamp-3">
                        {news.content.substring(0, 150)}...
                      </p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm font-bold text-primary link-hover">Baca Artikel</span>
                        <div className="w-10 h-10 rounded-full bg-surface-soft flex items-center justify-center text-ink group-hover:bg-primary group-hover:text-white transition-colors">
                          <ArrowRight className="w-4 h-4" />
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
    </div>
  );
}
