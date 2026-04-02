import Link from "next/link";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  return (
    <main className="w-full bg-white">
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

      {/* Categories Grid */}
      <section className="mx-auto mt-16 max-w-7xl px-4">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-black tracking-tight uppercase">Trending Categories</h2>
          <Link href="/men" className="text-sm font-bold uppercase tracking-widest underline decoration-2 underline-offset-4">
            View All
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "CO-ORDS", href: "/men?category=coords", img: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200&auto=format&fit=crop" },
            { label: "OVERSIZED TEES", href: "/men?category=oversized", img: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=1200&auto=format&fit=crop" },
            { label: "SHIRTS", href: "/men?category=shirts", img: "https://images.unsplash.com/photo-1598033129183-c4f50c717658?q=80&w=1200&auto=format&fit=crop" },
            { label: "JOGGERS", href: "/men?category=joggers", img: "https://images.unsplash.com/photo-1515434126000-961d90ff09db?q=80&w=1200&auto=format&fit=crop" },
          ].map((c) => (
            <Link
              key={c.label}
              href={c.href}
              className="group relative block aspect-[3/4] overflow-hidden rounded-2xl"
            >
              <img
                src={c.img}
                alt={c.label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
              <div className="absolute bottom-6 left-6 text-white">
                <div className="text-2xl font-black tracking-wider">{c.label}</div>
                <div className="mt-1 text-sm font-bold uppercase tracking-widest opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 translate-y-2">
                  Shop Now
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* MUST HAVES Section - Using Refined ProductCard (1st Image Style) */}
      <section className="mx-auto mt-20 max-w-7xl px-4">
        <div className="flex items-center justify-between">
          <h2 className="text-4xl font-[900] tracking-tighter uppercase">Must Haves</h2>
          <Link href="/men" className="text-sm font-black uppercase tracking-widest border-b-2 border-black pb-1">
            Shop All
          </Link>
        </div>

        {/* Category Filter - Matching User Images */}
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
            { id: "1", title: "Linen Blend Relaxed Fit Trousers", price: "₹1899", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop", swatches: ["#1D3A6C", "#FDE3D2", "#5C4033"], href: "/product/deck-2.0-high-loose-jeans" },
            { id: "2", title: "Oversized Graphic Cotton Tee", price: "₹1299", image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop", swatches: ["#000000", "#FFFFFF", "#FF0000"], href: "/product/deck-2.0-high-loose-jeans" },
            { id: "3", title: "Utility Cargo Pants", price: "₹2499", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop", swatches: ["#4B5320", "#000000"], href: "/product/deck-2.0-high-loose-jeans" },
            { id: "4", title: "Linen Series Casual Shirt", price: "₹1699", image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop", swatches: ["#FFFFFF", "#87CEEB", "#F5F5DC"], href: "/product/deck-2.0-high-loose-jeans" },
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
