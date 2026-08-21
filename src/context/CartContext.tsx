'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductType, CartItemType, CouponType } from '@/types';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface CartContextType {
  items: CartItemType[];
  coupon: CouponType | null;
  addToCart: (product: ProductType, quantity?: number, selectedColor?: string, selectedSize?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  taxAmount: number;
  grandTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [items, setItems] = useState<CartItemType[]>([]);
  const [coupon, setCoupon] = useState<CouponType | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load cart from localStorage or server
  useEffect(() => {
    if (user) {
      // Sync DB cart for logged-in user
      fetch('/api/cart')
        .then((res) => res.json())
        .then((data) => {
          if (data.items) setItems(data.items);
        })
        .catch(() => {});
    } else {
      // Guest cart in localStorage
      const saved = localStorage.getItem('easycart_guest_cart');
      if (saved) {
        try {
          setItems(JSON.parse(saved));
        } catch (e) {}
      }
    }
  }, [user]);

  // Save guest cart to localStorage
  useEffect(() => {
    if (!user) {
      localStorage.setItem('easycart_guest_cart', JSON.stringify(items));
    }
  }, [items, user]);

  const addToCart = async (product: ProductType, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    if (product.stock <= 0) {
      toast.error('Product is currently out of stock!');
      return;
    }

    if (user) {
      try {
        const res = await fetch('/api/cart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: product.id,
            quantity,
            selectedColor,
            selectedSize,
          }),
        });
        const data = await res.json();
        if (res.ok && data.items) {
          setItems(data.items);
          toast.success(`Added ${product.name} to cart!`);
          setIsCartOpen(true);
        }
      } catch (err) {
        toast.error('Failed to add item to cart');
      }
    } else {
      setItems((prev) => {
        const existingIndex = prev.findIndex(
          (item) =>
            item.productId === product.id &&
            item.selectedColor === (selectedColor || null) &&
            item.selectedSize === (selectedSize || null)
        );

        if (existingIndex > -1) {
          const updated = [...prev];
          updated[existingIndex].quantity += quantity;
          return updated;
        } else {
          const newItem: CartItemType = {
            id: 'temp_' + Date.now() + Math.random(),
            productId: product.id,
            product,
            selectedColor: selectedColor || null,
            selectedSize: selectedSize || null,
            quantity,
          };
          return [...prev, newItem];
        }
      });

      toast.success(`Added ${product.name} to cart!`);
      setIsCartOpen(true);
    }
  };

  const removeFromCart = async (itemId: string) => {
    if (user) {
      try {
        const res = await fetch(`/api/cart?itemId=${itemId}`, { method: 'DELETE' });
        const data = await res.json();
        if (res.ok && data.items) {
          setItems(data.items);
          toast.success('Item removed from cart');
        }
      } catch (err) {
        toast.error('Failed to remove item');
      }
    } else {
      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast.success('Item removed from cart');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    if (user) {
      try {
        const res = await fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ itemId, quantity }),
        });
        const data = await res.json();
        if (res.ok && data.items) {
          setItems(data.items);
        }
      } catch (err) {}
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === itemId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await fetch('/api/cart/clear', { method: 'POST' });
      } catch (err) {}
    }
    setItems([]);
    setCoupon(null);
    localStorage.removeItem('easycart_guest_cart');
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/coupons/validate?code=${encodeURIComponent(code)}`);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Invalid coupon code');
        return false;
      }

      if (subtotal < data.coupon.minOrderAmount) {
        toast.error(`Minimum order amount of $${data.coupon.minOrderAmount} required for this coupon`);
        return false;
      }

      setCoupon(data.coupon);
      toast.success(`Coupon "${data.coupon.code}" applied!`);
      return true;
    } catch (err) {
      toast.error('Failed to validate coupon');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    toast.success('Coupon removed');
  };

  // Computations
  const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  let discountAmount = 0;
  if (coupon) {
    if (coupon.discountType === 'PERCENTAGE') {
      discountAmount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maxDiscount && discountAmount > coupon.maxDiscount) {
        discountAmount = coupon.maxDiscount;
      }
    } else {
      discountAmount = coupon.discountValue;
    }
  }

  const shippingFee = subtotal >= 1499 || subtotal === 0 ? 0 : 149;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const taxAmount = Number((taxableAmount * 0.08).toFixed(0));
  const grandTotal = Number((taxableAmount + shippingFee + taxAmount).toFixed(0));
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        coupon,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyCoupon,
        removeCoupon,
        subtotal,
        discountAmount,
        shippingFee,
        taxAmount,
        grandTotal,
        itemCount,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
