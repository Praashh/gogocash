"use client";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { navLinks } from "@/../data/nav-links";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

export default function Header() {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const { data: session } = useSession();

  const handleNavLinkClick = () => {
    setIsSheetOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/auth/signin", // Redirect to sign-in page after sign-out
    });
    handleNavLinkClick();
  };

  return (
    <header className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      <div className="flex items-center space-x-2 sm:space-x-3">
        <div
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 border-teal-400 bg-transparent flex items-center justify-center text-teal-400 font-bold text-sm sm:text-base"
          aria-label="GoGoCash logo"
        >
          G
        </div>
        <span className="text-lg sm:text-xl font-semibold">GoGoCash</span>
      </div>
      <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-teal-400 transition-colors text-sm lg:text-base ${
              pathname === link.href ? "text-teal-400" : "text-white"
            }`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="hidden md:block">
        {session?.user ? (
          <Button
            onClick={handleSignOut}
            className="rounded-full bg-teal-400 px-4 py-2 text-sm text-black hover:bg-teal-300 transition-colors"
          >
            Sign Out
          </Button>
        ) : (
          <Link href="/auth/signin">
            <Button className="rounded-full bg-teal-400 px-4 py-2 text-sm text-black hover:bg-teal-300 transition-colors">
              Get Started
            </Button>
          </Link>
        )}
      </div>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden h-10 w-10 p-0 hover:bg-white/10"
            aria-label="Open navigation menu"
          >
            <Menu className="h-5 w-5 text-white" />
          </Button>
        </SheetTrigger>
        <SheetContent
          side="right"
          className="w-[280px] sm:w-[320px] bg-black/95 border-white/10"
        >
          <SheetHeader className="text-left">
            <SheetTitle className="text-white flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full border-2 border-teal-400 bg-transparent flex items-center justify-center text-teal-400 font-bold text-sm">
                G
              </div>
              <span className="text-lg font-semibold">GoGoCash</span>
            </SheetTitle>
          </SheetHeader>

          <div className="mt-8">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleNavLinkClick}
                  className={`text-lg font-medium transition-colors ${
                    pathname === link.href
                      ? "text-teal-400"
                      : "text-white hover:text-teal-400"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8 pt-6 border-t border-white/10">
              {session?.user ? (
                <Button
                  onClick={handleSignOut}
                  className="w-full rounded-full bg-teal-400 px-6 py-3 text-black hover:bg-teal-300 transition-colors font-medium"
                >
                  Sign Out
                </Button>
              ) : (
                <Link href="/auth/signin" onClick={handleNavLinkClick}>
                  <Button className="w-full rounded-full bg-teal-400 px-6 py-3 text-black hover:bg-teal-300 transition-colors font-medium">
                    Get Started
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}