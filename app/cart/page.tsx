'use client';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();

  const handleCheckout = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    router.push('/payment');
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="grid grid-cols-1 gap-3 rounded bg-zinc-100 p-3 text-xs text-zinc-700 sm:grid-cols-4">
        <div className="flex items-center gap-2">
          <span className="inline-block size-4 rounded border border-black/20" />
          Free 60-day returns on full-price orders
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block size-4 rounded border border-black/20" />
          Evening or day delivery possible
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block size-4 rounded border border-black/20" />
          In-store pick up and returns eligible for all orders
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block size-4 rounded border border-black/20" />
          100% secure payment
        </div>
      </div>

      <h1 className="mt-6 text-center text-3xl font-black uppercase tracking-tighter">Shopping Bag</h1>

      {cartCount === 0 ? (
        <div className="mt-10 text-center">
          <div className="mx-auto flex aspect-[16/9] w-full max-w-4xl items-center justify-center rounded border border-dashed border-zinc-300 bg-zinc-50 p-10">
            <p className="text-xl font-bold text-zinc-400 uppercase tracking-widest">Your Bag is Empty</p>
          </div>
          <Link href="/" className="mt-8 inline-block rounded-full bg-black px-10 py-4 text-sm font-black uppercase tracking-widest text-white transition-transform hover:scale-105">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_350px]">
          {/* Cart Items */}
          <div className="space-y-6">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-6 border-b border-zinc-100 pb-6">
                <div className="aspect-[3/4] w-32 flex-shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                  <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col justify-between py-1">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-black uppercase tracking-tight">{item.title}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id, item.size)}
                        className="text-zinc-400 hover:text-black transition-colors"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    <p className="mt-1 text-sm font-bold text-zinc-500 uppercase tracking-widest">Size: {item.size}</p>
                    <div className="mt-2 flex items-center gap-4">
                      <span className="text-sm font-bold text-zinc-500">Qty:</span>
                      <div className="flex items-center border border-zinc-200 rounded-lg overflow-hidden bg-white">
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, -1)}
                          className="px-3 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
                          </svg>
                        </button>
                        <span className="px-3 text-sm font-black min-w-[30px] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.size, 1)}
                          className="px-3 py-1 text-zinc-600 hover:bg-zinc-100 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="text-xl font-black">{item.price}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <aside className="h-fit rounded-3xl bg-zinc-50 p-8">
            <h2 className="text-xl font-black uppercase tracking-tight">Order Summary</h2>
            <div className="mt-6 space-y-4 border-b border-zinc-200 pb-6">
              <div className="flex justify-between text-sm font-bold text-zinc-600">
                <span>Subtotal</span>
                <span>₹{cart.reduce((acc, item) => acc + (parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity), 0)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-zinc-600">
                <span>Delivery</span>
                <span className="text-green-600">FREE</span>
              </div>
            </div>
            <div className="mt-6 flex justify-between text-xl font-black">
              <span>Total</span>
              <span>₹{cart.reduce((acc, item) => acc + (parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity), 0)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="mt-8 w-full rounded-full bg-black py-5 text-sm font-black uppercase tracking-widest text-white transition-transform active:scale-95 shadow-xl disabled:bg-zinc-400 disabled:scale-100"
            >
              Checkout Now
            </button>
          </aside>
        </div>
      )}

      <div className="mt-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-700 hover:text-black transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Continue shopping
        </Link>
      </div>
    </main>
  );
}
