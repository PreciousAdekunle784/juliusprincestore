"use client";
import { useEffect } from "react";
import { useCart } from "./cart-context";

export function ClearCart() {
  const { clear } = useCart();
  useEffect(() => { clear(); }, [clear]);
  return null;
}
