"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Newspaper, Megaphone, Image as ImageIcon, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboardPage() {
  const pageRef = useRef(null);
  const [stats, setStats] = useState({
    berita: 0,
    pengumuman: 0,
    galeri: 0
  });

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const { count: countBerita } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('category', 'berita');
        const { count: countPengumuman } = await supabase.from('posts').select('*', { count: 'exact', head: true }).eq('category', 'pengumuman');
        const { count: countGaleri } = await supabase.from('galleries').select('*', { count: 'exact', head: true });
        
        setStats({
          berita: countBerita || 0,
          pengumuman: countPengumuman || 0,
          galeri: countGaleri || 0
        });
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".stat-card", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const statItems = [
    { label: "Total Berita", value: stats.berita, icon: Newspaper, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "Total Pengumuman", value: stats.pengumuman, icon: Megaphone, color: "text-emerald-500", bg: "bg-emerald-50" },
    { label: "Total Galeri", value: stats.galeri, icon: ImageIcon, color: "text-amber-500", bg: "bg-amber-50" },
  ];

  return (
    <div ref={pageRef} className="space-y-8">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider stat-card">
          <Sparkles className="w-4 h-4" />
          Selamat Datang, Admin
        </div>
        <h1 className="text-3xl font-black text-ink tracking-tight stat-card">
          Ringkasan Konten
        </h1>
        <p className="text-mute mt-2 stat-card">
          Kelola berita, pengumuman, dan dokumentasi galeri UPT BKN Tarakan dengan mudah melalui portal ini.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx} 
              className="stat-card bg-canvas rounded-[2rem] p-6 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-start gap-4 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`p-4 rounded-[1.5rem] ${item.bg} ${item.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-sm font-semibold text-mute">{item.label}</p>
                <p className="text-4xl font-black text-ink tracking-tight mt-1">{item.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
