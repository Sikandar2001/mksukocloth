'use client';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { db } from '@/app/lib/firebase';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface Address {
  id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export default function AddressesPage() {
  const { user, loading } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }

    if (user) {
      const fetchAddresses = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setAddresses(docSnap.data().addresses || []);
        }
      };
      fetchAddresses();
    }
  }, [user, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);

    try {
      const userRef = doc(db, 'users', user.uid);
      const newAddress: Address = {
        ...formData,
        id: editingId || Math.random().toString(36).substr(2, 9),
        isDefault: addresses.length === 0,
      };

      if (editingId) {
        // For simplicity, remove old and add new
        const oldAddress = addresses.find(a => a.id === editingId);
        if (oldAddress) {
          await updateDoc(userRef, {
            addresses: arrayRemove(oldAddress)
          });
        }
      }

      await updateDoc(userRef, {
        addresses: arrayUnion(newAddress)
      });

      // Refresh local state
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        setAddresses(docSnap.data().addresses || []);
      }

      setShowForm(false);
      setEditingId(null);
      setFormData({ fullName: '', phone: '', addressLine: '', city: '', state: '', pincode: '' });
    } catch (error) {
      console.error("Error saving address:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (address: Address) => {
    if (!user) return;
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        addresses: arrayRemove(address)
      });
      setAddresses(prev => prev.filter(a => a.id !== address.id));
    } catch (error) {
      console.error("Error deleting address:", error);
    }
  };

  const handleEdit = (address: Address) => {
    setFormData({
      fullName: address.fullName,
      phone: address.phone,
      addressLine: address.addressLine,
      city: address.city,
      state: address.state,
      pincode: address.pincode,
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setFormData({ ...formData, phone: value });
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData({ ...formData, pincode: value });
  };

  if (loading) return null;
  if (!user) return null;

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 font-lexend">
      <div className="flex flex-col items-center justify-between border-b pb-8 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight uppercase">My Profile</h1>
          <p className="mt-2 text-zinc-600">
            Manage your <span className="font-bold text-black">Delivery Addresses</span>
          </p>
        </div>
        <Link
          href="/profile"
          className="mt-6 flex items-center gap-2 rounded border border-black px-6 py-2.5 text-sm font-bold uppercase tracking-widest transition-colors hover:bg-black hover:text-white sm:mt-0"
        >
          Back to Profile
        </Link>
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
              className="flex items-center gap-3 rounded-md bg-zinc-100 px-4 py-3 text-sm font-bold uppercase tracking-wide text-black"
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
          {!showForm ? (
            <section className="rounded-lg border p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold uppercase tracking-tight">Saved Addresses</h2>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-black text-white px-6 py-2 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
                >
                  Add New Address
                </button>
              </div>

              {addresses.length === 0 ? (
                <div className="py-10 text-center text-zinc-500">
                  <p className="text-sm font-medium">No addresses saved yet.</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {addresses.map((address) => (
                    <div key={address.id} className="relative rounded-lg border p-6 hover:border-black transition-colors">
                      {address.isDefault && (
                        <span className="absolute top-4 right-4 bg-zinc-100 px-2 py-1 text-[10px] font-black uppercase tracking-tighter">Default</span>
                      )}
                      <h3 className="font-bold uppercase tracking-tight">{address.fullName}</h3>
                      <p className="mt-2 text-sm text-zinc-600 leading-relaxed">
                        {address.addressLine}<br />
                        {address.city}, {address.state} - {address.pincode}<br />
                        Phone: {address.phone}
                      </p>
                      <div className="mt-6 flex gap-4">
                        <button
                          onClick={() => handleEdit(address)}
                          className="text-xs font-bold uppercase tracking-widest text-black underline underline-offset-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(address)}
                          className="text-xs font-bold uppercase tracking-widest text-red-600 underline underline-offset-4"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ) : (
            <section className="rounded-lg border p-8 shadow-sm animate-reveal">
              <h2 className="text-xl font-bold uppercase tracking-tight mb-8">
                {editingId ? 'Edit Address' : 'Add New Address'}
              </h2>
              <form onSubmit={handleSubmit} className="grid gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Full Name <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="mt-1 w-full border-b border-zinc-200 py-2 focus:border-black focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Phone Number <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="tel"
                    pattern="[0-9]{10}"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    className="mt-1 w-full border-b border-zinc-200 py-2 focus:border-black focus:outline-none transition-colors"
                    placeholder="10 digit number"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Pincode <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    pattern="[0-9]{6}"
                    value={formData.pincode}
                    onChange={handlePincodeChange}
                    className="mt-1 w-full border-b border-zinc-200 py-2 focus:border-black focus:outline-none transition-colors"
                    placeholder="6 digit number"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">Address (Area and Street) <span className="text-red-500">*</span></label>
                  <textarea
                    required
                    rows={3}
                    value={formData.addressLine}
                    onChange={(e) => setFormData({ ...formData, addressLine: e.target.value })}
                    className="mt-1 w-full border-b border-zinc-200 py-2 focus:border-black focus:outline-none transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">City/District/Town <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="mt-1 w-full border-b border-zinc-200 py-2 focus:border-black focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">State <span className="text-red-500">*</span></label>
                  <input
                    required
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="mt-1 w-full border-b border-zinc-200 py-2 focus:border-black focus:outline-none transition-colors"
                  />
                </div>
                <div className="sm:col-span-2 flex gap-4 mt-4">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-black text-white px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Address'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(null);
                      setFormData({ fullName: '', phone: '', addressLine: '', city: '', state: '', pincode: '' });
                    }}
                    className="border border-black px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
