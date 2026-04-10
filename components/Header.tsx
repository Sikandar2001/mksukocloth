"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";
import { db } from "@/app/lib/firebase";
import { collection, query, getDocs } from "firebase/firestore";

export default function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<{ products: any[], categories: any[] }>({ products: [], categories: [] });
  const [isSearching, setIsSearching] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);

  // Fetch and search logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        try {
          // Search products
          const productsRef = collection(db, "products");
          const productsSnapshot = await getDocs(productsRef);
          const allProducts = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          const filteredProducts = allProducts.filter((p: any) => {
            const searchStr = searchQuery.toLowerCase();
            return (
              (p.name || p.title || "").toLowerCase().includes(searchStr) ||
              (p.category || "").toLowerCase().includes(searchStr) ||
              (p.subCategory || "").toLowerCase().includes(searchStr) ||
              (p.childSubCategory || "").toLowerCase().includes(searchStr) ||
              (p.description || "").toLowerCase().includes(searchStr) ||
              (p.tags || []).some((tag: string) => tag.toLowerCase().includes(searchStr))
            );
          }).slice(0, 6);

          // Search categories (subcategories and child-subcategories)
          const subCatsRef = collection(db, "subcategories");
          const childCatsRef = collection(db, "child-subcategories");
          
          const [subCatsSnapshot, childCatsSnapshot] = await Promise.all([
            getDocs(subCatsRef),
            getDocs(childCatsRef)
          ]);

          const filteredSubCats = subCatsSnapshot.docs
            .map(doc => ({ id: doc.id, name: doc.data().name, type: 'category' }))
            .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

          const filteredChildCats = childCatsSnapshot.docs
            .map(doc => ({ id: doc.id, name: doc.data().name, type: 'category' }))
            .filter(cat => cat.name.toLowerCase().includes(searchQuery.toLowerCase()));

          const combinedCats = [...filteredSubCats, ...filteredChildCats]
            .filter((v, i, a) => a.findIndex(t => t.name === v.name) === i) // Unique by name
            .slice(0, 8);

          setSearchResults({ products: filteredProducts, categories: combinedCats });
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults({ products: [], categories: [] });
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setIsSearchOpen(false);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (open && panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false);
      if (isSearchOpen && searchRef.current && !searchRef.current.contains(e.target as Node)) setIsSearchOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open, isSearchOpen]);

  return (
    <header className="w-full border-b border-black/10 font-lexend">
      <div className="relative mx-auto flex h-14 max-w-7xl items-center px-4">
        <div className="flex items-center gap-2 sm:gap-6">
          <button
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex items-center justify-center rounded p-1 hover:bg-black/5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-5 sm:size-6"
            >
              <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
          
          <nav className="hidden items-center gap-8 sm:flex">
            <Link 
              href="/" 
              className={`group relative text-sm font-black tracking-widest transition-colors ${
                pathname === "/" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <span>HOME</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 w-full bg-black transition-transform ${
                pathname === "/" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
            <Link 
              href="/men" 
              className={`group relative text-sm font-black tracking-widest transition-colors ${
                pathname === "/men" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <span>MEN</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 w-full bg-black transition-transform ${
                pathname === "/men" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
            <Link 
              href="/women" 
              className={`group relative text-sm font-black tracking-widest transition-colors ${
                pathname === "/women" ? "text-zinc-900" : "text-zinc-400 hover:text-zinc-900"
              }`}
            >
              <span>WOMEN</span>
              <span className={`absolute -bottom-1 left-0 h-0.5 w-full bg-black transition-transform ${
                pathname === "/women" ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
              }`} />
            </Link>
          </nav>
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 select-none flex flex-col items-center leading-none text-black">
          <span className="text-xl font-black tracking-[0.2em] sm:text-2xl sm:tracking-[0.3em]">MKSUKO</span>
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-5 text-sm">
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="inline-flex items-center gap-1 rounded p-1 hover:bg-black/5 sm:px-1 sm:py-0.5"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-5"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="M20 20l-3.5-3.5" />
            </svg>
            <span className="hidden sm:inline text-[10px] font-black uppercase tracking-widest">search</span>
          </button>
          
          <span className="hidden font-semibold sm:inline">EN</span>
          
          <Link 
            href={user ? "/profile" : "/login"} 
            className={`hidden rounded p-1 transition-colors hover:bg-black/5 sm:block ${user ? "text-black" : "text-zinc-600"}`} 
            aria-label={user ? "Profile" : "Account login"}
          >
            {user ? (
              /* Logged in icon: Filled user circle or initials */
              <div className="flex size-5 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white sm:size-6">
                {user.displayName ? user.displayName[0].toUpperCase() : user.email ? user.email[0].toUpperCase() : "U"}
              </div>
            ) : (
              /* Logged out icon: Outline user */
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="size-5 sm:size-6"
              >
                <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Z" />
                <path d="M3 21a9 9 0 0 1 18 0" />
              </svg>
            )}
          </Link>
          
          <Link 
            href="/profile/wishlist" 
            className="rounded p-1 hover:bg-black/5"
            aria-label="Wishlist"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-5 sm:size-6"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
            </svg>
          </Link>
          
          <Link href="/cart" className="relative rounded p-1 hover:bg-black/5" aria-label="Cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="size-5 sm:size-6"
            >
              <path d="M6 6h15l-1.5 9H7.5L6 6Z" />
              <path d="M6 6H4" />
              <circle cx="9" cy="20" r="1.5" />
              <circle cx="18" cy="20" r="1.5" />
            </svg>
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
      {open && (
        <>
          <div className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px]" />
          <div
            ref={panelRef}
            className="fixed left-0 top-0 z-50 h-full w-80 max-w-[85vw] translate-x-0 bg-white shadow-xl transition-transform"
            role="dialog"
            aria-modal="true"
          >
            <div className="flex items-center justify-between border-b px-4 py-3">
              <span className="text-base font-semibold">Menu</span>
              <button aria-label="Close" onClick={() => setOpen(false)} className="rounded p-1 hover:bg-black/5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <ul className="divide-y">
              {[
                { label: "NEW ARRIVALS", href: "/men" },
                { label: "MEN", href: "/men" },
                { label: "WOMEN", href: "/women" },
              ].map((item) => (
                <li key={item.label}>
                  {item.href ? (
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold tracking-wide hover:bg-black/[0.035]"
                    >
                      <span>{item.label}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </Link>
                  ) : (
                    <button className="flex w-full items-center justify-between px-5 py-4 text-left text-sm font-semibold tracking-wide hover:bg-black/[0.035]">
                      <span>{item.label}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-4">
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </button>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-auto border-t p-5">
              {user ? (
                <div className="space-y-4">
                  <Link 
                    href="/profile" 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-black"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    My Profile
                  </Link>
                  <Link 
                    href="/profile/orders" 
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-zinc-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                      <path d="M21 8l-2-2H5L3 8v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z" />
                      <path d="M3 8h18" />
                      <path d="M10 12h4" />
                    </svg>
                    Track Orders
                  </Link>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block rounded bg-black py-3 text-center text-xs font-bold uppercase tracking-[0.2em] text-white"
                >
                  LOG IN / SIGN UP
                </Link>
              )}
            </div>
          </div>
        </>
      )}
      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white animate-in fade-in duration-300">
          <div className="mx-auto max-w-7xl px-4 pt-4">
            <div className="flex items-center justify-between border-b-2 border-black pb-2">
              <div className="flex flex-1 items-center gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="size-6 text-zinc-400"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="M20 20l-3.5-3.5" />
                </svg>
                <input
                  autoFocus
                  type="text"
                  placeholder="SEARCH PRODUCTS, CATEGORIES..."
                  className="w-full bg-transparent text-xl font-black uppercase tracking-widest outline-none placeholder:text-zinc-200 sm:text-3xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={() => {
                  setIsSearchOpen(false);
                  setSearchQuery("");
                }}
                className="rounded-full p-2 hover:bg-zinc-100"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-8">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>

            {/* Search Results */}
            <div className="mt-8 grid grid-cols-1 gap-12 sm:grid-cols-2">
              {/* Products Section */}
              <div>
                <h3 className="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase mb-6">Products</h3>
                <div className="space-y-6">
                  {isSearching ? (
                    <div className="flex items-center gap-4 animate-pulse">
                      <div className="h-20 w-16 bg-zinc-100 rounded" />
                      <div className="space-y-2">
                        <div className="h-4 w-32 bg-zinc-100 rounded" />
                        <div className="h-3 w-20 bg-zinc-100 rounded" />
                      </div>
                    </div>
                  ) : searchResults.products.length > 0 ? (
                    searchResults.products.map((product) => (
                      <Link
                        key={product.id}
                        href={`/product/${product.slug || product.id}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="flex items-center gap-4 group"
                      >
                        <div className="h-20 w-16 overflow-hidden bg-zinc-100 rounded">
                          {product.images?.[0] ? (
                            <img src={product.images[0]} alt={product.name || product.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                          ) : product.image ? (
                            <img src={product.image} alt={product.name || product.title} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-zinc-100 text-[10px] font-bold text-zinc-400">NO IMG</div>
                          )}
                        </div>
                        <div>
                          <h4 className="font-black uppercase tracking-widest text-sm group-hover:underline">{product.name || product.title}</h4>
                          <p className="text-xs font-bold text-zinc-500 mt-1">₹{product.discountPrice || product.originalPrice}</p>
                        </div>
                      </Link>
                    ))
                  ) : searchQuery.length > 1 ? (
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest">No products found</p>
                  ) : (
                    <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest italic opacity-50">Type to search...</p>
                  )}
                </div>
              </div>

              {/* Categories & Suggestions Section */}
              <div>
                <h3 className="text-xs font-black tracking-[0.3em] text-zinc-400 uppercase mb-6">Categories</h3>
                <div className="space-y-4">
                  {searchResults.categories.length > 0 ? (
                    searchResults.categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/men?category=${cat.name.toLowerCase()}`}
                        onClick={() => setIsSearchOpen(false)}
                        className="block text-xl font-black uppercase tracking-tighter hover:text-zinc-500 transition-colors"
                      >
                        {cat.name}
                      </Link>
                    ))
                  ) : (
                    <div className="space-y-4 opacity-50">
                      <p className="text-xs font-bold tracking-widest uppercase">Popular Searches</p>
                      <div className="flex flex-wrap gap-2">
                        {['JEANS', 'T-SHIRTS', 'NEW ARRIVALS', 'BEST SELLERS'].map(tag => (
                          <button 
                            key={tag}
                            onClick={() => setSearchQuery(tag)}
                            className="px-4 py-2 border-2 border-zinc-100 text-[10px] font-black tracking-widest uppercase hover:border-black transition-colors"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

