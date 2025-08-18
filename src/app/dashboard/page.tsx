"use client";
import useSWR from "swr";
import axios from "axios";
import { TProductData } from "../../../zod/involve-asia";
import { ProductFeed } from "@/components/landing/dashboard";

const fetcher = async (url: string) => {
  const response = await axios.get(url);
  return response.data;
};

export default function Page() {
  const { data, isLoading } = useSWR<{
    success: boolean;
    productData: TProductData[];
  }>("/api/shopeextra/all", fetcher);

  return (
    <ProductFeed
      initialProducts={data?.productData || []}
      isLoading={isLoading}
    />
  );
}
