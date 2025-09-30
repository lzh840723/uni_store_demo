'use client';

import { create } from 'zustand';
import { addToCart, createCart, fetchCart, type Cart } from '../api/commerce';

const STORAGE_KEY = 'unistore.cart.id';

type CartState = {
  cartId: string | null;
  cart: Cart | null;
  loading: boolean;
  ensureCart: () => Promise<string>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  hydrate: () => Promise<void>;
  reset: () => void;
};

export const useCartStore = create<CartState>((set, get) => ({
  cartId: null,
  cart: null,
  loading: false,
  ensureCart: async () => {
    const existing = get().cartId;
    if (existing) return existing;
    set({ loading: true });
    try {
      const response = await createCart();
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, response.cartId);
      }
      set({
        cartId: response.cartId,
        loading: false,
        cart: {
          id: response.cartId,
          status: 'OPEN',
          totalCents: response.totalCents,
          currency: 'USD',
          items: []
        } as Cart
      });
      return response.cartId;
    } finally {
      set({ loading: false });
    }
  },
  addItem: async (productId, quantity = 1) => {
    const cartId = await get().ensureCart();
    set({ loading: true });
    try {
      const updated = await addToCart(cartId, productId, quantity);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(STORAGE_KEY, cartId);
      }
      set({ cart: updated, cartId: updated.id, loading: false });
    } finally {
      set({ loading: false });
    }
  },
  hydrate: async () => {
    const stored = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (!stored) return;
    try {
      const cart = await fetchCart(stored);
      set({ cartId: stored, cart });
    } catch (error) {
      console.warn('[cart] failed to hydrate', error);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  },
  reset: () => set({ cartId: null, cart: null })
}));
