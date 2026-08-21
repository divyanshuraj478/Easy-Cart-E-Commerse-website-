'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductType } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface WishlistContextType {
  wishlist: ProductType[];
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (product: ProductType) => void;
  removeFromWishlist: (productId: string) => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<ProductType[]>([]);

  useEffect(() => {
    if (user) {
      fetch('/api/wishlist')
        .then((res) => res.json())
        .then((data) => {
          if (data.products) setWishlist(data.products);
        })
        .catch(() => {});
    } else {
      const saved = localStorage.getItem('easycart_guest_wishlist');
      if (saved) {
        try {
          setWishlist(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      localStorage.setItem('easycart_guest_wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, user]);

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  const toggleWishlist = async (product: ProductType) => {
    const exists = isInWishlist(product.id);

    if (user) {
      try {
        if (exists) {
          const res = await fetch(`/api/wishlist?productId=${product.id}`, { method: 'DELETE' });
          const data = await res.json();
          if (res.ok) {
            setWishlist(data.products || []);
            toast.success(`Removed ${product.name} from wishlist`);
          }
        } else {
          const res = await fetch('/api/wishlist', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId: product.id }),
          });
          const data = await res.json();
          if (res.ok) {
            setWishlist(data.products || []);
            toast.success(`Added ${product.name} to wishlist! ❤️`);
          }
        }
      } catch (err) {
        toast.error('Failed to update wishlist');
      }
    } else {
      if (exists) {
        setWishlist((prev) => prev.filter((p) => p.id !== product.id));
        toast.success(`Removed ${product.name} from wishlist`);
      } else {
        setWishlist((prev) => [...prev, product]);
        toast.success(`Added ${product.name} to wishlist! ❤️`);
      }
    }
  };

  const removeFromWishlist = (productId: string) => {
    const prod = wishlist.find((p) => p.id === productId);
    if (prod) {
      toggleWishlist(prod);
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlist, isInWishlist, toggleWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
