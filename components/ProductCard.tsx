"use client";
type Product = {
  id: string;
  title: string;
  price: string;
  image: string;
  hoverImage?: string;
  swatches?: string[];
  colorsText?: string;
  href?: string;
};

import Link from "next/link";
import { useWishlist } from "@/app/context/WishlistContext";

export default function ProductCard({ product }: { product: Product }) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const isFavorite = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: product.id,
      slug: product.href?.split('/').pop() || '',
      title: product.title,
      price: product.price,
      image: product.image
    });
  };

  return (
    <div className="group relative">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F5F5F5] rounded-none">
        {product.href ? (
          <Link href={product.href} className="block h-full">
            <img
              src={product.image}
              alt={product.title}
              className="h-full w-full object-cover"
            />
          </Link>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            className="h-full w-full object-cover"
          />
        )}
        
        {/* Wishlist Button - Top Right Clean Outline */}
        <button 
          onClick={handleToggleWishlist}
          className={`absolute right-3 top-3 p-1.5 transition-all hover:scale-110 ${isFavorite ? 'text-red-500' : 'text-black'}`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill={isFavorite ? "currentColor" : "none"} 
            viewBox="0 0 24 24" 
            strokeWidth={1.2} 
            stroke="currentColor" 
            className="size-7"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Cart Icon - Bottom Right (New) */}
        {product.href && (
          <Link 
            href={product.href}
            className="absolute right-3 bottom-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-black hover:scale-110 transition-transform shadow-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.2} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
          </Link>
        )}
      </div>

      <div className="mt-3 px-0.5">
        <div className="flex flex-col gap-0.5">
          {product.href ? (
            <Link href={product.href} className="block truncate text-[15px] font-medium text-zinc-800 hover:text-black">
              {product.title}
            </Link>
          ) : (
            <div className="truncate text-[15px] font-medium text-zinc-800">{product.title}</div>
          )}
          <div className="text-[16px] font-bold text-black">
            {product.price}
          </div>
        </div>
        
        {product.swatches && product.swatches.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {product.swatches.slice(0, 3).map((color, i) => (
              <button
                key={i}
                className="size-4 border border-zinc-200 ring-1 ring-transparent ring-offset-1 transition-all hover:ring-zinc-400"
                style={{ backgroundColor: color }}
              />
            ))}
            {product.swatches.length > 3 && (
              <span className="text-[12px] font-medium text-zinc-500 ml-0.5">+{product.swatches.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
