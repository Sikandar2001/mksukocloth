"use client";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "products"), where("category", "in", ["man", "men"]));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedProducts = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.name || data.title || "",
          price: `₹${data.discountPrice || data.originalPrice || "0"}`,
          image: data.images?.[0] || "",
          hoverImage: data.images?.[1] || data.images?.[0] || "",
          swatches: data.images || [], // Use images for card thumbnails
          href: `/product/${data.slug || doc.id}`,
          category: data.subCategory || "all",
        };
      });
      setProducts(fetchedProducts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 bg-white font-lexend">
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

