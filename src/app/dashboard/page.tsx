"use client";

import React from "react";
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
import { Star } from "lucide-react";
import Image from "next/image";

type Product = {
  id: string;
  title: string;
  price: number;
  currency: string;
  rating: number;
  reviews: number;
  sellerType: "Brand" | "Retailer" | "Marketplace" | "Reseller";
  country: string;
  commissionRate: number;
  prime: boolean;
  inStock: boolean;
  category: string;
  image: string;
};

const products: Product[] = [
  {
    id: "1",
    title: "Noise-Canceling Headphones with Long Battery Life",
    price: 199.99,
    currency: "USD",
    rating: 4.6,
    reviews: 1423,
    sellerType: "Brand",
    country: "US",
    commissionRate: 0.25,
    prime: true,
    inStock: true,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1518442072849-5e30d89848b8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "2",
    title: "Ergonomic Office Chair with Lumbar Support",
    price: 289,
    currency: "USD",
    rating: 4.2,
    reviews: 893,
    sellerType: "Retailer",
    country: "CA",
    commissionRate: 0.12,
    prime: false,
    inStock: true,
    category: "Home & Office",
    image:
      "https://images.unsplash.com/photo-1580480055273-228ff5388ef5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "3",
    title: '4K Monitor 27" with HDR and USB-C',
    price: 349.49,
    currency: "USD",
    rating: 4.4,
    reviews: 512,
    sellerType: "Marketplace",
    country: "US",
    commissionRate: 0.18,
    prime: true,
    inStock: true,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "4",
    title: "Gaming Mouse with Programmable Buttons",
    price: 59.99,
    currency: "EUR",
    rating: 4.1,
    reviews: 221,
    sellerType: "Brand",
    country: "DE",
    commissionRate: 0.3,
    prime: false,
    inStock: true,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "5",
    title: 'Standing Desk Adjustable Height 48"',
    price: 499,
    currency: "GBP",
    rating: 4.7,
    reviews: 312,
    sellerType: "Reseller",
    country: "UK",
    commissionRate: 0.22,
    prime: true,
    inStock: false,
    category: "Home & Office",
    image:
      "https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "6",
    title: "Portable Bluetooth Speaker Waterproof",
    price: 79.99,
    currency: "USD",
    rating: 4.3,
    reviews: 1031,
    sellerType: "Brand",
    country: "US",
    commissionRate: 0.15,
    prime: true,
    inStock: true,
    category: "Electronics",
    image:
      "https://images.unsplash.com/photo-1490376840453-5f616fbebe5b?q=80&w=1200&auto=format&fit=crop",
  },
];

type SortKey =
  | "relevance"
  | "best"
  | "price-asc"
  | "price-desc"
  | "commission-desc";

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}

function Stars({ value }: { value: number }) {
  const full = Math.floor(value);
  const empty = 5 - full - (value % 1 >= 0.5 ? 1 : 0);
  const hasHalf = value % 1 >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={`f-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      ))}
      {hasHalf && (
        <div className="relative h-4 w-4">
          <Star className="absolute inset-0 h-4 w-4 text-yellow-400" />
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ width: "50%" }}
          >
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
          <div className="absolute inset-0 opacity-30" />
        </div>
      )}
      {Array.from({ length: empty }).map((_, i) => (
        <Star key={`e-${i}`} className="h-4 w-4 text-yellow-400/30" />
      ))}
    </div>
  );
}

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

  const categories = React.useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.category)))],
    [],
  );
  const sellers = React.useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.sellerType)))],
    [],
  );
  const countries = React.useMemo(
    () => ["All", ...Array.from(new Set(products.map((p) => p.country)))],
    [],
  );

  const filtered = React.useMemo(() => {
    return products
      .filter((p) =>
        query ? p.title.toLowerCase().includes(query.toLowerCase()) : true,
      )
      .filter((p) => (category !== "All" ? p.category === category : true))
      .filter((p) => (seller !== "All" ? p.sellerType === seller : true))
      .filter((p) => (country !== "All" ? p.country === country : true))
      .filter((p) => (minPrice ? p.price >= Number(minPrice) : true))
      .filter((p) => (maxPrice ? p.price <= Number(maxPrice) : true))
      .filter((p) =>
        minCommission ? p.commissionRate * 100 >= Number(minCommission) : true,
      )
      .filter((p) => (inStock ? p.inStock : true))
      .filter((p) => (prime ? p.prime : true));
  }, [
    query,
    category,
    seller,
    country,
    minPrice,
    maxPrice,
    minCommission,
    inStock,
    prime,
  ]);

  const sorted = React.useMemo(() => {
    const copy = [...filtered];
    switch (sort) {
      case "price-asc":
        copy.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        copy.sort((a, b) => b.price - a.price);
        break;
      case "commission-desc":
        copy.sort((a, b) => b.commissionRate - a.commissionRate);
        break;
      case "best":
        copy.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    return copy;
  }, [filtered, sort]);

  const highCommissionThreshold = 0.2;

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
              {sorted.map((p) => {
                const isHigh = p.commissionRate >= highCommissionThreshold;
                return (
                  <Card
                    key={p.id}
                    className="bg-background/10 backdrop-blur border-white/10 overflow-hidden"
                  >
                    <div className="relative aspect-[4/3] bg-white/5">
                      <Image
                        src={p.image}
                        alt={p.title}
                        className="h-full w-full object-cover"
                      />
                      {p.prime && (
                        <div className="absolute top-2 left-2">
                          <Badge className="bg-blue-500 text-black">
                            Fast shipping
                          </Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader className="p-4 pb-2">
                      <CardTitle className="text-base text-white line-clamp-2 min-h-[2.75rem]">
                        {p.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0">
                      <div className="flex items-center gap-2">
                        <Stars value={p.rating} />
                        <span className="text-xs text-white/60">
                          ({p.reviews.toLocaleString()})
                        </span>
                      </div>
                      <div className="mt-2 text-lg font-semibold">
                        {formatMoney(p.price, p.currency)}
                      </div>
                      <div className="mt-1 text-sm text-white/70">
                        {p.sellerType} • {p.country}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        {isHigh && (
                          <Badge className="bg-teal-500 text-black">
                            {Math.round(p.commissionRate * 100)}% commission
                          </Badge>
                        )}
                        {!isHigh && (
                          <Badge variant="secondary" className="text-white/90">
                            {Math.round(p.commissionRate * 100)}% commission
                          </Badge>
                        )}
                        {!p.inStock && (
                          <Badge className="bg-red-500">Out of stock</Badge>
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
              {sorted.length === 0 && (
                <div className="col-span-full text-white/70">
                  No products match your filters.
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
