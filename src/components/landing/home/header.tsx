import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Header() {
    return (
        <header className="flex items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full border-2 border-teal-400 bg-transparent flex items-center justify-center text-teal-400 font-bold" aria-label="GoGoCash logo">
            G
          </div>
          <span className="text-xl font-semibold">GoGoCash</span>
        </div>

        <nav className="flex items-center space-x-8">
          <Link href="#" className="hover:text-teal-400 transition-colors">
            Products
          </Link>
          <Link href="#" className="hover:text-teal-400 transition-colors">
            Use Cases
          </Link>
          <Link href="#" className="hover:text-teal-400 transition-colors">
            Blog
          </Link>
          <Link href="#" className="hover:text-teal-400 transition-colors">
            About Us
          </Link>
        </nav>
      <Link href = "/auth/signin">
        <Button className="rounded-full bg-teal-400 px-4 py-2 text-sm text-black hover:bg-teal-300">
          Get Started
        </Button>
        </Link>
      </header>
    )
}