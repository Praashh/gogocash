"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
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

      <div className="absolute -top-24 -left-24 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl [animation:float_12s_ease-in-out_infinite]" />
      <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-teal-400/10 blur-3xl [animation:float_14s_ease-in-out_infinite_reverse]" />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-400 animate-pulse" />
          Oops — page not found
        </div>

        <h1
          className="select-none bg-gradient-to-r from-white via-teal-300 to-white bg-clip-text text-7xl font-extrabold tracking-tight text-transparent sm:text-8xl"
          style={{ animation: "hueshift 12s linear infinite" }}
        >
          404
        </h1>
        <p className="mt-4 max-w-xl text-balance text-white/80">
          The page you’re looking for doesn’t exist or was moved. Let’s get you
          back on track.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href="/dashboard">Open dashboard</Link>
          </Button>
        </div>
      </main>

      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-white/30"
            style={{
              left: `${(i * 53) % 100}%`,
              top: `${(i * 37) % 100}%`,
              animation: `twinkle ${6 + (i % 5)}s ease-in-out ${(i % 3) * 0.7}s infinite`,
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) translateX(0px);
          }
          50% {
            transform: translateY(-20px) translateX(10px);
          }
        }
        @keyframes hueshift {
          0% {
            filter: hue-rotate(0deg);
          }
          50% {
            filter: hue-rotate(20deg);
          }
          100% {
            filter: hue-rotate(0deg);
          }
        }
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.15;
            transform: scale(1);
          }
          50% {
            opacity: 0.9;
            transform: scale(1.6);
          }
        }
      `}</style>
    </div>
  );
}
