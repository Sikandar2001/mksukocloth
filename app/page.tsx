import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HotCategories from "@/components/HotCategories";

export default function Home() {
  return (
    <main className="w-full bg-white font-lexend">
      {/* Hero Section - Inspired by Snitch */}
      <section className="relative mx-auto max-w-7xl overflow-hidden px-0 sm:px-4 mt-4">
        <div className="relative aspect-[16/9] w-full sm:aspect-[16/7] lg:aspect-[21/9] overflow-hidden rounded-none sm:rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=2000&auto=format&fit=crop"
            alt="SNITCH New Collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
            <h1 className="text-5xl font-black tracking-tighter sm:text-8xl uppercase leading-none">
              STREET <br className="sm:hidden" /> REBEL '26
            </h1>
            <p className="mt-4 text-lg font-bold tracking-widest uppercase opacity-90 sm:text-xl">
              Limited Edition Summer Drop
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
              <Link
                href="/men"
                className="w-full sm:w-auto rounded-full bg-white px-10 py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:scale-105 hover:bg-zinc-100"
              >
                Shop New Arrivals
              </Link>
              <Link
                href="/men"
                className="w-full sm:w-auto rounded-full border-2 border-white px-10 py-4 text-sm font-black uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black"
              >
                Best Sellers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* HOT CATEGORIES - Added based on user request */}
      <HotCategories />

      {/* NEW: Live In Denim Slider Section (Full Width) */}
      <section className="mt-20 w-full font-lexend">
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 sm:aspect-[21/9]">
          <img
            src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop"
            alt="Live In Denim"
            className="h-full w-full object-cover"
          />
          
          {/* Slider Navigation Arrows */}
          <button className="absolute left-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button className="absolute right-6 top-1/2 -translate-y-1/2 flex h-14 w-14 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-all hover:bg-black/60 shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

          {/* Text Overlays matching user image */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-black font-black uppercase tracking-[0.3em] text-sm sm:text-base opacity-60">
            RELAXED
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center">
              <h2 className="text-6xl font-[1000] leading-[0.85] tracking-tighter text-white uppercase sm:text-[160px]">
                LIVE IN <br /> DENIM
              </h2>
              <p className="mt-6 text-base font-black uppercase tracking-[0.25em] text-white/90 sm:text-xl">
                MUST HAVE DENIMS
              </p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 gap-3 items-center">
            <div className="h-2 w-2 rounded-full bg-white/40" />
            <div className="h-2 w-2 rounded-full bg-white/40" />
            <div className="h-2 w-10 rounded-full bg-white shadow-sm" />
            <div className="h-2 w-2 rounded-full bg-white/40" />
          </div>
        </div>
      </section>

      {/* MATCH THE MOOD Section (Replacing Trending Categories) */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <h2 className="text-center text-3xl font-black tracking-tight uppercase sm:text-4xl">MATCH THE MOOD</h2>
        
        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-6">
          {[
            { 
              title: "SUMMER", 
              subtitle: "ESCAPE", 
              img: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop",
              badge: null 
            },
            { 
              title: "WORK", 
              subtitle: "READY", 
              img: "https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=800&auto=format&fit=crop",
              badge: null 
            },
            { 
              title: "LUXURY", 
              subtitle: "REFINED", 
              img: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop",
              badge: "SNITCH LUXE" 
            },
          ].map((mood, idx) => (
            <div key={idx} className="group relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-100 sm:rounded-2xl">
              <img
                src={mood.img}
                alt={mood.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
              
              {mood.badge && (
                <div className="absolute top-2 right-2 sm:top-6 sm:right-6">
                  <span className="rounded-full border border-white/40 bg-white/10 px-2 py-0.5 text-[6px] font-bold tracking-[0.1em] text-white backdrop-blur-md uppercase sm:px-4 sm:py-1.5 sm:text-[10px] sm:tracking-[0.2em]">
                    {mood.badge}
                  </span>
                </div>
              )}

              <div className="absolute bottom-4 left-0 w-full text-center sm:bottom-8">
                <h3 className="text-lg font-black tracking-wider text-white uppercase sm:text-5xl">
                  {mood.title}
                </h3>
                <p className="mt-0.5 text-[8px] font-black tracking-[0.2em] text-orange-400 uppercase sm:mt-1 sm:text-sm sm:tracking-[0.3em]">
                  {mood.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP YOUR SIZE Section (Full Width Banner) */}
      <section className="mt-20 w-full font-lexend">
        <h2 className="mb-8 text-center text-2xl font-black tracking-tight uppercase sm:text-3xl">SHOP YOUR SIZE</h2>
        
        <div className="relative h-[300px] w-full overflow-hidden bg-[#C8D1D8] sm:h-[450px]">
          {/* Background Image - Full Width */}
          <img
            src="https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=2000&auto=format&fit=crop"
            alt="Shop Your Size Banner"
            className="h-full w-full object-cover object-[center_30%]"
          />
          
          {/* Overlay Content - Right Aligned */}
          <div className="absolute inset-0 flex items-center justify-end px-8 sm:px-24">
            <div className="text-right">
              <p className="text-xl font-light tracking-tight text-white/90 sm:text-3xl">
                Last chance!
              </p>
              <h3 className="mt-1 text-3xl font-black uppercase leading-none tracking-tighter text-white sm:mt-4 sm:text-7xl">
                UP TO 30% OFF*
              </h3>
            </div>
          </div>
        </div>
      </section>

      {/* MEN'S COLLECTION Section */}
      <section className="mx-auto mt-20 max-w-7xl px-4 font-lexend">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-[900] tracking-tighter uppercase">MEN'S COLLECTION</h2>
          <Link href="/men" className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1">
            Shop All
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-3 min-w-max">
            {[
              { id: 'all', label: 'ALL', active: true },
              { id: 'shirts', label: 'SHIRTS' },
              { id: 'jeans', label: 'JEANS' },
              { id: 'trousers', label: 'TROUSERS' },
              { id: 'sunglasses', label: 'SUNGLASSES' },
              { id: 't-shirts', label: 'T-SHIRTS' },
              { id: 'jackets', label: 'JACKETS' },
              { id: 'shoes', label: 'SHOES' },
            ].map((cat) => (
              <button
                key={cat.id}
                className={`px-8 py-3 text-sm font-medium tracking-widest border border-black transition-all duration-300 ${
                  cat.active 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { id: "m1", title: "Linen Blend Relaxed Fit Trousers", price: "₹1899", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop", swatches: ["#1D3A6C", "#FDE3D2", "#5C4033"], href: "/product/deck-2.0-high-loose-jeans" },
            { id: "m2", title: "Oversized Graphic Cotton Tee", price: "₹1299", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop", swatches: ["#000000", "#FFFFFF", "#FF0000"], href: "/product/deck-2.0-high-loose-jeans" },
            { id: "m3", title: "Utility Cargo Pants", price: "₹2499", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop", swatches: ["#4B5320", "#000000"], href: "/product/deck-2.0-high-loose-jeans" },
            { id: "m4", title: "Linen Series Casual Shirt", price: "₹1699", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop", swatches: ["#FFFFFF", "#87CEEB", "#F5F5DC"], href: "/product/deck-2.0-high-loose-jeans" },
          ].map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* WOMEN'S COLLECTION Section */}
      <section className="mx-auto mt-24 max-w-7xl px-4 font-lexend">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-[900] tracking-tighter uppercase">WOMEN'S COLLECTION</h2>
          <Link href="/women" className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1">
            Shop All
          </Link>
        </div>

        <div className="mt-8 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-3 min-w-max">
            {[
              { id: 'all', label: 'ALL', active: true },
              { id: 'shirts', label: 'SHIRTS' },
              { id: 'jeans', label: 'JEANS' },
              { id: 'trousers', label: 'TROUSERS' },
              { id: 'sunglasses', label: 'SUNGLASSES' },
              { id: 't-shirts', label: 'T-SHIRTS' },
              { id: 'jackets', label: 'JACKETS' },
              { id: 'shoes', label: 'SHOES' },
            ].map((cat) => (
              <button
                key={cat.id}
                className={`px-8 py-3 text-sm font-medium tracking-widest border border-black transition-all duration-300 ${
                  cat.active 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { id: "w1", title: "Linen Series Summer Dress", price: "₹2499", image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop", swatches: ["#FFFFFF", "#F5F5DC", "#E6E6FA"], href: "/women" },
            { id: "w2", title: "High-Waisted Utility Trousers", price: "₹1999", image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop", swatches: ["#4B5320", "#000000", "#5C4033"], href: "/women" },
            { id: "w3", title: "Oversized Denim Shirt", price: "₹1899", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop", swatches: ["#1D3A6C", "#4A6FA5"], href: "/women" },
            { id: "w4", title: "Graphic Boxy Tee", price: "₹999", image: "https://images.unsplash.com/photo-1503342217505-b0a15cf70449?q=80&w=800&auto=format&fit=crop", swatches: ["#000000", "#FFFFFF"], href: "/women" },
          ].map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Featured Collection Banner */}
      <section className="mx-auto mt-20 max-w-7xl px-4 pb-20">
        <div className="relative h-[500px] w-full overflow-hidden rounded-3xl">
          <img
            src="https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=1600&auto=format&fit=crop"
            alt="Utility Collection"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-6">
            <h3 className="text-4xl font-black tracking-tight uppercase sm:text-6xl">
              Utility <br /> Re-defined
            </h3>
            <p className="mt-4 max-w-md text-lg font-medium opacity-90">
              Modern functional wear for the urban rebel. Durable, stylish, and essential.
            </p>
            <div className="mt-8">
              <Link href="/men" className="rounded-full bg-white px-10 py-4 text-sm font-black uppercase tracking-widest text-black transition-all hover:scale-105">
                Explore Collection
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
