"use client";

import React, { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import Image from "next/image";
import { TProductData } from "../../../zod/involve-asia";

type SortKey =
  | "relevance"
  | "best"
  | "price-asc"
  | "price-desc"
  | "commission-desc";

export default function Page() {
  const [query, setQuery] = React.useState("");
  const [category, setCategory] = React.useState<string>("All");
  const [seller, setSeller] = React.useState<string>("All");
  const [country, setCountry] = React.useState<string>("All");
  const [minPrice, setMinPrice] = React.useState<string>("");
  const [maxPrice, setMaxPrice] = React.useState<string>("");
  const [minCommission, setMinCommission] = React.useState<string>("");
  const [inStock, setInStock] = React.useState<boolean>(false);
  const [prime, setPrime] = React.useState<boolean>(false);
  const [sort, setSort] = React.useState<SortKey>("relevance");
  const [products, setProducts] = React.useState<TProductData[]>([]);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [isLoading, setIsLoading] = React.useState(true);
  const itemsPerPage = 12;

  const categories = React.useMemo(() => {
    const uniqueCategories = Array.from(
      new Set(products.map((p) => p.shop_type)),
    );
    return ["All", ...uniqueCategories];
  }, [products]);

  const sellers = React.useMemo(() => {
    const uniqueSellers = Array.from(new Set(products.map((p) => p.shop_name)));
    return ["All", ...uniqueSellers];
  }, [products]);

  const countries = React.useMemo(() => {
    const uniqueCountries = Array.from(new Set(products.map((p) => p.country)));
    return ["All", ...uniqueCountries];
  }, [products]);

  const highCommissionThreshold = 0.1; // 10% commission threshold

  const sorted = React.useMemo(() => {
    const filtered = products.filter((p) => {
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
    products,
    category,
    seller,
    country,
    minPrice,
    maxPrice,
    minCommission,
    sort,
  ]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProducts = sorted.slice(startIndex, endIndex);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [category, seller, country, minPrice, maxPrice, minCommission, sort]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/shopeextra/all?page=1");
        const data = await response.json();

        if (data.success) {
          setProducts(data.productData);
          console.log(`Data loaded from ${data.source}`);
        } else {
          console.error("Failed to fetch data:", data.error);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const SkeletonCard = () => (
    <Card className="bg-background/10 backdrop-blur border-white/10 overflow-hidden">
      <div className="relative aspect-[4/3] bg-white/5">
        <Skeleton className="h-full w-full rounded-none" />
      </div>
      <CardHeader className="p-4 pb-2">
        <Skeleton className="h-5 w-full mb-2" />
        <Skeleton className="h-4 w-3/4" />
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-3">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-16" />
        </div>
      </CardContent>
    </Card>
  );

  const Filters = (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-xs text-white/70">Category</label>
        <Select value={category} onValueChange={setCategory}>
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
        <Select value={seller} onValueChange={setSeller}>
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
        <Select value={country} onValueChange={setCountry}>
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
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            className="bg-transparent text-white border-white/20"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs text-white/70">Max Price</label>
          <Input
            inputMode="numeric"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="1000"
            className="bg-transparent text-white border-white/20"
          />
        </div>
      </div>
      <div className="space-y-1">
        <label className="text-xs text-white/70">Min Commission %</label>
        <Input
          inputMode="numeric"
          value={minCommission}
          onChange={(e) => setMinCommission(e.target.value)}
          placeholder="0"
          className="bg-transparent text-white border-white/20"
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="stock"
          checked={inStock}
          onCheckedChange={(v) => setInStock(Boolean(v))}
        />
        <label htmlFor="stock" className="text-sm text-white/80">
          In stock
        </label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="prime"
          checked={prime}
          onCheckedChange={(v) => setPrime(Boolean(v))}
        />
        <label htmlFor="prime" className="text-sm text-white/80">
          Fast shipping
        </label>
      </div>
      <Button
        variant="secondary"
        className="w-full"
        onClick={() => {
          setCategory("All");
          setSeller("All");
          setCountry("All");
          setMinPrice("");
          setMaxPrice("");
          setMinCommission("");
          setInStock(false);
          setPrime(false);
        }}
      >
        Reset
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#031416] to-black" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_300px_at_center_top,rgba(45,212,191,0.20),transparent_60%)]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Product Feed</h1>
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search products"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-56 bg-transparent text-white border-white/20"
            />
            <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
              <SelectTrigger className="w-48 bg-transparent text-white border-white/20">
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
                  <Button variant="secondary">Filters</Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-80 bg-black text-white border-white/20"
                >
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">{Filters}</div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr] gap-6">
          <aside className="hidden sm:block">
            <Card className="bg-background/10 backdrop-blur border-white/10 p-4">
              {Filters}
            </Card>
          </aside>
          <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {isLoading
                ? Array.from({ length: itemsPerPage }).map((_, index) => (
                    <SkeletonCard key={index} />
                  ))
                : paginatedProducts.map((p) => {
                    const isHigh =
                      parseFloat(p.commission_rate) >= highCommissionThreshold;
                    return (
                      <Card
                        key={p.shop_id}
                        className="bg-background/10 backdrop-blur border-white/10 overflow-hidden"
                      >
                        <div className="relative aspect-[4/3] bg-white/5">
                          <Image
                            src={p.shop_image}
                            alt={p.offer_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardHeader className="p-4 pb-2">
                          <CardTitle className="text-base text-white line-clamp-2 min-h-[2.75rem]">
                            {p.offer_name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="mt-2 text-lg font-semibold">
                            {p.shop_name}
                          </div>
                          <div className="mt-1 text-sm text-white/70">
                            {p.shop_type} • {p.country}
                          </div>
                          <div className="mt-3 flex items-center gap-2">
                            {isHigh && (
                              <Badge className="bg-teal-500 text-black">
                                {Math.round(
                                  parseFloat(p.commission_rate) * 100,
                                )}
                                % commission
                              </Badge>
                            )}
                            {!isHigh && (
                              <Badge
                                variant="secondary"
                                className="text-white/90"
                              >
                                {Math.round(
                                  parseFloat(p.commission_rate) * 100,
                                )}
                                % commission
                              </Badge>
                            )}
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Button className="flex-1">View</Button>
                            <Button variant="secondary">Add</Button>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              {!isLoading && paginatedProducts.length === 0 && (
                <div className="col-span-full text-white/70">
                  No products match your filters.
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) {
                            setCurrentPage(currentPage - 1);
                          }
                        }}
                        className={
                          currentPage === 1
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => {
                        const shouldShow =
                          page === 1 ||
                          page === totalPages ||
                          Math.abs(page - currentPage) <= 1;

                        if (!shouldShow) {
                          // Show ellipsis if there's a gap
                          const prevPage = page - 1;
                          if (
                            prevPage === 1 ||
                            Math.abs(prevPage - currentPage) <= 1
                          ) {
                            return (
                              <PaginationItem key={`ellipsis-${page}`}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            );
                          }
                          return null;
                        }

                        return (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              isActive={currentPage === page}
                              className="text-white hover:text-white"
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      },
                    )}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) {
                            setCurrentPage(currentPage + 1);
                          }
                        }}
                        className={
                          currentPage === totalPages
                            ? "pointer-events-none opacity-50"
                            : ""
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
