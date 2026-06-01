"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { 
  LayoutDashboard, 
  Newspaper, 
  Megaphone, 
  Image as ImageIcon, 
  Menu,
  X,
  LogOut,
  Building2,
  BookOpen,
  Briefcase,
  Users,
  ShieldCheck,
  HeartHandshake
} from "lucide-react";
import { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Berita", href: "/admin/berita", icon: Newspaper },
    { name: "Pengumuman", href: "/admin/pengumuman", icon: Megaphone },
    { name: "Galeri", href: "/admin/galeri", icon: ImageIcon },
  ];

  const profileItems = [
    { name: "Sejarah", href: "/admin/profil/sejarah", icon: BookOpen },
    { name: "Tugas & Fungsi", href: "/admin/profil/tugas-fungsi", icon: Briefcase },
    { name: "Struktur Organisasi", href: "/admin/profil/struktur-organisasi", icon: Users },
    { name: "Maklumat Pelayanan", href: "/admin/profil/maklumat", icon: ShieldCheck },
    { name: "Layanan", href: "/admin/layanan", icon: HeartHandshake },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-bold text-ink leading-tight">Admin Portal</h2>
            <p className="text-xs text-mute">UPT BKN Tarakan</p>
          </div>
        </div>
        <button 
          className="lg:hidden p-2 text-mute hover:bg-surface-soft rounded-lg transition-colors"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-bold text-mute uppercase tracking-wider mb-4 mt-2">
          Manajemen Konten
        </p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? "bg-primary text-white font-semibold shadow-md shadow-primary/20" 
                  : "text-mute hover:bg-surface-soft hover:text-ink font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              {item.name}
            </Link>
          );
        })}

        <p className="px-4 text-xs font-bold text-mute uppercase tracking-wider mb-4 mt-6">
          Profil & Layanan
        </p>
        {profileItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                isActive 
                  ? "bg-primary text-white font-semibold shadow-md shadow-primary/20" 
                  : "text-mute hover:bg-surface-soft hover:text-ink font-medium"
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? "scale-110" : "group-hover:scale-110"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <Link
          href="/"
          target="_blank"
          className="flex items-center justify-center gap-2 w-full py-2.5 mb-2 text-sm font-semibold text-primary bg-primary/5 hover:bg-primary/10 rounded-xl transition-colors btn-magnetic"
        >
          Lihat Website Publik
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface-soft flex font-sans">
      <Toaster position="top-right" richColors />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 flex-col bg-canvas border-r border-gray-100 shadow-sm fixed inset-y-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-ink/20 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          <aside className="relative w-72 max-w-[80%] flex flex-col bg-canvas h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen lg:pl-72 transition-all duration-300">
        {/* Topbar */}
        <header className="sticky top-0 z-10 bg-canvas/80 backdrop-blur-md border-b border-gray-100 px-4 md:px-8 h-16 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 text-ink hover:bg-surface-soft rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="font-bold text-lg text-ink hidden sm:block">
              {[...navItems, ...profileItems].find(item => item.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {isLoaded && user && (
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-mute hidden md:block">
                  {user.primaryEmailAddress?.emailAddress}
                </span>
                <UserButton 
                  afterSignOutUrl="/login"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9 border-2 border-primary/20",
                    }
                  }}
                />
              </div>
            )}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
