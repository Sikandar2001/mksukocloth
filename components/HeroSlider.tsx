"use client";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop",
    title: "STREET REBEL '26",
    subtitle: "Limited Edition Summer Drop",
    cta1: "SHOP NEW ARRIVALS",
    cta1Link: "/men",
    cta2: "BEST SELLERS",
    cta2Link: "/women",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop",
    title: "URBAN ELEGANCE",
    subtitle: "Sophisticated Minimalist Style",
    cta1: "EXPLORE WOMEN",
    cta1Link: "/women",
    cta2: "VIEW ALL",
    cta2Link: "/women",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2000&auto=format&fit=crop",
    title: "LUXURY ESSENTIALS",
    subtitle: "Premium Quality Every Day",
    cta1: "SHOP MEN",
    cta1Link: "/men",
    cta2: "NEW DROPS",
    cta2Link: "/men",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1539109132314-3477524c8945?q=80&w=2000&auto=format&fit=crop",
    title: "MODERN CLASSIC",
    subtitle: "Timeless Pieces for You",
    cta1: "BROWSE COLLECTIONS",
    cta1Link: "/men",
    cta2: "ABOUT US",
    cta2Link: "/profile",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  return (
    <section className="relative mx-auto max-w-7xl overflow-hidden px-0 sm:px-4 mt-4">
      <div className="relative aspect-[16/9] w-full sm:aspect-[16/7] lg:aspect-[21/9] overflow-hidden rounded-none sm:rounded-3xl">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
              <h1 className="text-4xl font-black tracking-tighter sm:text-7xl lg:text-8xl uppercase leading-none animate-reveal">
                {slide.title.split(" ").map((word, i) => (
                  <span key={i}>
                    {word} {i === 0 && slide.title.split(" ").length > 1 && <br className="sm:hidden" />}
                  </span>
                ))}
              </h1>
              <p className="mt-4 text-sm font-bold tracking-widest uppercase opacity-90 sm:text-lg lg:text-xl animate-reveal" style={{ animationDelay: '0.2s' }}>
                {slide.subtitle}
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:gap-6 animate-reveal" style={{ animationDelay: '0.4s' }}>
                <Link
                  href={slide.cta1Link}
                  className="w-48 rounded-full bg-white px-8 py-4 text-xs font-black tracking-widest text-black transition-all hover:bg-black hover:text-white sm:w-auto"
                >
                  {slide.cta1}
                </Link>
                <Link
                  href={slide.cta2Link}
                  className="w-48 rounded-full border-2 border-white px-8 py-3.5 text-xs font-black tracking-widest text-white backdrop-blur-sm transition-all hover:bg-white hover:text-black sm:w-auto"
                >
                  {slide.cta2}
                </Link>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-all hover:bg-white/20 sm:left-8"
          aria-label="Previous slide"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white backdrop-blur-md transition-all hover:bg-white/20 sm:right-8"
          aria-label="Next slide"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Indicators */}
        <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                index === currentSlide ? "w-8 bg-white" : "w-2 bg-white/40"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
