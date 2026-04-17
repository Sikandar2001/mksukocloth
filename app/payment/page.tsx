'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';
import { useAuth } from '@/app/context/AuthContext';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function PaymentPage() {
  const { cart, cartCount, clearCart } = useCart();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const router = useRouter();

  const subtotal = cart.reduce((acc, item) => acc + (parseInt(item.price.replace(/[^\d]/g, '')) * item.quantity), 0);

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      // Create order documents for each item in the cart
      for (const item of cart) {
        await addDoc(collection(db, 'orders'), {
          userId: user.uid,
          userEmail: user.email,
          item: item.title,
          quantity: item.quantity,
          price: item.price,
          image: item.image,
          size: item.size,
          createdAt: serverTimestamp(),
          status: 'Processing',
          paymentMethod: paymentMethod,
          totalAmount: subtotal
        });
      }

      clearCart();
      router.push('/profile/orders');
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cartCount === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold uppercase">Your bag is empty</h2>
        <button onClick={() => router.push('/')} className="rounded-full bg-black px-8 py-3 text-sm font-bold text-white uppercase">Go Home</button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-black uppercase tracking-tighter text-center">Payment</h1>
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Payment Form */}
        <div className="space-y-8">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight mb-4">Select Payment Method</h2>
            <div className="space-y-3">
              <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="size-4 accent-black"
                />
                <span className="font-bold">Credit / Debit Card</span>
              </label>
              
              <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="upi" 
                  checked={paymentMethod === 'upi'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="size-4 accent-black"
                />
                <span className="font-bold">UPI / QR Code</span>
              </label>

              <label className={`flex items-center gap-4 p-4 border-2 rounded-2xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-black bg-zinc-50' : 'border-zinc-100 hover:border-zinc-200'}`}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="cod" 
                  checked={paymentMethod === 'cod'} 
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="size-4 accent-black"
                />
                <span className="font-bold">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-4">
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <input type="text" placeholder="Card Number" className="w-full p-4 border-2 border-zinc-100 rounded-xl focus:border-black outline-none transition-all" required />
                <div className="grid grid-cols-2 gap-4">
                  <input type="text" placeholder="MM/YY" className="p-4 border-2 border-zinc-100 rounded-xl focus:border-black outline-none transition-all" required />
                  <input type="text" placeholder="CVV" className="p-4 border-2 border-zinc-100 rounded-xl focus:border-black outline-none transition-all" required />
                </div>
              </div>
            )}
            
            <button 
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-black py-5 text-sm font-black uppercase tracking-widest text-white transition-all active:scale-95 shadow-xl disabled:bg-zinc-400"
            >
              {loading ? 'Processing...' : `Pay ₹${subtotal}`}
            </button>
          </form>
        </div>

        {/* Order Summary Recap */}
        <div className="bg-zinc-50 p-8 rounded-3xl h-fit">
          <h2 className="text-lg font-black uppercase tracking-tight mb-6">Order Summary</h2>
          <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4">
                <div className="size-16 rounded-lg overflow-hidden bg-white">
                  <img src={item.image} alt={item.title} className="size-full object-cover" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black uppercase tracking-tight">{item.title}</h4>
                  <p className="text-[10px] text-zinc-500 font-bold uppercase">Size: {item.size} | Qty: {item.quantity}</p>
                  <p className="text-xs font-bold mt-1">{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-zinc-200 pt-6 space-y-2">
            <div className="flex justify-between text-sm font-bold text-zinc-600">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm font-bold text-zinc-600">
              <span>Delivery</span>
              <span className="text-green-600">FREE</span>
            </div>
            <div className="flex justify-between text-xl font-black pt-4 border-t border-zinc-200">
              <span>Total</span>
              <span>₹{subtotal}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
