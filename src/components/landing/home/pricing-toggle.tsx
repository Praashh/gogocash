"use client";

interface PricingToggleProps {
  isMonthly: boolean;
  onToggle: (isMonthly: boolean) => void;
}

export default function PricingToggle({
  isMonthly,
  onToggle,
}: PricingToggleProps) {
  return (
    <div className="flex flex-col items-center justify-center mb-12 sm:mb-16">
      <div className="flex items-center gap-2 rounded-full border border-white/15 bg-black/40 p-1.5 backdrop-blur shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
        <button
          onClick={() => onToggle(true)}
          className={`rounded-[12px] px-4 sm:px-6 py-2 text-sm font-semibold transition-all ${
            isMonthly
              ? "bg-teal-400 text-black shadow-[0_12px_30px_rgba(45,212,191,0.45)]"
              : "bg-white/10 text-white/70 hover:text-white"
          }`}
          aria-label="Switch to monthly pricing"
        >
          Monthly
        </button>
        <button
          onClick={() => onToggle(false)}
          className={`rounded-[12px] px-4 sm:px-6 py-2 text-sm font-semibold transition-all ${
            !isMonthly
              ? "bg-teal-400 text-black shadow-[0_12px_30px_rgba(45,212,191,0.45)]"
              : "bg-white/10 text-white/70 hover:text-white"
          }`}
          aria-label="Switch to annual pricing"
        >
          Annually
        </button>
      </div>
    </div>
  );
}
