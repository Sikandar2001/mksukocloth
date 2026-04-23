"use client";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import HotCategories from "@/components/HotCategories";
import HeroSlider from "@/components/HeroSlider";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { collection, onSnapshot, query, where, limit } from "firebase/firestore";

export default function Home() {
  const [menProducts, setMenProducts] = useState<any[]>([]);
  const [womenProducts, setWomenProducts] = useState<any[]>([]);
  const [activeWomenCategory, setActiveWomenCategory] = useState('all');
  const [activeWomenChildCategory, setActiveWomenChildCategory] = useState<string | null>(null);
  const [activeMenCategory, setActiveMenCategory] = useState('all');
  const [activeMenChildCategory, setActiveMenChildCategory] = useState<string | null>(null);
  const [womenCategories, setWomenCategories] = useState<{id: string, label: string}[]>([]);
  const [menCategories, setMenCategories] = useState<{id: string, label: string}[]>([]);
  const [womenChildSubCategories, setWomenChildSubCategories] = useState<any[]>([]);
  const [menChildSubCategories, setMenChildSubCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch categories and subcategories for dynamic product filtering and both filter bars
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
        
        const menCats = allCats.filter(cat => 
          cat.gender === 'men' || cat.gender === 'man' || cat.gender === 'male' || cat.name.toLowerCase() === 'men'
        );
        const womenCats = allCats.filter(cat => 
          cat.gender === 'women' || cat.gender === 'woman' || cat.gender === 'female' || cat.name.toLowerCase() === 'women'
        );

        const menCatIds = new Set(menCats.map(c => c.id));
        const menCatNames = new Set(menCats.map(c => c.name.toLowerCase()));
        const womenCatIds = new Set(womenCats.map(c => c.id));
        const womenCatNames = new Set(womenCats.map(c => c.name.toLowerCase()));

        onSnapshot(subCatsQ, (subSnapshot) => {
          const allSubCats = subSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            name: doc.data().name, 
            categoryId: doc.data().categoryId 
          }));
          
          const menSubCats = allSubCats.filter(sub => menCatIds.has(sub.categoryId));
          const menSubCatIds = new Set(menSubCats.map(s => s.id));
          const menSubCatNames = new Set(menSubCats.map(s => s.name.toLowerCase()));
          const womenSubCats = allSubCats.filter(sub => womenCatIds.has(sub.categoryId));
          const womenSubCatIds = new Set(womenSubCats.map(s => s.id));
          const womenSubCatNames = new Set(womenSubCats.map(s => s.name.toLowerCase()));

          onSnapshot(childCatsQ, (childSnapshot) => {
            const allChildSubCats = childSnapshot.docs.map(doc => ({
              id: doc.id,
              name: doc.data().name,
              subCategoryId: doc.data().subCategoryId
            }));

            const menChildSubCats = allChildSubCats.filter(child => menSubCatIds.has(child.subCategoryId));
            const womenChildSubCats = allChildSubCats.filter(child => womenSubCatIds.has(child.subCategoryId));
            setMenChildSubCategories(menChildSubCats);
            setWomenChildSubCategories(womenChildSubCats);

            // Update Men's filter bar
            const menCombined = [{ id: 'all', label: 'ALL' }, ...menCats.map(c => ({ id: c.id, label: c.name })), ...menSubCats.map(s => ({ id: s.id, label: s.name }))];
            const menUnique = menCombined.reduce((acc: any[], current) => {
              const labelLower = current.label.toLowerCase();
              if (labelLower === 'bottom' || labelLower === 'men' || labelLower === 'man' || labelLower === 'male') return acc;
              const x = acc.find(item => item.label.toLowerCase() === labelLower);
              if (!x) return acc.concat([current]);
              return acc;
            }, []);
            setMenCategories(menUnique);

            // Update Women's filter bar
            const womenCombined = [{ id: 'all', label: 'ALL' }, ...womenCats.map(c => ({ id: c.id, label: c.name })), ...womenSubCats.map(s => ({ id: s.id, label: s.name }))];
            const womenUnique = womenCombined.reduce((acc: any[], current) => {
              const labelLower = current.label.toLowerCase();
              if (labelLower === 'bottom' || labelLower === 'women' || labelLower === 'woman' || labelLower === 'female') return acc;
              const x = acc.find(item => item.label.toLowerCase() === labelLower);
              if (!x) return acc.concat([current]);
              return acc;
            }, []);
            setWomenCategories(womenUnique);

            // Now fetch products dynamically
            const productsQ = query(collection(db, "products"));
            onSnapshot(productsQ, (prodSnapshot) => {
              const allProducts = prodSnapshot.docs.map((doc) => {
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
              });

              // Filter for Men's products
              const menFiltered = allProducts.filter(p => {
                const pCat = p.category.toLowerCase();
                const pSub = p.subCategory.toLowerCase();
                const pChild = p.childSubCategory.toLowerCase();
                
                const isExplicitlyMen = pCat === 'men' || pCat === 'man' || pCat === 'male';
                const isInCategory = menCatNames.has(pCat);
                const isInSubCategory = menSubCatNames.has(pSub);
                const isInChildSubCategory = new Set(menChildSubCats.map(c => c.name.toLowerCase())).has(pChild);
                
                const isExplicitlyWomen = pCat === 'women' || pCat === 'woman' || pCat === 'female';
                if (isExplicitlyWomen) return false;
                return isExplicitlyMen || isInCategory || isInSubCategory || isInChildSubCategory;
              });
              setMenProducts(menFiltered);

              // Filter for Women's products
              const womenFiltered = allProducts.filter(p => {
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
              setWomenProducts(womenFiltered);
              setLoading(false);
            });
          });
        });
      });
    };

    fetchFilters();
  }, []);

  const activeWomenSubCatId = womenCategories.find(c => c.label.toLowerCase() === activeWomenCategory.toLowerCase())?.id;
  const currentWomenChildSubCats = womenChildSubCategories.filter(c => c.subCategoryId === activeWomenSubCatId);

  const activeMenSubCatId = menCategories.find(c => c.label.toLowerCase() === activeMenCategory.toLowerCase())?.id;
  const currentMenChildSubCats = menChildSubCategories.filter(c => c.subCategoryId === activeMenSubCatId);

  const filteredMenProducts = activeMenCategory === 'all' 
    ? menProducts.slice(0, 4)
    : menProducts.filter(p => {
        const matchesCat = p.category.toLowerCase() === activeMenCategory.toLowerCase() || 
                          p.subCategory?.toLowerCase() === activeMenCategory.toLowerCase();
        
        if (!activeMenChildCategory) return matchesCat;
        return matchesCat && p.childSubCategory?.toLowerCase() === activeMenChildCategory.toLowerCase();
      }).slice(0, 4);

  const filteredWomenProducts = activeWomenCategory === 'all' 
    ? womenProducts.slice(0, 4)
    : womenProducts.filter(p => {
        const matchesCat = p.category.toLowerCase() === activeWomenCategory.toLowerCase() || 
                          p.subCategory?.toLowerCase() === activeWomenCategory.toLowerCase();
        
        if (!activeWomenChildCategory) return matchesCat;
        return matchesCat && p.childSubCategory?.toLowerCase() === activeWomenChildCategory.toLowerCase();
      }).slice(0, 4);
  return (
    <main className="w-full bg-white font-lexend">
      {/* Hero Section - Image Slider */}
      <HeroSlider />

      {/* HOT CATEGORIES - Added based on user request */}
      <HotCategories />

      {/* NEW: Live In Denim Section (Static Banner) */}
      <section className="mt-12 w-full font-lexend">
        <div className="relative aspect-[1/1] w-full overflow-hidden bg-zinc-100 sm:aspect-[21/7]">
          <img
            src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=2000&auto=format&fit=crop"
            alt="Live In Denim"
            className="h-full w-full object-cover"
          />
          
          {/* Text Overlays matching user image */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-black font-black uppercase tracking-[0.3em] text-sm sm:text-base opacity-60">
            RELAXED
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center">
              <h2 className="text-5xl font-[1000] leading-[0.85] tracking-tighter text-white uppercase sm:text-[120px]">
                LIVE IN <br /> DENIM
              </h2>
              <p className="mt-6 text-sm font-black uppercase tracking-[0.25em] text-white/90 sm:text-lg">
                MUST HAVE DENIMS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WOMEN'S COLLECTION SECTION (replacing simple trending) */}
      <section id="womens-collection" className="mx-auto mt-12 max-w-7xl px-4 font-lexend">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-4xl font-[900] tracking-tighter uppercase leading-none">WOMEN'S COLLECTION</h2>
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            {filteredWomenProducts.length} STYLES FOUND
          </p>
        </div>
        
        <div className="flex flex-col gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-2">
            {womenCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveWomenCategory(cat.label.toLowerCase());
                  setActiveWomenChildCategory(null);
                }}
                className={`px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 border border-black ${
                  activeWomenCategory === cat.label.toLowerCase() 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-black hover:bg-black hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Child Category Filter Bar */}
          {currentWomenChildSubCats.length > 0 && (
            <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <button
                onClick={() => setActiveWomenChildCategory(null)}
                className={`px-6 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${
                  activeWomenChildCategory === null 
                    ? 'bg-zinc-900 text-white border-zinc-900' 
                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900'
                }`}
              >
                All {activeWomenCategory}
              </button>
              {currentWomenChildSubCats.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setActiveWomenChildCategory(child.name.toLowerCase())}
                  className={`px-6 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${
                    activeWomenChildCategory === child.name.toLowerCase() 
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
        
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {filteredWomenProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {filteredWomenProducts.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
              <p className="text-zinc-400 font-bold uppercase tracking-widest">No products found in this category.</p>
            </div>
          )}
        </div>

      </section>

      {/* SHOW ALL Button - Links to Women's Collection */}
      <div className="mt-8 flex justify-center">
        <Link
          href="/women"
          className="rounded-full border-2 border-black bg-white px-12 py-3 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-white"
        >
          Show All
        </Link>
      </div>

      {/* MEN'S COLLECTION Section */}
      <section className="mx-auto mt-12 max-w-7xl px-4 font-lexend">
        <div className="flex flex-col gap-2 mb-8">
          <h2 className="text-4xl font-[900] tracking-tighter uppercase leading-none">MEN'S COLLECTION</h2>
          <p className="text-sm font-bold uppercase tracking-widest text-zinc-500">
            {filteredMenProducts.length} STYLES FOUND
          </p>
        </div>
        
        <div className="flex flex-col gap-4 overflow-x-auto pb-4 scrollbar-hide">
          <div className="flex gap-2">
            {menCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveMenCategory(cat.label.toLowerCase());
                  setActiveMenChildCategory(null);
                }}
                className={`px-8 py-3 text-sm font-bold tracking-widest uppercase transition-all duration-300 border border-black ${
                  activeMenCategory === cat.label.toLowerCase() 
                    ? 'bg-black text-white border-black' 
                    : 'bg-white text-black border-black hover:bg-black hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Men's Child Category Filter Bar */}
          {currentMenChildSubCats.length > 0 && (
            <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
              <button
                onClick={() => setActiveMenChildCategory(null)}
                className={`px-6 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${
                  activeMenChildCategory === null 
                    ? 'bg-zinc-900 text-white border-zinc-900' 
                    : 'bg-white text-zinc-500 border-zinc-200 hover:border-zinc-900'
                }`}
              >
                All {activeMenCategory}
              </button>
              {currentMenChildSubCats.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setActiveMenChildCategory(child.name.toLowerCase())}
                  className={`px-6 py-2 text-[10px] font-bold tracking-widest uppercase border transition-all ${
                    activeMenChildCategory === child.name.toLowerCase() 
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
        
        <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {filteredMenProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {filteredMenProducts.length === 0 && !loading && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-zinc-100 rounded-3xl">
              <p className="text-zinc-400 font-bold uppercase tracking-widest">No products found in this category.</p>
            </div>
          )}
        </div>

        {/* SHOW ALL Button - Links to Men's Collection Page */}
        <div className="mt-8 flex justify-center">
          <Link
            href="/men"
            className="rounded-full border-2 border-black bg-white px-12 py-3 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-black hover:text-white"
          >
            Show All
          </Link>
        </div>
      </section>

      {/* MATCH THE MOOD Section (5 Cards Scrollable Section) */}
      <section className="mx-auto mt-12 max-w-7xl px-4 overflow-hidden">
        <h2 className="text-center text-xl font-black tracking-tight uppercase sm:text-4xl">MATCH THE MOOD</h2>
        
        <div className="mt-6 flex w-full gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory lg:grid lg:grid-cols-5 lg:gap-4 lg:overflow-visible lg:pb-0">
          {[
            { 
              title: "LUXURY", 
              subtitle: "REFINED", 
              img: "https://images.unsplash.com/photo-1550246140-5119ae4790b8?q=80&w=800&auto=format&fit=crop",
              badge: "SNITCH" 
            },
            { 
              title: "SUMMER", 
              subtitle: "ESCAPE", 
              img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
              badge: null 
            },
            { 
              title: "WEEKEND", 
              subtitle: "MODE", 
              img: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop",
              badge: null 
            },
            { 
              title: "FORMAL", 
              subtitle: "DRIP", 
              img: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop",
              badge: null 
            },
            { 
              title: "BASICS", 
              subtitle: "DAILY", 
              img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=800&auto=format&fit=crop",
              badge: "CORE LAB" 
            },
          ].map((mood, idx) => (
            <div key={idx} className="group relative aspect-[4/5] w-[140px] flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100 snap-start sm:w-[240px] lg:w-auto lg:min-w-0">
              <img
                src={mood.img}
                alt={mood.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-70" />
              
              {mood.badge && (
                <div className="absolute top-2 right-2 lg:top-4 lg:right-4">
                  <span className="rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[6px] font-bold tracking-widest text-white backdrop-blur-md uppercase lg:px-3 lg:py-1.5 lg:text-[9px]">
                    {mood.badge}
                  </span>
                </div>
              )}

              <div className="absolute bottom-3 left-0 w-full px-1 text-center lg:bottom-8">
                <h3 className="text-lg font-black tracking-tight text-white uppercase sm:text-2xl lg:text-4xl">
                  {mood.title}
                </h3>
                <p className="mt-0.5 text-[8px] font-black tracking-[0.2em] text-orange-400 uppercase sm:text-[10px] lg:mt-1 lg:text-sm lg:tracking-[0.3em]">
                  {mood.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SHOP YOUR SIZE Section (Full Width Banner) */}
      <section className="mt-12 w-full font-lexend">
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

    </main>
  );
}
