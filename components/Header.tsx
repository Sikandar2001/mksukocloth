"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/app/context/CartContext";
import { useAuth } from "@/app/context/AuthContext";

export default function Header() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (!panelRef.current) return;
      if (open && !panelRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

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
          <button className="inline-flex items-center gap-1 rounded p-1 hover:bg-black/5 sm:px-1 sm:py-0.5">
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
            <span className="hidden sm:inline">search</span>
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
                { label: "JEANS", href: "/men" },
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
    </header>
  );
}

