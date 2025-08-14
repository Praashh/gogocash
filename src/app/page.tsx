import Header from "@/components/landing/home/header";
import Hero from "@/components/landing/home/hero";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-[#031416] to-black" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_300px_at_center_top,rgba(45,212,191,0.20),transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          backgroundPosition: "center",
        }}
      />
      <div className="relative z-10">
        <Header/>
        <Hero/>
      </div>
    </div>
  );
}
