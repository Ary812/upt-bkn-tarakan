"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ExternalLink, Menu, X, Building2 } from "lucide-react";
import { SignInButton, SignUpButton, Show, UserButton } from "@clerk/nextjs";

export default function Header() {
  const pathname = usePathname();
  const headerRef = useRef(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  if (pathname.startsWith("/admin") || pathname.startsWith("/login")) {
    return null;
  }

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".header-inner-anim", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
      // Stagger nav links
      gsap.from(".nav-link-anim", {
        y: -20,
        opacity: 0,
        duration: 0.8,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.5
      });
    }, headerRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (mobileMenuOpen) return;
      
      const currentScrollY = window.scrollY;
      
      // Treshold: Only start hiding after scrolling past 80px
      if (currentScrollY > 80) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down -> hide header
          setIsVisible(false);
        } else {
          // Scrolling up -> show header
          setIsVisible(true);
        }
      } else {
        // Near top -> always show
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY, mobileMenuOpen]);

  const navItems = [
    { label: "BERANDA", href: "/" },
    {
      label: "PROFIL",
      dropdown: [
        { label: "Sejarah", href: "/profil/sejarah" },
        { label: "Kedudukan, Tugas dan Fungsi", href: "/profil/kedudukan" },
        { label: "Struktur Organisasi", href: "/profil/struktur" },
        { label: "Maklumat Pelayanan", href: "/profil/maklumat" },
        { label: "Layanan", href: "/profil/layanan" },
      ],
    },
    {
      label: "PUBLIKASI",
      dropdown: [
        { label: "Berita", href: "/publikasi/berita" },
        { label: "Pengumuman", href: "/publikasi/pengumuman" },
        { label: "Galeri", href: "/publikasi/galeri" },
      ],
    },
    {
      label: "HUBUNGI KAMI",
      dropdown: [
        { label: "Lapor", href: "https://www.lapor.go.id/", external: true },
        { label: "Helpdesk", href: "https://helpdesk-sscasn.bkn.go.id/", external: true },
        { label: "Whistleblower BKN", href: "https://wbs.bkn.go.id/", external: true },
      ],
    },
    {
      label: "BERKAS KANTOR",
      href: "/berkas-kantor",
    },
  ];

  return (
    <header
      ref={headerRef}
      className={`fixed top-0 left-0 w-full z-50 px-4 md:px-8 pt-4 pb-0 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] transform ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
      }`}
    >
      <div className="header-inner-anim max-w-7xl mx-auto bg-canvas rounded-[3rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] pointer-events-auto border border-gray-100/50">
        <div className="flex items-center justify-between px-6 md:px-8 py-5">
          {/* Logo - Enlarged and easily replaceable */}
          <Link href="/" className="flex items-center gap-4 group link-hover">
            {/* Ganti src="/logo-instansi.png" dengan path logo yang sesungguhnya di folder /public */}
            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-primary flex flex-shrink-0 items-center justify-center text-white overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300">
              <img 
                src="https://ui-avatars.com/api/?name=BKN&background=1e3a8a&color=fff&size=128&bold=true" 
                alt="Logo UPT BKN" 
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextElementSibling.style.display = 'block'; }}
              />
              <Building2 className="w-8 h-8 hidden" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-primary tracking-tight leading-none text-xl md:text-2xl">
                UPT BKN
              </span>
              <span className="font-semibold text-accent tracking-tight leading-none text-base md:text-lg">
                TARAKAN
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-2">
            {navItems.map((item, idx) => (
              <div key={idx} className="relative group/navItem nav-link-anim">
                {item.dropdown ? (
                  <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold text-ink-soft bg-transparent hover:text-primary transition-colors btn-magnetic btn-soft-sliding rounded-full">
                    {item.label}
                    <ChevronDown className="w-4 h-4 opacity-50 group-hover/navItem:rotate-180 transition-transform duration-300" />
                  </button>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-semibold text-ink-soft bg-transparent hover:text-primary transition-colors btn-magnetic btn-soft-sliding rounded-full"
                  >
                    {item.label}
                  </Link>
                )}

                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-56 bg-canvas rounded-[1.5rem] p-2 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100/50 opacity-0 translate-y-4 pointer-events-none group-hover/navItem:opacity-100 group-hover/navItem:translate-y-0 group-hover/navItem:pointer-events-auto transition-all duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                  {item.dropdown?.map((dropItem, dropIdx) => (
                    <Link
                      key={dropIdx}
                      href={dropItem.href}
                      target={dropItem.external ? "_blank" : undefined}
                      rel={dropItem.external ? "noopener noreferrer" : undefined}
                      className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-mute hover:text-primary hover:bg-surface-soft rounded-[1rem] transition-colors link-hover"
                    >
                      <span className="truncate">{dropItem.label}</span>
                      {dropItem.external && <ExternalLink className="w-3.5 h-3.5 opacity-50 flex-shrink-0" />}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
              <Show when="signed-out">
                <div className="flex items-center gap-2">
                  <SignInButton mode="modal">
                    <button className="px-4 py-2 text-sm font-semibold text-ink-soft bg-transparent hover:text-primary transition-colors btn-magnetic btn-soft-sliding rounded-full">Sign In</button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors btn-magnetic rounded-full">Sign Up</button>
                  </SignUpButton>
                </div>
              </Show>
              <Show when="signed-in">
                <UserButton afterSignOutUrl="/" />
              </Show>
            </div>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="lg:hidden p-2 text-ink rounded-full hover:bg-surface-soft transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 p-4 pb-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Auth for Mobile */}
            <div className="flex items-center gap-4 py-2 px-2 border-b border-gray-100 mb-4">
              <Show when="signed-out">
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-sm font-semibold text-ink-soft bg-transparent hover:text-primary transition-colors rounded-full border border-gray-200">Sign In</button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-4 py-2 text-sm font-semibold bg-primary text-white hover:bg-primary-dark transition-colors rounded-full">Sign Up</button>
                </SignUpButton>
              </Show>
              <Show when="signed-in">
                <UserButton afterSignOutUrl="/" />
              </Show>
            </div>
            {navItems.map((item, idx) => (
              <div key={idx} className="space-y-2">
                {item.dropdown ? (
                  <>
                    <div className="font-bold text-ink-soft text-sm px-2 uppercase tracking-wide">
                      {item.label}
                    </div>
                    <div className="grid grid-cols-1 gap-1 pl-2">
                      {item.dropdown.map((dropItem, dropIdx) => (
                        <Link
                          key={dropIdx}
                          href={dropItem.href}
                          target={dropItem.external ? "_blank" : undefined}
                          rel={dropItem.external ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-2 px-3 py-2 text-sm text-mute hover:text-primary hover:bg-surface-soft rounded-xl transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {dropItem.label}
                          {dropItem.external && <ExternalLink className="w-3 h-3 opacity-50" />}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block font-bold text-ink-soft text-sm px-2 uppercase tracking-wide py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
