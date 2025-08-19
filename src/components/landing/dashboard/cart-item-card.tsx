"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Plus, Minus, ShoppingCart } from "lucide-react";
import { CartItem, useCart } from "../../../../contexts/cart";
import Image from "next/image";
import { getFallbackImage } from "../../../../data/images";

export const CartItemCard = ({ item }: { item: CartItem }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <Card className="bg-background/10 backdrop-blur border-white/10 p-3 text-white">
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-16 h-16 bg-white/10 rounded-md flex items-center justify-center">
          {item.shop_image ? (
            <Image
              src={getFallbackImage(10)}
              alt={item.offer_name}
              className="w-full h-full object-cover rounded-md"
            />
          ) : (
            <ShoppingCart size={24} className="text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate text-white">
            {item.shop_name}
          </h3>
          <p className="text-white text-sm font-semibold">
            ${parseFloat(item.commission_rate).toFixed(2)}
          </p>

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center border border-white/20 rounded-md">
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => updateQuantity(item.shop_id, item.quantity - 1)}
              >
                <Minus size={14} />
              </Button>

              <span className="px-2 text-sm min-w-[2rem] text-center">
                {item.quantity}
              </span>

              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7"
                onClick={() => updateQuantity(item.shop_id, item.quantity + 1)}
              >
                <Plus size={14} />
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-400/10"
              onClick={() => removeItem(item.shop_id)}
            >
              <X size={14} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
