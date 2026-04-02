"use client";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import { useState } from "react";

const PRODUCTS = [
  {
    id: "m1",
    title: "Linen Blend Relaxed Fit Trousers",
    price: "₹1899",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800&auto=format&fit=crop",
    swatches: ["#1D3A6C", "#FDE3D2", "#5C4033"],
    href: "/product/deck-2.0-high-loose-jeans",
    category: "trousers",
  },
  {
    id: "m2",
    title: "Oversized Graphic Cotton Tee",
    price: "₹1299",
    image: "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=800&auto=format&fit=crop",
    swatches: ["#000000", "#FFFFFF", "#FF0000"],
    href: "/product/deck-2.0-high-loose-jeans",
    category: "t-shirts",
  },
  {
    id: "m3",
    title: "Utility Cargo Pants",
    price: "₹2499",
    image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?q=80&w=800&auto=format&fit=crop",
    swatches: ["#4B5320", "#000000"],
    href: "/product/deck-2.0-high-loose-jeans",
    category: "trousers",
  },
  {
    id: "m4",
    title: "Linen Series Casual Shirt",
    price: "₹1699",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=800&auto=format&fit=crop",
    swatches: ["#FFFFFF", "#87CEEB", "#F5F5DC"],
    href: "/product/deck-2.0-high-loose-jeans",
    category: "shirts",
  },
  {
    id: "m5",
    title: "Classic White Sneakers",
    price: "₹2999",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop",
    swatches: ["#FFFFFF"],
    href: "/product/deck-2.0-high-loose-jeans",
    category: "shoes",
  },
  {
    id: "m6",
    title: "Denim Trucker Jacket",
    price: "₹3499",
    image: "https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?q=80&w=800&auto=format&fit=crop",
    swatches: ["#1D3A6C", "#4A6FA5"],
    href: "/product/deck-2.0-high-loose-jeans",
    category: "jackets",
  },
  {
    id: "m7",
    title: "Slim Fit Blue Jeans",
    price: "₹2499",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop",
    swatches: ["#1D3A6C"],
    href: "/product/deck-2.0-high-loose-jeans",
    category: "jeans",
  },
  {
    id: "m8",
    title: "Classic Aviator Sunglasses",
    price: "₹1499",
    image: "https://images.unsplash.com/photo-1511499767390-90342f16b147?q=80&w=800&auto=format&fit=crop",
    swatches: ["#000000"],
    href: "/product/deck-2.0-high-loose-jeans",
    category: "sunglasses",
  },
];

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'shirts', label: 'SHIRTS' },
  { id: 'jeans', label: 'JEANS' },
  { id: 'trousers', label: 'TROUSERS' },
  { id: 'sunglasses', label: 'SUNGLASSES' },
  { id: 't-shirts', label: 'T-SHIRTS' },
  { id: 'jackets', label: 'JACKETS' },
  { id: 'shoes', label: 'SHOES' },
];

export default function MenItemsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 bg-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase sm:text-5xl">MEN'S COLLECTION</h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-zinc-500">{filteredProducts.length} Styles Found</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 rounded-full border-2 border-black px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all hover:bg-black hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
            </svg>
            Filter
          </button>
          <div className="relative group">
            <button className="flex items-center gap-2 rounded-full border-2 border-zinc-200 px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all hover:border-black">
              Sort: Relevance
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter - Matching Home Page Style */}
      <div className="mt-8 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex gap-3 min-w-max">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-8 py-3 text-sm font-medium tracking-widest border border-black transition-all duration-300 ${
                activeCategory === cat.id 
                  ? 'bg-black text-white' 
                  : 'bg-white text-black hover:bg-black hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 border-t border-zinc-100 pt-10">
        {filteredProducts.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </main>
  );
}

