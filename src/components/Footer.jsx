"use client";

import { MapPin, Link as LinkIcon, Mail, Phone } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  
  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  return (
    <footer className="w-full bg-surface-card pt-10 pb-6 px-6 border-t border-hairline mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-6 mb-8">
          
          {/* Brand & Address */}
          <div className="lg:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3 group link-hover">
            <div className="w-12 h-12 flex flex-shrink-0 items-center justify-center overflow-hidden group-hover:scale-105 transition-transform duration-300 relative">
              <Image 
                src="/logo-bkn.png" 
                alt="Logo UPT BKN" 
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
              <div className="flex flex-col">
                <span className="font-bold text-primary tracking-tight leading-none text-xl">
                  UPT BKN
                </span>
                <span className="font-semibold text-accent tracking-tight leading-none text-base mt-0.5">
                  TARAKAN
                </span>
              </div>
            </Link>
            <p className="text-mute text-xs max-w-sm leading-relaxed">
              Unit Penyelenggara Seleksi Calon dan Penilaian Kompetensi Pegawai Aparatur Sipil Negara di wilayah Tarakan, Kalimantan Utara.
            </p>
            <div className="flex items-start gap-2 text-mute">
              <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
              <p className="text-xs leading-relaxed">
                Komp. Perkantoran Dinas Kesehatan, Jl. Kusuma Bangsa (depan Rusunawa), 
                Kel. Pamusian, Kec. Tarakan Tengah, 
                Kota Tarakan, Kalimantan Utara.
              </p>
            </div>
          </div>

          {/* Map Embed */}
          <div className="lg:col-span-4 rounded-[1.5rem] overflow-hidden shadow-sm h-[160px] relative bg-stone/20">
            {/* Real map embed for the address using Google Maps iframe */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3980.528414451034!2d117.6099578!3d3.2995362!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x32138b9cf9ff0bfb%3A0x3844e0eb63d21403!2sUPT%20BKN%20Tarakan!5e0!3m2!1sid!2sid!4v1717000000000!5m2!1sid!2sid"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 w-full h-full"
              title="Lokasi UPT BKN Tarakan"
            ></iframe>
          </div>

          {/* Socials & Links */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h3 className="font-bold text-ink text-sm mb-3">Sosial Media</h3>
              <div className="space-y-2.5">
                <a href="https://www.instagram.com/uptbkntarakan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-mute hover:text-primary transition-colors group">
                  <div className="w-7 h-7 rounded-full bg-canvas flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                  </div>
                  <span className="text-xs font-medium">@uptbkntarakan</span>
                </a>
                <a href="https://web.facebook.com/BKNtarakan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-mute hover:text-primary transition-colors group">
                  <div className="w-7 h-7 rounded-full bg-canvas flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                  </div>
                  <span className="text-xs font-medium">BKNtarakan</span>
                </a>
                <a href="https://www.tiktok.com/@bkntarakan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-mute hover:text-primary transition-colors group">
                  <div className="w-7 h-7 rounded-full bg-canvas flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  </div>
                  <span className="text-xs font-medium">@bkntarakan</span>
                </a>
                <a href="https://www.youtube.com/@uptbkntarakan" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-mute hover:text-primary transition-colors group">
                  <div className="w-7 h-7 rounded-full bg-canvas flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform flex-shrink-0">
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="var(--canvas, #ffffff)"/></svg>
                  </div>
                  <span className="text-xs font-medium">@uptbkntarakan</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-hairline flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-mute font-medium">
          <p>&copy; {new Date().getFullYear()} UPT BKN Tarakan. Hak Cipta Dilindungi.</p>
          <div className="flex gap-4">
            <Link href="/profil/maklumat" className="hover:text-ink transition-colors">Maklumat Pelayanan</Link>
            <a href="https://www.lapor.go.id/" target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">Lapor</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
