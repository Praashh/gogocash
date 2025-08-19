"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TProductData } from "../../../../zod/involve-asia";
import { Filters } from "./filters";
import { ProductGrid } from "./product-grid";
import { CustomPagination } from "./pagination";
import { useResponsive } from "@/hooks/useResponsive";

type SortKey =
  | "relevance"
  | "best"
  | "price-asc"
  | "price-desc"
  | "commission-desc";

export const ProductFeed = ({
  initialProducts,
  isLoading,
}: {
  initialProducts: TProductData[];
  isLoading: boolean;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isMobile, isTablet } = useResponsive();

  const [searchValue, setSearchValue] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("All");
  const [seller, setSeller] = useState<string>("All");
  const [country, setCountry] = useState<string>("All");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minCommission, setMinCommission] = useState<string>("");
  const [inStock, setInStock] = useState<boolean>(false);
  const [prime, setPrime] = useState<boolean>(false);
  const [sort, setSort] = useState<SortKey>("relevance");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [imageErrorById, setImageErrorById] = useState<Record<number, boolean>>(
    {},
  );

  const itemsPerPage = isMobile ? 8 : isTablet ? 9 : 12;

  // Debounce search input (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchValue]);

  // Initialize state from URL query params
  useEffect(() => {
    const getString = (key: string, fallback: string) =>
      searchParams.get(key) ?? fallback;
    const getBoolean = (key: string, fallback: boolean) => {
      const v = searchParams.get(key);
      return v === null ? fallback : v === "true";
    };
    const getNumber = (key: string, fallback: number) => {
      const v = searchParams.get(key);
      if (v === null) return fallback;
      const n = Number(v);
      return Number.isNaN(n) ? fallback : n;
    };

    setSearchValue(getString("q", ""));
    setCategory(getString("category", "All"));
    setSeller(getString("seller", "All"));
    setCountry(getString("country", "All"));
    setMinPrice(getString("minPrice", ""));
    setMaxPrice(getString("maxPrice", ""));
    setMinCommission(getString("minCommission", ""));
    setInStock(getBoolean("inStock", false));
    setPrime(getBoolean("prime", false));
    setSort((getString("sort", "relevance") as SortKey) || "relevance");
    setCurrentPage(getNumber("page", 1));
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set("q", debouncedQuery);
    if (category && category !== "All") params.set("category", category);
    if (seller && seller !== "All") params.set("seller", seller);
    if (country && country !== "All") params.set("country", country);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (minCommission) params.set("minCommission", minCommission);
    if (inStock) params.set("inStock", String(inStock));
    if (prime) params.set("prime", String(prime));
    if (sort && sort !== "relevance") params.set("sort", sort);
    if (currentPage && currentPage !== 1)
      params.set("page", String(currentPage));

    const search = params.toString();
    const href = search ? `${pathname}?${search}` : pathname;
    router.replace(href);
  }, [
    debouncedQuery,
    category,
    seller,
    country,
    minPrice,
    maxPrice,
    minCommission,
    inStock,
    prime,
    sort,
    currentPage,
    pathname,
    router,
  ]);

  // Memoized filter options
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(initialProducts.map((p) => p.shop_type)),
    );
    return ["All", ...uniqueCategories];
  }, [initialProducts]);

  const sellers = useMemo(() => {
    const uniqueSellers = Array.from(
      new Set(initialProducts.map((p) => p.shop_name)),
    );
    return ["All", ...uniqueSellers];
  }, [initialProducts]);

  const countries = useMemo(() => {
    const uniqueCountries = Array.from(
      new Set(initialProducts.map((p) => p.country)),
    );
    return ["All", ...uniqueCountries];
  }, [initialProducts]);

  // Filter and sort products
  const sorted = useMemo(() => {
    const filtered = initialProducts.filter((p) => {
      // Search query filter (matches against multiple fields)
      if (debouncedQuery) {
        const searchQuery = debouncedQuery.toLowerCase();
        const productText =
          `${p.shop_name} ${p.offer_name} ${p.shop_type} ${p.country}`.toLowerCase();
        if (!productText.includes(searchQuery)) return false;
      }

      // Other filters
      if (category !== "All" && p.shop_type !== category) return false;
      if (seller !== "All" && p.shop_name !== seller) return false;
      if (country !== "All" && p.country !== country) return false;
      if (minPrice && parseFloat(p.commission_rate) < parseFloat(minPrice))
        return false;
      if (maxPrice && parseFloat(p.commission_rate) > parseFloat(maxPrice))
        return false;
      if (
        minCommission &&
        parseFloat(p.commission_rate) < parseFloat(minCommission)
      )
        return false;

      return true;
    });

    // Sorting logic
    switch (sort) {
      case "price-asc":
        return filtered.sort(
          (a, b) =>
            parseFloat(a.commission_rate) - parseFloat(b.commission_rate),
        );
      case "price-desc":
        return filtered.sort(
          (a, b) =>
            parseFloat(b.commission_rate) - parseFloat(a.commission_rate),
        );
      case "commission-desc":
        return filtered.sort(
          (a, b) =>
            parseFloat(b.commission_rate) - parseFloat(a.commission_rate),
        );
      default:
        return filtered;
    }
  }, [
    initialProducts,
    debouncedQuery,
    category,
    seller,
    country,
    minPrice,
    maxPrice,
    minCommission,
    sort,
  ]);

  // Pagination logic
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sorted.slice(startIndex, endIndex);

  // Keep page in valid range
  useEffect(() => {
    if (totalPages === 0) {
      if (currentPage !== 1) setCurrentPage(1);
      return;
    }
    if (currentPage < 1) setCurrentPage(1);
    else if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const handleImageError = (id: number) => {
    setImageErrorById((prev) => ({ ...prev, [id]: true }));
  };

  const handleResetFilters = () => {
    setSearchValue("");
    setCategory("All");
    setSeller("All");
    setCountry("All");
    setMinPrice("");
    setMaxPrice("");
    setMinCommission("");
    setInStock(false);
    setPrime(false);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#031416] to-black" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_300px_at_center_top,rgba(45,212,191,0.20),transparent_60%)]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h1 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-0">
            Product Feed
          </h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <Input
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full sm:w-56 bg-transparent text-white border-white/20"
            />
            <div className="flex gap-2">
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="w-full sm:w-48 bg-transparent text-white border-white/20">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-black text-white border-white/20">
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="best">Best sellers</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="commission-desc">
                    Commission: High to Low
                  </SelectItem>
                </SelectContent>
              </Select>
              <div className="sm:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button
                      variant="secondary"
                      size={isMobile ? "sm" : "default"}
                    >
                      Filters
                    </Button>
                  </SheetTrigger>
                  <SheetContent
                    side="right"
                    className="w-80 bg-black text-white border-white/20"
                  >
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-4">
                      <Filters
                        categories={categories}
                        sellers={sellers}
                        countries={countries}
                        searchValue={searchValue}
                        category={category}
                        seller={seller}
                        country={country}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        minCommission={minCommission}
                        inStock={inStock}
                        prime={prime}
                        onSearchChange={setSearchValue}
                        onCategoryChange={setCategory}
                        onSellerChange={setSeller}
                        onCountryChange={setCountry}
                        onMinPriceChange={setMinPrice}
                        onMaxPriceChange={setMaxPrice}
                        onMinCommissionChange={setMinCommission}
                        onInStockChange={setInStock}
                        onPrimeChange={setPrime}
                        onResetFilters={handleResetFilters}
                      />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-4 sm:gap-6">
          <aside className="hidden sm:block">
            <Card className="bg-background/10 backdrop-blur border-white/10 p-4">
              <Filters
                categories={categories}
                sellers={sellers}
                countries={countries}
                searchValue={searchValue}
                category={category}
                seller={seller}
                country={country}
                minPrice={minPrice}
                maxPrice={maxPrice}
                minCommission={minCommission}
                inStock={inStock}
                prime={prime}
                onSearchChange={setSearchValue}
                onCategoryChange={setCategory}
                onSellerChange={setSeller}
                onCountryChange={setCountry}
                onMinPriceChange={setMinPrice}
                onMaxPriceChange={setMaxPrice}
                onMinCommissionChange={setMinCommission}
                onInStockChange={setInStock}
                onPrimeChange={setPrime}
                onResetFilters={handleResetFilters}
              />
            </Card>
          </aside>
          <main>
            <ProductGrid
              products={paginatedProducts}
              isLoading={isLoading}
              itemsPerPage={itemsPerPage}
              imageErrorById={imageErrorById}
              onImageError={handleImageError}
            />

            {totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
