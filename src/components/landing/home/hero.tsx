"use client";
import { useState } from "react";
import { plans } from "@/../data/plans";
import PricingToggle from "./pricing-toggle";
import PricingCard from "./pricing-card";

export default function Hero() {
  const [isMonthly, setIsMonthly] = useState<boolean>(true);

  const handleToggle = (isMonthly: boolean) => {
    setIsMonthly(isMonthly);
  };

  return (
    <main className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16 text-center">
      <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 sm:px-4 py-1 sm:py-1.5 text-xs sm:text-sm text-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] mb-6 sm:mb-8">
        Bring your business to the best scale
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-2 tracking-tight">
        Discover Products
      </h1>
      <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-400 mb-4 sm:mb-6 tracking-tight">
        With the Best Pricing
      </h2>
      <p className="text-gray-400 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-8 sm:mb-12 px-4">
        Select from best plan, ensuring a perfect match. Need more or less?
        Customize your subscription for a seamless fit!
      </p>
      <PricingToggle isMonthly={isMonthly} onToggle={handleToggle} />
      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-7xl w-full">
          {plans.map((plan, idx) => (
            <PricingCard key={idx} plan={plan} isMonthly={isMonthly} />
          ))}
        </div>
      </div>
    </main>
  );
}
