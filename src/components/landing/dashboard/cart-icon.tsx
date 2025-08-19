"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../../../../contexts/cart";
import { useResponsive } from "@/hooks/useResponsive";

export const CartIcon = () => {
  const { totalItems, toggleCart } = useCart();
  const { isMobile } = useResponsive();

  return (
    <Button
      variant="ghost"
      size={isMobile ? "icon" : "default"}
      className="relative"
      onClick={toggleCart}
    >
      <ShoppingCart size={isMobile ? 20 : 24} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-teal-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
      {!isMobile && <span className="ml-2">Cart</span>}
    </Button>
  );
};
