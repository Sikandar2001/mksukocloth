'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '@/app/lib/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';

interface WishlistItem {
  id: string;
  slug: string;
  title: string;
  price: string;
  image: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  isInWishlist: (id: string) => boolean;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Sync with Firestore if logged in, else use localStorage
  useEffect(() => {
    if (user) {
      const q = query(collection(db, 'my favorite'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.data().productId, // Original product ID
          docId: doc.id, // Firestore document ID
          ...doc.data()
        })) as any[];
        setWishlist(items.map(i => ({ id: i.id, slug: i.slug, title: i.title, price: i.price, image: i.image })));
        setLoading(false);
      });
      return () => unsubscribe();
    } else {
      const saved = localStorage.getItem('snitch_wishlist');
      if (saved) setWishlist(JSON.parse(saved));
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('snitch_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const isInWishlist = (id: string) => wishlist.some(item => item.id === id);

  const toggleWishlist = async (item: WishlistItem) => {
    if (user) {
      const q = query(
        collection(db, 'my favorite'), 
        where('userId', '==', user.uid), 
        where('productId', '==', item.id)
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Remove from Firestore
        snapshot.forEach(async (document) => {
          await deleteDoc(doc(db, 'my favorite', document.id));
        });
      } else {
        // Add to Firestore
        await addDoc(collection(db, 'my favorite'), {
          userId: user.uid,
          productId: item.id,
          slug: item.slug,
          title: item.title,
          price: item.price,
          image: item.image,
          createdAt: new Date()
        });
      }
    } else {
      // Local storage logic
      setWishlist(prev => {
        const exists = prev.find(i => i.id === item.id);
        if (exists) return prev.filter(i => i.id !== item.id);
        return [...prev, item];
      });
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist, loading }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) throw new Error('useWishlist must be used within WishlistProvider');
  return context;
}
