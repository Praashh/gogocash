"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TProductData } from "../../../../zod/involve-asia";
import { useCart } from "../../../../contexts/cart";
import { ShoppingCart, Check } from "lucide-react";

export const AddToCartButton = ({ product }: { product: TProductData }) => {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState<boolean>(false);

  const handleAddToCart = () => {
    addItem(product);
    setAdded(true);
    openCart();

    // Show added feedback
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <Button
      onClick={handleAddToCart}
      variant={"secondary"}
      className={`w-12 sm:w-auto transition-all duration-300 group overflow-hidden border shadow-lg`}
      size="sm"
    >
      {added ? (
        <>
          <Check className="h-4 w-4 sm:mr-1" />
          <span className="hidden sm:inline">Added!</span>
        </>
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 sm:mr-1 transition-transform group-hover:scale-110" />
          <span className="hidden sm:inline">Add to Cart</span>
        </>
      )}
    </Button>
  );
};
