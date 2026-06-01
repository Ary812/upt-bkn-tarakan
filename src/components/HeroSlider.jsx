"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import gsap from "gsap";

export default function HeroSlider({ slides }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // Auto transition every 4s
  useEffect(() => {
    if (!slides || slides.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides]);

  // Initial Entrance Animation
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".hero-content", {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.5,
      });
    }, sliderRef);

    return () => ctx.revert();
  }, []);

  if (!slides || slides.length === 0) return null;

  return (
    <section ref={sliderRef} className="max-w-7xl mx-auto px-4 md:px-8 mt-8 mb-24">
      <div className="relative w-full min-h-[60vh] md:min-h-[75vh] rounded-[3rem] overflow-hidden group bg-surface-dark flex flex-col justify-end p-8 md:p-16">
        
        {/* Background Images with opacity transition */}
        {slides.map((slide, idx) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentSlide ? "opacity-100 z-0" : "opacity-0 -z-10"
            }`}
          >
            <Image 
              src={slide.image} 
              alt={slide.title}
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority={idx === 0} // LCP Optimization: only prioritize the first slide
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
            />
          </div>
        ))}
        
        {/* Heavy Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />
        
        {/* Content Area */}
        <div className="relative z-20 max-w-3xl">
          {slides.map((slide, idx) => (
            <div 
              key={`content-${slide.id}`}
              className={`transition-all duration-700 absolute bottom-0 left-0 w-full ${
                idx === currentSlide ? "opacity-100 translate-y-0 relative" : "opacity-0 translate-y-8 absolute pointer-events-none"
              }`}
            >
              <span className="hero-content inline-block px-4 py-1.5 mb-6 rounded-full bg-accent text-white text-sm font-bold tracking-wide shadow-sm uppercase">
                {slide.category === 'berita' ? 'BERITA UTAMA' : 'PENGUMUMAN UTAMA'}
              </span>
              <h1 className="hero-content text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.15] tracking-tight mb-6 drop-shadow-md">
                {slide.title}
              </h1>
              <p className="hero-content text-white/90 text-lg md:text-xl font-medium max-w-2xl leading-relaxed mb-8 drop-shadow-sm">
                {slide.excerpt}
              </p>
              <Link 
                href={slide.href}
                className="hero-content inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3.5 rounded-[1.5rem] btn-magnetic btn-primary-sliding shadow-[0_8px_20px_rgba(30,58,138,0.3)] hover:shadow-[0_12px_25px_rgba(30,58,138,0.4)] transition-all"
              >
                Baca Selengkapnya
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-6 right-8 z-20 flex gap-3">
          {slides.map((_, idx) => (
            <button
              key={`indicator-${idx}`}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
