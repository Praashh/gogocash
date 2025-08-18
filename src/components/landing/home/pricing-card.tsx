"use client";

import { plans } from "@/../data/plans";
import { Check } from "lucide-react";

interface PricingCardProps {
  plan: (typeof plans)[0];
  isMonthly: boolean;
}

export default function PricingCard({ plan, isMonthly }: PricingCardProps) {
  return (
    <div
      className={`relative rounded-[20px] sm:rounded-[24px] lg:rounded-[28px] p-6 sm:p-8 backdrop-blur border ${
        plan.highlighted
          ? "border-2 border-teal-400/60 bg-[linear-gradient(180deg,rgba(45,212,191,0.08),rgba(8,17,17,0.50))] shadow-[0_0_0_1px_rgba(45,212,191,0.25),0_40px_80px_-20px_rgba(45,212,191,0.35)] transform scale-105 z-20"
          : "border-white/10 bg-[linear-gradient(180deg,rgba(11,23,23,0.70),rgba(8,17,17,0.50))] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_40px_80px_-20px_rgba(0,0,0,0.6)]"
      }`}
    >
      {plan.highlighted && (
        <div className="absolute -top-3 -left-3 -right-3 -bottom-3 rounded-[24px] sm:rounded-[28px] lg:rounded-[32px] bg-[radial-gradient(400px_200px_at_center,rgba(45,212,191,0.25),transparent_70%)] pointer-events-none"></div>
      )}

      <div className="relative z-10">
        <div
          className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-2 mb-4 font-bold ${
            plan.highlighted
              ? "border-teal-400 text-teal-400"
              : "border-white text-white"
          }`}
          aria-label={`${plan.name} plan badge`}
        >
          G
        </div>
        <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">
          {plan.name}
        </h3>
        <p
          className={`mb-4 sm:mb-6 text-sm sm:text-base ${
            plan.highlighted ? "text-gray-300" : "text-gray-400"
          }`}
        >
          {plan.description}
        </p>
        <div className="mb-6">
          <span className="text-3xl sm:text-4xl font-bold">
            {isMonthly ? plan.priceMonthly : plan.priceAnnually}
          </span>
          {plan.priceMonthly !== "Free" && (
            <span className="text-gray-300/80 text-base sm:text-lg">
              {" "}
              / per month
            </span>
          )}
        </div>
        <button
          className={`w-full rounded-full px-4 sm:px-6 py-3 font-medium transition-all text-sm sm:text-base ${
            plan.highlighted
              ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-black shadow-[0_12px_30px_rgba(45,212,191,0.45)] hover:from-teal-300 hover:to-cyan-300"
              : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
          }`}
          aria-label={`Get started with ${plan.name} plan`}
        >
          Get Started
        </button>
        <div className="mt-6 sm:mt-8">
          <h4 className="text-sm font-medium mb-3 sm:mb-4">
            What you will get:
          </h4>
          <ul className="space-y-2 sm:space-y-3">
            {plan.features.map((feature, i) => (
              <li key={i} className="flex items-start space-x-3 text-left">
                <div
                  className="w-4 h-4 sm:w-5 sm:h-5 rounded-full border border-white flex items-center justify-center text-white text-[8px] sm:text-[10px] font-bold mt-0.5 flex-shrink-0"
                  aria-label="Feature included"
                >
                  <Check />
                </div>
                <span className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
