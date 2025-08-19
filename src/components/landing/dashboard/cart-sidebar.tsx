"use client";

import { Button } from "@/components/ui/button";
import { X, ShoppingCart } from "lucide-react";
import { useCart } from "../../../../contexts/cart";
import { useResponsive } from "@/hooks/useResponsive";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CartItemCard } from "./cart-item-card";

export const CartSidebar = () => {
  const { items, totalPrice, clearCart, isOpen, closeCart } = useCart();
  const { isMobile } = useResponsive();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeCart}
      />

      <div
        className={`absolute right-0 top-0 h-full w-full ${isMobile ? "max-w-full" : "max-w-md"} bg-black border-l border-white/20 shadow-lg`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-white/20">
            <h2 className="text-xl font-semibold">Shopping Cart</h2>
            <Button variant="ghost" size="icon" onClick={closeCart}>
              <X size={20} />
            </Button>
          </div>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center p-8">
              <div className="text-center text-white">
                <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                <p>Your cart is empty</p>
                <p className="text-sm mt-2">Add some products to get started</p>
              </div>
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {items.map((item) => (
                    <CartItemCard key={item.shop_id} item={item} />
                  ))}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-white/20">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-medium">Total:</span>
                  <span className="text-lg font-semibold text-teal-400">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1 text-black"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                  <Button className="flex-1 bg-teal-500 hover:bg-teal-600">
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
