"use client";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import { useState } from "react";

const PRODUCTS = [
  {
    id: "w1",
    title: "Linen Series Summer Dress",
    price: "₹2499",
    image: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=800&auto=format&fit=crop",
    swatches: ["#FFFFFF", "#F5F5DC", "#E6E6FA"],
    href: "/product/women-linen-dress",
    category: "shirts", // Mapping dresses to shirts for now as placeholder
  },
  {
    id: "w2",
    title: "High-Waisted Utility Trousers",
    price: "₹1999",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
    swatches: ["#4B5320", "#000000", "#5C4033"],
    href: "/product/women-utility-trousers",
    category: "trousers",
  },
  {
    id: "w3",
    title: "Oversized Denim Shirt",
    price: "₹1899",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    swatches: ["#1D3A6C", "#4A6FA5"],
    href: "/product/women-denim-shirt",
    category: "shirts",
  },
  {
    id: "w4",
    title: "Graphic Boxy Tee",
    price: "₹999",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15cf70449?q=80&w=800&auto=format&fit=crop",
    swatches: ["#000000", "#FFFFFF"],
    href: "/product/women-boxy-tee",
    category: "t-shirts",
  },
  {
    id: "w5",
    title: "Wide Leg Blue Jeans",
    price: "₹2199",
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=800&auto=format&fit=crop",
    swatches: ["#1D3A6C"],
    href: "/product/women-wide-jeans",
    category: "jeans",
  },
  {
    id: "w6",
    title: "Retro Sunglasses",
    price: "₹1299",
    image: "https://images.unsplash.com/photo-1511499767390-90342f16b147?q=80&w=800&auto=format&fit=crop",
    swatches: ["#000000"],
    href: "/product/women-retro-sunglasses",
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

export default function WomenItemsPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredProducts = activeCategory === 'all' 
    ? PRODUCTS 
    : PRODUCTS.filter(p => p.category === activeCategory);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 bg-white">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter uppercase sm:text-5xl">WOMEN'S COLLECTION</h1>
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

      {/* Category Filter - Matching Design */}
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

