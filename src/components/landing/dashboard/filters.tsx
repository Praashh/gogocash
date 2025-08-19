import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useResponsive } from "@/hooks/useResponsive";

type FiltersProps = {
  categories: string[];
  sellers: string[];
  countries: string[];
  searchValue: string;
  category: string;
  seller: string;
  country: string;
  minPrice: string;
  maxPrice: string;
  minCommission: string;
  inStock: boolean;
  prime: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSellerChange: (value: string) => void;
  onCountryChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
  onMinCommissionChange: (value: string) => void;
  onInStockChange: (value: boolean) => void;
  onPrimeChange: (value: boolean) => void;
  onResetFilters: () => void;
};

export const Filters = ({
  categories,
  sellers,
  countries,
  category,
  seller,
  country,
  minPrice,
  maxPrice,
  minCommission,
  inStock,
  prime,
  onCategoryChange,
  onSellerChange,
  onCountryChange,
  onMinPriceChange,
  onMaxPriceChange,
  onMinCommissionChange,
  onInStockChange,
  onPrimeChange,
  onResetFilters,
}: FiltersProps) => {
  const { isMobile } = useResponsive();

  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs text-white/70">Category</label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-transparent text-white border-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black text-white border-white/20">
            {categories.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-white/70">Seller</label>
        <Select value={seller} onValueChange={onSellerChange}>
          <SelectTrigger className="bg-transparent text-white border-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black text-white border-white/20">
            {sellers.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-white/70">Country</label>
        <Select value={country} onValueChange={onCountryChange}>
          <SelectTrigger className="bg-transparent text-white border-white/20">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-black text-white border-white/20">
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Separator className="bg-white/10" />
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <label className="text-xs text-white/70">Min Price</label>
          <Input
            inputMode="numeric"
            value={minPrice}
            onChange={(e) => onMinPriceChange(e.target.value)}
            placeholder="0"
            className="bg-transparent text-white border-white/20"
            size={isMobile ? 1 : undefined}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Max Price</label>
          <Input
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => onMaxPriceChange(e.target.value)}
            placeholder="1000"
            className="bg-transparent text-white border-white/20"
            size={isMobile ? 1 : undefined}
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-white/70">Min Commission %</label>
        <Input
          inputMode="numeric"
          value={minCommission}
          onChange={(e) => onMinCommissionChange(e.target.value)}
          placeholder="0"
          className="bg-transparent text-white border-white/20"
          size={isMobile ? 1 : undefined}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="stock"
          checked={inStock}
          className="border-white/50"
          onCheckedChange={(v) => onInStockChange(Boolean(v))}
        />
        <label htmlFor="stock" className="text-sm text-white">
          In stock
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="prime"
          className="border-white/50"
          checked={prime}
          onCheckedChange={(v) => onPrimeChange(Boolean(v))}
        />
        <label htmlFor="prime" className="text-sm text-white">
          Fast shipping
        </label>
      </div>
      <Button variant="secondary" className="w-full" onClick={onResetFilters}>
        Reset Filters
      </Button>
    </div>
  );
};
