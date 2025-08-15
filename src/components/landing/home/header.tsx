"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navLinks } from "@/../data/nav-links";
export default function Header() {
  const pathname = usePathname();
  return (
    <header className="flex items-center justify-between px-8 py-6">
      <div className="flex items-center space-x-3">
        <div
          className="w-8 h-8 rounded-full border-2 border-teal-400 bg-transparent flex items-center justify-center text-teal-400 font-bold"
          aria-label="GoGoCash logo"
        >
          G
        </div>
        <span className="text-xl font-semibold">GoGoCash</span>
      </div>
      <nav className="flex items-center space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-teal-400 transition-colors ${pathname === link.href ? "text-teal-400" : ""}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <Link href="/auth/signin">
        <Button className="rounded-full bg-teal-400 px-4 py-2 text-sm text-black hover:bg-teal-300">
          Get Started
        </Button>
      </Link>
    </header>
  );
}
