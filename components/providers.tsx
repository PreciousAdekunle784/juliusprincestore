"use client";

import { CartProvider } from "@/components/cart/cart-context";
import { WishlistProvider } from "@/components/wishlist/wishlist-context";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CompareProvider } from "@/components/compare/compare-context";
import { CompareTray } from "@/components/compare/compare-tray";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <WishlistProvider>
        <CompareProvider>
          {children}
          <CartDrawer />
          <CompareTray />
        </CompareProvider>
      </WishlistProvider>
    </CartProvider>
  );
}
