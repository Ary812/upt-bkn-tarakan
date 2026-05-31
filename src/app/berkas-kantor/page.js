"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { 
  FileText, 
  FileSpreadsheet, 
  FolderOpen, 
  Calendar, 
  ClipboardList, 
  ArrowLeft, 
  ExternalLink,
  Eye,
  Info,
  Layers,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export default function BerkasKantorPage() {
  const pageRef = useRef(null);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const berkasData = [
    {
      id: "surat-resmi",
      title: "Surat Resmi UPT BKN Tarakan",
      description: "Akses folder penyimpanan draf, template, dan berkas surat-menyurat resmi UPT BKN Tarakan.",
      category: "administrasi",
      type: "folder",
      icon: FolderOpen,
      iconColor: "text-blue-500 bg-blue-50",
      tag: "Google Drive Folder",
      href: "https://drive.google.com/drive/folders/1kkdriC8W-wrALDVGbcf_DQk9GJnjtwGu?usp=sharing",
      embedUrl: "https://drive.google.com/embeddedfolderview?id=1kkdriC8W-wrALDVGbcf_DQk9GJnjtwGu#list",
    },
    {
      id: "penomoran-surat",
      title: "Penomoran Surat UPT BKN Tarakan",
      description: "Lembar penomoran surat dinas, nota dinas, dan surat tugas secara terpusat.",
      category: "administrasi",
      type: "sheet",
      icon: FileSpreadsheet,
      iconColor: "text-emerald-500 bg-emerald-50",
      tag: "Google Sheets",
      href: "https://docs.google.com/spreadsheets/d/1RhaLxHFYydV1tfapfaVjCFvx4hgxlc4L8GXVKmYUW68/edit?usp=sharing",
      embedUrl: "https://docs.google.com/spreadsheets/d/1RhaLxHFYydV1tfapfaVjCFvx4hgxlc4L8GXVKmYUW68/preview",
    },
    {
      id: "absen-ppnpn",
      title: "Absen PPNPN & PPPK Paruh Waktu",
      description: "Berkas dan folder kehadiran PPNPN serta Pegawai Pemerintah dengan Perjanjian Kerja (PPPK) Paruh Waktu.",
      category: "kepegawaian",
      type: "folder",
      icon: ClipboardList,
      iconColor: "text-violet-500 bg-violet-50",
      tag: "Google Drive Folder",
      href: "https://drive.google.com/drive/folders/11hTjQAzrP92qSznWjjgJS08uxU9FfAxE?usp=sharing",
      embedUrl: "https://drive.google.com/embeddedfolderview?id=11hTjQAzrP92qSznWjjgJS08uxU9FfAxE#list",
    },
    {
      id: "cuti-ppnpn",
      title: "Cuti PPNPN & PPPK Paruh Waktu",
      description: "Folder pengajuan, persetujuan, dan rekapitulasi cuti PPNPN & PPPK Paruh Waktu.",
      category: "kepegawaian",
      type: "folder",
      icon: FileText,
      iconColor: "text-amber-500 bg-amber-50",
      tag: "Google Drive Folder",
      href: "https://drive.google.com/drive/folders/1RsDzvNw0qbYZJsqyOFjTbXa3QMnJfeBH?usp=sharing",
      embedUrl: "https://drive.google.com/embeddedfolderview?id=1RsDzvNw0qbYZJsqyOFjTbXa3QMnJfeBH#list",
    },
    {
      id: "bmn",
      title: "Barang Milik Negara (BMN)",
      description: "Folder inventarisasi, pencatatan, dan dokumentasi pengelolaan Barang Milik Negara di lingkungan UPT BKN Tarakan.",
      category: "administrasi",
      type: "folder",
      icon: FolderOpen,
      iconColor: "text-rose-500 bg-rose-50",
      tag: "Google Drive Folder",
      href: "https://drive.google.com/drive/folders/1FoowEXVd2pyQ3mJFYrPihb_p-vk_gfd5?usp=sharing",
      embedUrl: "https://drive.google.com/embeddedfolderview?id=1FoowEXVd2pyQ3mJFYrPihb_p-vk_gfd5#list",
    },
    {
      id: "jadwal-ujian",
      title: "Jadwal Ujian Dinas 2026",
      description: "Linimasa lengkap, jadwal pelaksanaan, dan tahapan Ujian Dinas BKN Tahun Anggaran 2026.",
      category: "ujian",
      type: "sheet",
      icon: Calendar,
      iconColor: "text-sky-500 bg-sky-50",
      tag: "Google Sheets",
      href: "https://docs.google.com/spreadsheets/d/1f71RQ7MeN3H8HICgnIf_bCYFcc47X1vaRPidoESuLhM/edit?gid=0#gid=0",
      embedUrl: "https://docs.google.com/spreadsheets/d/1f71RQ7MeN3H8HICgnIf_bCYFcc47X1vaRPidoESuLhM/preview",
    },
    {
      id: "bap-ujian",
      title: "Berita Acara Pelaksanaan Ujian 2026",
      description: "Folder unggahan Berita Acara Pelaksanaan (BAP) dan dokumentasi pendukung Ujian Dinas 2026.",
      category: "ujian",
      type: "folder",
      icon: ClipboardList,
      iconColor: "text-teal-500 bg-teal-50",
      tag: "Google Drive Folder",
      href: "https://drive.google.com/drive/folders/1Kj4pyZf2LAh6LSqANJ4Hk2z1q3_kF_Uk?usp=sharing",
      embedUrl: "https://drive.google.com/embeddedfolderview?id=1Kj4pyZf2LAh6LSqANJ4Hk2z1q3_kF_Uk#list",
    },
  ];

  useEffect(() => {
    document.title = "Berkas Kantor Dashboard - UPT BKN Tarakan";

    let ctx = gsap.context(() => {
      // Entrances for Title & Heading
      gsap.from(".heading-anim", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
      });

      // Stagger animation for boxes
      gsap.from(".berkas-card", {
        y: 40,
        opacity: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
        delay: 0.2,
      });

      // Slide in for preview panel
      gsap.from(".preview-panel-anim", {
        x: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.4,
      });
    }, pageRef);

    return () => ctx.revert();
  }, []);

  const filteredBerkas = berkasData.filter(
    (item) => activeCategory === "all" || item.category === activeCategory
  );

  return (
    <div ref={pageRef} className="min-h-screen bg-canvas pt-12 pb-24 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Back button & Breadcrumb */}
      <div className="mb-8 heading-anim">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-mute hover:text-primary transition-colors link-hover"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Beranda
        </Link>
      </div>

      {/* Header Title Section */}
      <div className="mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-bold uppercase tracking-wider heading-anim">
          <Sparkles className="w-3.5 h-3.5" />
          Dashboard Dokumentasi Internal
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-ink heading-anim leading-tight">
          Berkas Kantor & <br />
          <span className="text-primary">Dokumentasi UPT BKN Tarakan</span>
        </h1>
        <p className="text-mute text-base md:text-lg max-w-2xl leading-relaxed heading-anim">
          Akses cepat berkas surat resmi, rekapitulasi data kepegawaian, absen PPNPN, serta agenda ujian CAT dinas di wilayah kerja UPT BKN Tarakan.
        </p>
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-10 heading-anim">
        {[
          { id: "all", label: "Semua Berkas", count: berkasData.length },
          { id: "administrasi", label: "Administrasi Surat & BMN", count: berkasData.filter(b => b.category === "administrasi").length },
          { id: "kepegawaian", label: "Kepegawaian (PPNPN)", count: berkasData.filter(b => b.category === "kepegawaian").length },
          { id: "ujian", label: "Ujian Dinas 2026", count: berkasData.filter(b => b.category === "ujian").length },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all duration-300 btn-magnetic ${
              activeCategory === cat.id
                ? "bg-primary text-white shadow-md"
                : "bg-surface-card text-mute hover:text-primary hover:bg-surface-soft"
            }`}
          >
            {cat.label} ({cat.count})
          </button>
        ))}
      </div>

      {/* Main Grid: Card list and Preview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Boxes/Cards List */}
        <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-1 gap-6">
          {filteredBerkas.map((berkas) => {
            const IconComponent = berkas.icon;
            const isCurrentlySelected = selectedDoc?.id === berkas.id;

            return (
              <div
                key={berkas.id}
                className={`berkas-card group p-6 rounded-[2rem] border transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[180px] bg-canvas shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] hover:translate-y-[-2px] ${
                  isCurrentlySelected 
                    ? "border-primary bg-primary/[0.01]" 
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div>
                  {/* Card Header: Icon & Category badge */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-[1rem] ${berkas.iconColor} transition-transform duration-300 group-hover:scale-110`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-surface-card text-mute border border-gray-100">
                      {berkas.tag}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-primary transition-colors">
                    {berkas.title}
                  </h3>
                  <p className="text-mute text-xs leading-relaxed mb-6">
                    {berkas.description}
                  </p>
                </div>

                {/* Card Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-gray-100/50">
                  <button
                    onClick={() => setSelectedDoc(berkas)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 btn-magnetic ${
                      isCurrentlySelected
                        ? "bg-primary text-white"
                        : "bg-surface-card text-primary hover:bg-primary hover:text-white"
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    Pratinjau
                  </button>

                  <a
                    href={berkas.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-surface-soft text-mute border border-gray-200/50 hover:bg-gray-100 hover:text-ink transition-colors btn-magnetic ml-auto"
                  >
                    Buka Link
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Side: Document Preview Panel */}
        <div className="lg:col-span-6 lg:sticky lg:top-28 preview-panel-anim">
          <div className="w-full rounded-[2.5rem] bg-surface-card border border-gray-100/50 p-6 md:p-8 min-h-[600px] flex flex-col justify-between relative shadow-[0_10px_40px_rgba(0,0,0,0.03)] overflow-hidden">
            
            {selectedDoc ? (
              <div className="flex-1 flex flex-col h-full">
                
                {/* Active Document Info */}
                <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-200/50">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary bg-primary/5 px-2.5 py-1 rounded-full">
                      Preview Aktif
                    </span>
                    <h2 className="text-xl font-black text-ink mt-1.5 tracking-tight leading-none">
                      {selectedDoc.title}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setSelectedDoc(null)}
                    className="text-xs font-bold text-mute hover:text-accent transition-colors"
                  >
                    Tutup
                  </button>
                </div>

                {/* Document Embed Iframe */}
                <div className="flex-1 min-h-[480px] bg-canvas rounded-[1.5rem] overflow-hidden border border-gray-200/60 relative group shadow-inner">
                  <iframe
                    src={selectedDoc.embedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    className="absolute inset-0 w-full h-full bg-canvas"
                    title={selectedDoc.title}
                    loading="lazy"
                  ></iframe>
                </div>

                {/* Footer note inside preview panel */}
                <div className="mt-4 flex items-start gap-2.5 text-mute text-xs bg-canvas/40 p-3.5 rounded-[1rem] border border-gray-200/30">
                  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Dokumen ini dibagikan secara internal dari <strong>Google Drive / Sheets Resmi UPT BKN Tarakan</strong>. Gunakan tombol "Buka Link" jika membutuhkan navigasi layar penuh atau pengeditan dokumen.
                  </p>
                </div>

              </div>
            ) : (
              // Empty State - No document selected yet
              <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4">
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mb-6 text-primary animate-pulse">
                  <Layers className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-bold text-ink mb-2">Pilih Berkas Kantor</h3>
                <p className="text-mute text-sm max-w-sm leading-relaxed mb-8">
                  Klik tombol <strong>"Pratinjau"</strong> pada salah satu item berkas di samping untuk menampilkan tinjauan isi dokumen secara instan di sini.
                </p>
                <div className="grid grid-cols-2 gap-4 max-w-xs w-full text-left text-xs bg-canvas p-4 rounded-[1.5rem] border border-gray-200/40 shadow-sm">
                  <div>
                    <span className="font-bold text-ink block mb-0.5">Layanan Lancar</span>
                    <span className="text-mute">Akses langsung real-time.</span>
                  </div>
                  <div>
                    <span className="font-bold text-ink block mb-0.5">Responsif</span>
                    <span className="text-mute">Mendukung format mobile.</span>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}
