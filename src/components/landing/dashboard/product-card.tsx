import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { TProductData } from "../../../../zod/involve-asia";
import { getFallbackImage } from "../../../../data/images";

type ProductCardProps = {
  product: TProductData;
  index: number;
  imageErrorById: Record<number, boolean>;
  onImageError: (id: number) => void;
};

export const ProductCard = ({
  product,
  index,
  imageErrorById,
  onImageError,
}: ProductCardProps) => {
  const isHigh = parseFloat(product.commission_rate) >= 0.1;
  const primaryCandidate = product.shop_image?.trim()?.length
    ? product.shop_image
    : (product.shop_banner?.[0] || "");
  const useFallback = !primaryCandidate || imageErrorById[product.shop_id] === true;
  const imageSrc = useFallback ? getFallbackImage(index) : primaryCandidate;

  return (
    <Card className="bg-background/10 backdrop-blur border-white/10 overflow-hidden hover:border-white/30 transition-colors">
      <div className="relative aspect-[4/3] bg-white/5">
        <Image
          src={imageSrc}
          alt={product.shop_name}
          fill
          className="object-cover"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          onError={() => onImageError(product.shop_id)}
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base text-white line-clamp-2 min-h-[2.75rem]">
          {product.shop_name}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mt-2 text-sm text-white/70 line-clamp-1">
          {product.offer_name}
        </div>
        <div className="mt-1 text-sm text-white/70">
          {product.shop_type} • {product.country}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <Badge
            className={
              isHigh
                ? "bg-teal-500/20 text-teal-300 border border-teal-500/30"
                : "bg-white/10 text-white/80 border border-white/20"
            }
          >
            {Math.round(parseFloat(product.commission_rate) * 100)}%
            &nbsp;commission
          </Badge>
        </div>
        <div className="mt-4 flex gap-2">
          <Button className="flex-1" asChild>
            <a
              href={product.tracking_link || "#"}
              target="_blank"
              rel="noreferrer noopener"
              className="hover:bg-white/5"
            >
              View
            </a>
          </Button>
          <Button variant="secondary">Add</Button>
        </div>
      </CardContent>
    </Card>
  );
};
