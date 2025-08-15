import Header from "@/components/landing/home/header";
import React from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (

    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#031416] to-black" />
      <div className="relative z-10">
        <Header />
        {children}
      </div>
    </div>
  );
}