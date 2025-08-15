"use client";
import { useState } from "react";
import { plans } from "@/../data/plans";

export default function Hero() {
  const [isMonthly, setIsMonthly] = useState<boolean>(true);
  return (
    <main className="px-8 py-16 text-center">
      <div className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-gray-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
        Bring your business to the best scale
      </div>

      <h1 className="text-5xl font-bold mb-2 tracking-tight">
        Discover Products
      </h1>
      <h2 className="text-5xl font-bold text-gray-400 mb-6 tracking-tight">
        With the Best Pricing
      </h2>

      <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
        Select from best plan, ensuring a perfect match. Need more or less?
        Customize your subscription for a seamless fit!
      </p>

      <div className="flex flex-col items-center justify-center mb-16">
        <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 p-1.5 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
          <button
            onClick={() => setIsMonthly(true)}
            className={`rounded-[12px] px-6 py-2 text-sm font-semibold transition-all ${
              isMonthly
                ? "bg-teal-400 text-black shadow-[0_12px_30px_rgba(45,212,191,0.45)]"
                : "bg-white/10 text-white/70 hover:text-white"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsMonthly(false)}
            className={`rounded-[12px] px-6 py-2 text-sm font-semibold transition-all ${
              !isMonthly
                ? "bg-teal-400 text-black shadow-[0_12px_30px_rgba(45,212,191,0.45)]"
                : "bg-white/10 text-white/70 hover:text-white"
            }`}
          >
            Annually
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative rounded-[28px] p-8 backdrop-blur border ${
                plan.highlighted
                  ? "border-2 border-teal-400/60 bg-[linear-gradient(180deg,rgba(45,212,191,0.08),rgba(8,17,17,0.50))] shadow-[0_0_0_1px_rgba(45,212,191,0.25),0_40px_80px_-20px_rgba(45,212,191,0.35)] transform scale-105 z-20"
                  : "border-white/10 bg-[linear-gradient(180deg,rgba(11,23,23,0.70),rgba(8,17,17,0.50))] shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_40px_80px_-20px_rgba(0,0,0,0.6)]"
              }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-3 -left-3 -right-3 -bottom-3 rounded-[32px] bg-[radial-gradient(400px_200px_at_center,rgba(45,212,191,0.25),transparent_70%)] pointer-events-none"></div>
              )}

              <div className="relative z-10">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-4 font-bold ${
                    plan.highlighted
                      ? "border-teal-400 text-teal-400"
                      : "border-white text-white"
                  }`}
                  aria-label="Plan badge"
                >
                  G
                </div>

                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <p
                  className={`mb-6 ${
                    plan.highlighted ? "text-gray-300" : "text-gray-400"
                  }`}
                >
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    {isMonthly ? plan.priceMonthly : plan.priceAnnually}
                  </span>
                  {plan.priceMonthly !== "Free" && (
                    <span className="text-gray-300/80 text-lg">
                      {" "}
                      / per month
                    </span>
                  )}
                </div>

                <button
                  className={`w-full rounded-full px-6 py-3 font-medium transition-all ${
                    plan.highlighted
                      ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-black shadow-[0_12px_30px_rgba(45,212,191,0.45)] hover:from-teal-300 hover:to-cyan-300"
                      : "bg-white/5 text-white border border-white/10 hover:bg-white/10"
                  }`}
                >
                  Get Started
                </button>

                <h4 className="text-sm font-medium mt-6 mb-4">
                  What you will get:
                </h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center space-x-3">
                      <div
                        className="w-5 h-5 rounded-full border border-white flex items-center justify-center text-white text-[10px] font-bold"
                        aria-label="Feature badge"
                      >
                        G
                      </div>
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
