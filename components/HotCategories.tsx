"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

interface Category {
  id?: string;
  name: string;
  img?: string;
  gender?: 'men' | 'women' | string;
  order?: number;
}

interface CategoryItemProps {
  category: Category;
}

const CategoryItem = ({ category }: CategoryItemProps) => {
  // Use a fallback image if 'img' is missing
  const displayImg = category.img || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=300&auto=format&fit=crop';
  
  return (
    <div className="flex flex-col items-center min-w-[120px] flex-shrink-0 sm:min-w-0 group cursor-pointer lg:w-[15%]">
      <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-full bg-gradient-to-b from-[#FFE6F2] via-[#FFF5F9] to-white flex items-center justify-center p-2 transition-transform group-hover:scale-105 border border-pink-50/50 shadow-sm">
        {/* Sparkles placeholder */}
        <div className="absolute top-4 left-3 text-pink-300 opacity-60 text-[10px]">✦</div>
        <div className="absolute top-10 right-3 text-pink-300 opacity-40 text-[8px]">✦</div>
        <div className="absolute bottom-12 left-4 text-pink-300 opacity-50 text-[6px]">✦</div>
        
        <img 
          src={displayImg} 
          alt={category.name} 
          className="h-[85%] w-[85%] object-contain"
        />
      </div>
      <p className="mt-3 text-center text-[10px] font-black tracking-widest uppercase text-zinc-900 sm:text-xs">
        {category.name}
      </p>
    </div>
  );
};

const HotCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Removed orderBy("order", "asc") because it hides documents that don't have an 'order' field
    const q = query(collection(db, "categories"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const categoryData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      
      // Sort in-memory if 'order' exists
      categoryData.sort((a, b) => (a.order || 99) - (b.order || 99));
      
      setCategories(categoryData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching categories: ", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const menCategories = categories.filter(cat => cat.gender?.toLowerCase() === 'men' || cat.gender?.toLowerCase() === 'man');
  const womenCategories = categories.filter(cat => cat.gender?.toLowerCase() === 'women' || cat.gender?.toLowerCase() === 'woman');
  const otherCategories = categories.filter(cat => !['men', 'man', 'women', 'woman'].includes(cat.gender?.toLowerCase() || ''));

  if (loading) {
    return (
      <section className="mx-auto mt-16 max-w-7xl px-4 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-zinc-100 rounded mb-12"></div>
          <div className="w-full flex justify-center gap-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-[120px] h-[180px] bg-zinc-50 rounded-t-full"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) {
    return (
      <section className="mx-auto mt-16 max-w-7xl px-4 text-center py-20 border-2 border-dashed border-zinc-100 rounded-3xl">
        <p className="text-zinc-400 font-bold uppercase tracking-widest">
          No categories found in Admin Panel.
        </p>
        <p className="text-xs text-zinc-300 mt-2">
          Add documents to the 'categories' collection in Firestore with fields: name, img, gender.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 font-lexend">
      <h2 className="text-center text-3xl font-black tracking-tight uppercase sm:text-4xl mb-12">
        HOT CATEGORIES
      </h2>
      
      {/* MEN'S SECTION */}
      {menCategories.length > 0 && (
        <div className="mb-12">
          <h3 className="text-center text-lg font-black tracking-[0.2em] uppercase text-zinc-400 mb-6">MEN</h3>
          <div className="flex overflow-x-auto pb-6 scrollbar-hide sm:grid sm:grid-cols-3 gap-4 sm:gap-6 lg:flex lg:justify-center lg:gap-8 lg:overflow-x-visible">
            {menCategories.map((category) => (
              <CategoryItem key={category.id || category.name} category={category} />
            ))}
          </div>
        </div>
      )}

      {/* WOMEN'S SECTION */}
      {womenCategories.length > 0 && (
        <div className="mb-12">
          <h3 className="text-center text-lg font-black tracking-[0.2em] uppercase text-zinc-400 mb-6">WOMEN</h3>
          <div className="flex overflow-x-auto pb-6 scrollbar-hide sm:grid sm:grid-cols-3 gap-4 sm:gap-6 lg:flex lg:justify-center lg:gap-8 lg:overflow-x-visible">
            {womenCategories.map((category) => (
              <CategoryItem key={category.id || category.name} category={category} />
            ))}
          </div>
        </div>
      )}

      {/* GENERAL/OTHER SECTION (Shows items with missing or unknown gender) */}
      {otherCategories.length > 0 && (
        <div>
          <h3 className="text-center text-lg font-black tracking-[0.2em] uppercase text-zinc-400 mb-6">ALL CATEGORIES</h3>
          <div className="flex overflow-x-auto pb-6 scrollbar-hide sm:grid sm:grid-cols-3 gap-4 sm:gap-6 lg:flex lg:justify-center lg:gap-8 lg:overflow-x-visible">
            {otherCategories.map((category) => (
              <CategoryItem key={category.id || category.name} category={category} />
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default HotCategories;
