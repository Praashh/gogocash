import { TProductData } from "../../../../zod/involve-asia";
import { ProductCard } from "./product-card";
import { SkeletonCard } from "./product-card-skeleton";

type ProductGridProps = {
  products: TProductData[];
  isLoading: boolean;
  itemsPerPage: number;
  imageErrorById: Record<number, boolean>;
  onImageError: (id: number) => void;
};

export const ProductGrid = ({
  products,
  isLoading,
  itemsPerPage,
  imageErrorById,
  onImageError,
}: ProductGridProps) => {
  console.log(isLoading)
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: itemsPerPage }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="col-span-full text-center py-10 text-white/70">
        No products match your filters. Try adjusting your search or filters.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {products.map((product, index) => (
        <ProductCard
          key={product.shop_id}
          product={product}
          index={index}
          imageErrorById={imageErrorById}
          onImageError={onImageError}
        />
      ))}
    </div>
  );
};