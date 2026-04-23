'use client';
import { useWishlist } from '@/app/context/WishlistContext';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';

export default function WishlistPage() {
  const { wishlist, loading } = useWishlist();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase">My Wishlist</h1>
        <p className="mt-2 text-zinc-600">Items you have saved for later.</p>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Account Details
            </Link>
            <Link
              href="/profile/orders"
              className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <path d="M21 8l-2-2H5L3 8v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z" />
                <path d="M3 8h18" />
                <path d="M10 12h4" />
              </svg>
              Track Orders
            </Link>
            <Link
              href="/profile/addresses"
              className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Delivery Addresses
            </Link>
            <Link
              href="/profile/wishlist"
              className="flex items-center gap-3 rounded-md bg-zinc-100 px-4 py-3 text-sm font-bold uppercase tracking-wide text-black"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z" />
              </svg>
              My Wishlist
            </Link>
          </nav>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-2">
          {wishlist.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {wishlist.map((item) => (
                <ProductCard 
                  key={item.id} 
                  product={{
                    id: item.id,
                    title: item.title,
                    price: item.price,
                    image: item.image,
                    href: `/product/${item.slug}`
                  }} 
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-20 text-center text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 size-16 text-zinc-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <p className="text-lg font-medium">Your wishlist is empty.</p>
              <Link href="/" className="mt-4 text-sm font-bold uppercase tracking-widest text-black underline underline-offset-4">
                Discover Products
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
