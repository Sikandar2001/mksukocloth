'use client';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/app/lib/firebase';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';

interface OrderItem {
  id: string;
  item: string;
  quantity: number;
  price: string;
  image: string;
  size: string;
  status: string;
  createdAt: any;
}

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [fetching, setFetching] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      const fetchOrders = async () => {
        try {
          const q = query(
            collection(db, 'orders'),
            where('userId', '==', user.uid)
            // Removed orderBy to avoid index requirement
          );
          const querySnapshot = await getDocs(q);
          let ordersData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as OrderItem[];
          
          // Sort in memory instead
          ordersData.sort((a, b) => {
            const dateA = a.createdAt?.toDate ? a.createdAt.toDate() : new Date(0);
            const dateB = b.createdAt?.toDate ? b.createdAt.toDate() : new Date(0);
            return dateB.getTime() - dateA.getTime();
          });

          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setFetching(false);
        }
      };
      fetchOrders();
    }
  }, [user, loading, router]);

  if (loading || (user && fetching)) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="border-b pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight uppercase">Track Orders</h1>
        <p className="mt-2 text-zinc-600">Track and manage your recent purchases.</p>
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
              className="flex items-center gap-3 rounded-md bg-zinc-100 px-4 py-3 text-sm font-bold uppercase tracking-wide text-black"
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
              className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-bold uppercase tracking-wide text-zinc-500 hover:bg-zinc-50 hover:text-black transition-colors"
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
          <section className="rounded-lg border p-8 shadow-sm">
            <h2 className="text-xl font-bold uppercase tracking-tight">Order Status</h2>
            <div className="mt-8 space-y-6">
              {orders.length > 0 ? (
                orders.map((order) => (
                  <div key={order.id} className="rounded-md border border-zinc-200 p-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Order ID</p>
                        <p className="font-bold text-xs">{order.id}</p>
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">Placed on</p>
                        <p className="font-medium text-sm">
                          {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Recent'}
                        </p>
                      </div>
                      <div>
                        <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-blue-600">
                          {order.status}
                        </span>
                      </div>
                    </div>
                    <div className="mt-6 flex items-center gap-4">
                      <div className="size-20 flex-shrink-0 overflow-hidden rounded bg-zinc-100">
                        <img src={order.image} alt={order.item} className="h-full w-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase">{order.item}</p>
                        <p className="text-xs text-zinc-500">Size: {order.size} | Qty: {order.quantity}</p>
                        <p className="mt-1 text-sm font-bold">{order.price}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center text-zinc-500">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 size-12 text-zinc-300">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p className="text-sm font-medium">No orders found.</p>
                  <Link href="/" className="mt-4 text-xs font-bold uppercase tracking-widest text-black underline underline-offset-4">
                    Start Shopping
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
