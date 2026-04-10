"use client";

import React, { useEffect, useState } from 'react';
import { db } from '@/app/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';
import Link from 'next/link';

interface Category {
  id?: string;
  name: string;
  image?: string;
  gender?: 'men' | 'women' | string;
  order?: number;
}

interface CategoryItemProps {
  category: Category;
}

const CategoryItem = ({ category, onClick, isLink = true, parentName }: { category: Category; onClick?: () => void; isLink?: boolean; parentName?: string }) => {
  // Use a fallback image if 'image' is missing
  const displayImg = category.image || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=300&auto=format&fit=crop';
  
  // Determine link based on gender or name fallback
  const gender = category.gender?.toLowerCase() || "";
  const name = category.name?.toLowerCase() || "";
  
  // Robust check for gender
  const isWomen = gender === 'women' || gender === 'woman' || gender === 'female';
  const isMen = gender === 'men' || gender === 'man' || gender === 'male' || name === 'trousers' || name === 'shirts' || name === 'jeans';

  let href = isMen ? `/men?category=${encodeURIComponent(name)}` : `/women?category=${encodeURIComponent(name)}`;
  
  // If it's a child subcategory, add the parent category and the child param
  if (parentName) {
    const baseUrl = isMen ? '/men' : '/women';
    href = `${baseUrl}?category=${encodeURIComponent(parentName.toLowerCase())}&child=${encodeURIComponent(name)}`;
  }

  const content = (
    <div className="relative w-full aspect-[4/5] overflow-hidden rounded-t-full bg-gradient-to-b from-[#FFE6F2] via-[#FFF5F9] to-white flex items-center justify-center p-2 transition-transform group-hover:scale-105 border border-pink-50/50 shadow-sm">
      {/* Sparkles placeholder */}
      <div className="absolute top-4 left-3 text-pink-300 opacity-60 text-[10px]">✦</div>
      <div className="absolute top-10 right-3 text-pink-300 opacity-40 text-[8px]">✦</div>
      <div className="absolute bottom-12 left-4 text-pink-300 opacity-50 text-[6px]">✦</div>
      
      <img 
        src={displayImg} 
        alt={category.name} 
        className="h-[90%] w-[90%] object-contain"
      />
    </div>
  );

  if (isLink) {
    return (
      <Link 
        href={href}
        className="flex flex-col items-center w-[110px] sm:w-[150px] lg:w-[180px] flex-shrink-0 group cursor-pointer"
      >
        {content}
        <p className="mt-3 text-center text-[10px] font-black tracking-widest uppercase text-zinc-900 sm:text-xs">
          {category.name}
        </p>
      </Link>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center w-[110px] sm:w-[150px] lg:w-[180px] flex-shrink-0 group cursor-pointer"
    >
      {content}
      <p className="mt-3 text-center text-[10px] font-black tracking-widest uppercase text-zinc-900 sm:text-xs">
        {category.name}
      </p>
    </div>
  );
};

const HotCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [childSubCategories, setChildSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubCatId, setActiveSubCatId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch main categories
    const qCat = query(collection(db, "categories"));
    const unsubscribeCat = onSnapshot(qCat, (snapshot) => {
      const categoryData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      categoryData.sort((a, b) => (a.order || 99) - (b.order || 99));
      setCategories(categoryData);
    });

    // Fetch subcategories
    const qSub = query(collection(db, "subcategories"));
    const unsubscribeSub = onSnapshot(qSub, (snapshot) => {
      const subData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      subData.sort((a, b) => (a.order || 99) - (b.order || 99));
      setSubCategories(subData);
    });

    // Fetch child-subcategories
    const qChild = query(collection(db, "child-subcategories"));
    const unsubscribeChild = onSnapshot(qChild, (snapshot) => {
      const childData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Category[];
      setChildSubCategories(childData);
      setLoading(false);
    });

    return () => {
      unsubscribeCat();
      unsubscribeSub();
      unsubscribeChild();
    };
  }, []);

  // Enrich subcategories and child categories with gender
  const enrichedSubCategories = React.useMemo(() => {
    const genderMap: Record<string, string> = {};
    categories.forEach(cat => {
      if (cat.id && cat.gender) genderMap[cat.id] = cat.gender.toLowerCase();
    });

    return subCategories.map(sub => {
      const data = sub as any;
      const parentGender = data.categoryId ? genderMap[data.categoryId] : null;
      return { ...sub, gender: sub.gender || parentGender || "" };
    });
  }, [categories, subCategories]);

  const enrichedChildSubCategories = React.useMemo(() => {
    const subGenderMap: Record<string, string> = {};
    enrichedSubCategories.forEach(sub => {
      if (sub.id && sub.gender) subGenderMap[sub.id] = sub.gender;
    });

    return childSubCategories.map(child => {
      const data = child as any;
      const parentGender = data.subCategoryId ? subGenderMap[data.subCategoryId] : null;
      return { ...child, gender: child.gender || parentGender || "" };
    });
  }, [enrichedSubCategories, childSubCategories]);

  const getUnique = (list: Category[]) => {
    const seen = new Set();
    return list.filter(item => {
      const name = item.name?.toLowerCase().trim();
      if (!name || seen.has(name)) return false;
      seen.add(name);
      return true;
    });
  };

  const menCategories = getUnique(categories.filter(cat => {
    const g = cat.gender?.toLowerCase();
    return g === 'men' || g === 'man' || g === 'male';
  }));

  const womenCategories = getUnique(categories.filter(cat => {
    const g = cat.gender?.toLowerCase();
    return g === 'women' || g === 'woman' || g === 'female';
  }));

  const allCategoriesList = getUnique(enrichedSubCategories);

  const activeChildren = React.useMemo(() => {
    if (!activeSubCatId) return [];
    return enrichedChildSubCategories.filter((child: any) => child.subCategoryId === activeSubCatId);
  }, [activeSubCatId, enrichedChildSubCategories]);

  const activeSubCatName = subCategories.find(s => s.id === activeSubCatId)?.name;

  if (loading) {
    return (
      <section className="mx-auto mt-8 max-w-7xl px-4 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-zinc-100 rounded mb-8"></div>
          <div className="w-full flex justify-center gap-8">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-[120px] h-[180px] bg-zinc-50 rounded-t-full"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-8 max-w-7xl px-4 font-lexend">
      <h2 className="text-center text-3xl font-black tracking-tight uppercase sm:text-4xl mb-8">
        HOT CATEGORIES
      </h2>
      
      {/* Drill-down View for Child Categories */}
      {activeSubCatId && (
        <div className="mb-8 bg-zinc-50 p-8 rounded-3xl border border-zinc-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black tracking-widest uppercase text-zinc-900">
              {activeSubCatName} <span className="text-zinc-400 font-medium ml-2">/ Child Categories</span>
            </h3>
            <button 
              onClick={() => setActiveSubCatId(null)}
              className="text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-black flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="size-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
              </svg>
              Back
            </button>
          </div>
          
          <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-4 sm:gap-8 lg:gap-12 overflow-x-auto sm:overflow-x-visible pb-6 scrollbar-hide">
            {activeChildren.length > 0 ? (
              activeChildren.map((child) => (
                <CategoryItem 
                  key={child.id || child.name} 
                  category={child} 
                  parentName={activeSubCatName}
                />
              ))
            ) : (
              <p className="text-zinc-400 uppercase tracking-widest text-sm py-10">No child categories found for this section.</p>
            )}
          </div>
        </div>
      )}

      {!activeSubCatId && (
        <>
          {/* MEN'S SECTION */}
          {menCategories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-center text-lg font-black tracking-[0.2em] uppercase text-zinc-400 mb-3">MEN</h3>
              <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-4 sm:gap-8 lg:gap-12 overflow-x-auto sm:overflow-x-visible pb-6 scrollbar-hide px-4 sm:px-0">
                {menCategories.map((category) => (
                  <CategoryItem key={category.id || category.name} category={category} />
                ))}
              </div>
            </div>
          )}

          {/* WOMEN'S SECTION */}
          {womenCategories.length > 0 && (
            <div className="mb-8">
              <h3 className="text-center text-lg font-black tracking-[0.2em] uppercase text-zinc-400 mb-3">WOMEN</h3>
              <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-4 sm:gap-8 lg:gap-12 overflow-x-auto sm:overflow-x-visible pb-6 scrollbar-hide px-4 sm:px-0">
                {womenCategories.map((category) => (
                  <CategoryItem key={category.id || category.name} category={category} />
                ))}
              </div>
            </div>
          )}

          {/* ALL CATEGORIES SECTION */}
          {allCategoriesList.length > 0 && (
            <div className="mb-4">
              <h3 className="text-center text-lg font-black tracking-[0.2em] uppercase text-zinc-400 mb-3">ALL CATEGORIES</h3>
              <div className="flex flex-nowrap sm:flex-wrap justify-start sm:justify-center gap-4 sm:gap-8 lg:gap-12 overflow-x-auto sm:overflow-x-visible pb-6 scrollbar-hide px-4 sm:px-0">
                {allCategoriesList.map((category) => {
                  const hasChildren = childSubCategories.some((c: any) => c.subCategoryId === category.id);
                  return (
                    <CategoryItem 
                      key={category.id || category.name} 
                      category={category} 
                      isLink={!hasChildren}
                      onClick={hasChildren ? () => setActiveSubCatId(category.id || null) : undefined}
                    />
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
};

export default HotCategories;
