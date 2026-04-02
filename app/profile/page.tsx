'use client';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/app/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user) {
      const fetchUserData = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUserData(docSnap.data());
        }
      };
      fetchUserData();
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-2 border-black border-t-transparent" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between border-b pb-8 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">My Profile</h1>
          <p className="mt-2 text-zinc-600">
            Welcome back, <span className="font-bold text-black">{user.displayName || user.email}</span>
          </p>
        </div>
        <button
          onClick={logout}
          className="mt-6 flex items-center gap-2 rounded border border-black px-6 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-black hover:text-white sm:mt-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          Logout
        </button>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-1">
          <nav className="flex flex-col space-y-1">
            <Link
              href="/profile"
              className="flex items-center gap-3 rounded-md bg-zinc-100 px-4 py-3 text-sm font-bold uppercase tracking-wide text-black"
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
            <h2 className="text-xl font-bold uppercase tracking-tight">Personal Information</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Name</label>
                <div className="mt-1 font-medium">{user.displayName || 'Not provided'}</div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Email Address</label>
                <div className="mt-1 font-medium">{user.email}</div>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Phone</label>
                <div className="mt-1 font-medium">
                  {userData?.phone || <span className="text-zinc-400 italic">No phone number linked</span>}
                </div>
              </div>
            </div>
          </section>

          <section className="mt-8 rounded-lg border p-8 shadow-sm">
            <h2 className="text-xl font-bold uppercase tracking-tight">Recent Orders</h2>
            <div className="mt-8 flex flex-col items-center justify-center py-10 text-center text-zinc-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mb-4 size-12 text-zinc-300">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p className="text-sm font-medium">You haven't placed any orders yet.</p>
              <Link href="/" className="mt-4 text-xs font-bold uppercase tracking-widest text-black underline underline-offset-4">
                Start Shopping
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
