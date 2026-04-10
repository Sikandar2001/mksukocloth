"use client";
import Link from "next/link";
import ProductCard from "../../components/ProductCard";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'dresses', label: 'DRESSES' },
  { id: 'tops-blouses', label: 'TOPS & BLOUSES' },
  { id: 't-shirts', label: 'T-SHIRTS' },
  { id: 'bottoms', label: 'BOTTOMS' },
  { id: 'co-ords', label: 'CO-ORDS' },
  { id: 'denim', label: 'DENIM' },
  { id: 'loungewear', label: 'LOUNGEWEAR' },
];

function WomenItemsContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get('category');
  const childParam = searchParams.get('child');
  const [activeCategory, setActiveCategory] = useState(categoryParam?.toLowerCase() || 'all');
  const [products, setProducts] = useState<any[]>([]);
  const [dynamicCategories, setDynamicCategories] = useState<{id: string, label: string}[]>([]);
  const [childSubCategories, setChildSubCategories] = useState<any[]>([]);
  const [activeChildCategory, setActiveChildCategory] = useState<string | null>(childParam?.toLowerCase() || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryParam) {
      setActiveCategory(categoryParam.toLowerCase());
    }
    if (childParam) {
      setActiveChildCategory(childParam.toLowerCase());
    }
  }, [categoryParam, childParam]);

  useEffect(() => {
    // Fetch categories, subcategories, and child-subcategories
    const fetchFilters = async () => {
      const catsQ = query(collection(db, "categories"));
      const subCatsQ = query(collection(db, "subcategories"));
      const childCatsQ = query(collection(db, "child-subcategories"));
      
      onSnapshot(catsQ, (catsSnapshot) => {
        const allCats = catsSnapshot.docs.map(doc => ({ 
          id: doc.id, 
          name: doc.data().name, 
          gender: doc.data().gender?.toLowerCase() || '' 
        }));
        
        const womenCats = allCats.filter(cat => 
          cat.gender === 'women' || cat.gender === 'woman' || cat.gender === 'female' || cat.name.toLowerCase() === 'women'
        );
        const womenCatIds = new Set(womenCats.map(c => c.id));
        const womenCatNames = new Set(womenCats.map(c => c.name.toLowerCase()));

        onSnapshot(subCatsQ, (subSnapshot) => {
          const allSubCats = subSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            name: doc.data().name, 
            categoryId: doc.data().categoryId 
          }));
          
          const womenSubCats = allSubCats.filter(sub => womenCatIds.has(sub.categoryId));
          const womenSubCatIds = new Set(womenSubCats.map(s => s.id));
          const womenSubCatNames = new Set(womenSubCats.map(s => s.name.toLowerCase()));

          onSnapshot(childCatsQ, (childSnapshot) => {
            const allChildSubCats = childSnapshot.docs.map(doc => ({
              id: doc.id,
              name: doc.data().name,
              subCategoryId: doc.data().subCategoryId
            }));

            const womenChildSubCats = allChildSubCats.filter(child => womenSubCatIds.has(child.subCategoryId));
            setChildSubCategories(womenChildSubCats);

            // Update filter bar categories (Main categories and subcategories)
            const combined = [
              { id: 'all', label: 'ALL' }, 
              ...womenCats.map(c => ({ id: c.id, label: c.name })), 
              ...womenSubCats.map(s => ({ id: s.id, label: s.name }))
            ];
            
            const unique = combined.reduce((acc: any[], current) => {
              const labelLower = current.label.toLowerCase();
              if (labelLower === 'bottom') return acc;
              const x = acc.find(item => item.label.toLowerCase() === labelLower);
              if (!x) return acc.concat([current]);
              return acc;
            }, []);
            
            setDynamicCategories(unique);

            // Fetch and filter products dynamically
            const productsQ = query(collection(db, "products"));
            onSnapshot(productsQ, (prodSnapshot) => {
              const fetchedProducts = prodSnapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                  id: doc.id,
                  title: data.name || data.title || "",
                  price: `₹${data.discountPrice || data.originalPrice || "0"}`,
                  image: data.images?.[0] || "",
                  hoverImage: data.images?.[1] || data.images?.[0] || "",
                  swatches: data.images || [],
                  href: `/product/${data.slug || doc.id}`,
                  category: data.category || "all",
                  subCategory: data.subCategory || "",
                  childSubCategory: data.childSubCategory || "",
                };
              }).filter(p => {
                const pCat = p.category.toLowerCase();
                const pSub = p.subCategory.toLowerCase();
                const pChild = p.childSubCategory.toLowerCase();
                
                const isExplicitlyWomen = pCat === 'women' || pCat === 'woman' || pCat === 'female';
                const isInCategory = womenCatNames.has(pCat);
                const isInSubCategory = womenSubCatNames.has(pSub);
                const isInChildSubCategory = new Set(womenChildSubCats.map(c => c.name.toLowerCase())).has(pChild);
                
                const isExplicitlyMen = pCat === 'men' || pCat === 'man' || pCat === 'male';
                if (isExplicitlyMen) return false;

                return isExplicitlyWomen || isInCategory || isInSubCategory || isInChildSubCategory;
              });
              setProducts(fetchedProducts);
              setLoading(false);
            });
          });
        });
      });
    };

    fetchFilters();
  }, []);

  const filteredProducts = activeCategory === 'all' 
    ? products 
    : products.filter(p => {
        const matchesCat = p.category.toLowerCase() === activeCategory.toLowerCase() || 
                          p.subCategory?.toLowerCase() === activeCategory.toLowerCase();
        
        if (!activeChildCategory) return matchesCat;
        
        return matchesCat && p.childSubCategory?.toLowerCase() === activeChildCategory.toLowerCase();
      });

  const activeSubCatId = dynamicCategories.find(c => c.label.toLowerCase() === activeCategory.toLowerCase())?.id;
  const currentChildSubCats = childSubCategories.filter(c => c.subCategoryId === activeSubCatId);

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
        </div>
      </div>

      {/* Category Filter - Dynamic from Firestore */}
      <div className="mt-8 overflow-x-auto pb-4 scrollbar-hide">
        <div className="flex flex-col gap-4">
          <div className="flex gap-3 min-w-max">
            {dynamicCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.label.toLowerCase());
                  setActiveChildCategory(null);
                }}
                className={`px-8 py-3 text-sm font-medium tracking-widest border border-black transition-all duration-300 uppercase ${
                  activeCategory === cat.label.toLowerCase() 
                    ? 'bg-black text-white' 
                    : 'bg-white text-black hover:bg-black hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Child Category Filter Bar */}
          {currentChildSubCats.length > 0 && (
            <div className="flex gap-2 min-w-max animate-in fade-in slide-in-from-top-2 duration-300">
              <button
                onClick={() => setActiveChildCategory(null)}
                className={`px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full border transition-all ${
                  activeChildCategory === null 
                    ? 'bg-zinc-900 text-white border-zinc-900' 
                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900'
                }`}
              >
                All {activeCategory}
              </button>
              {currentChildSubCats.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setActiveChildCategory(child.name.toLowerCase())}
                  className={`px-4 py-1.5 text-[10px] font-black tracking-widest uppercase rounded-full border transition-all ${
                    activeChildCategory === child.name.toLowerCase() 
                      ? 'bg-zinc-900 text-white border-zinc-900' 
                      : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900'
                  }`}
                >
                  {child.name}
                </button>
              ))}
            </div>
          )}
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

export default function WomenItemsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-12 animate-spin rounded-full border-4 border-black border-t-transparent" />
      </div>
    }>
      <WomenItemsContent />
    </Suspense>
  );
}

