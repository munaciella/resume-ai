import Image from "next/image";
import Link from "next/link";
import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import logo from "../../public/logo.png";
import ThemeToggle from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "lucide-react";

const Navbar = () => {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <div className="w-fit">
          <Image src={logo} alt="logo" height={80} width={80} priority />
        </div>
        <h1 className="font-bold text-xl">AI-Resume</h1>
      </Link>

      <div className="px-5 flex space-x-2 items-center cursor-pointer">
        {/* Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-2 rounded-md border text-sm font-medium hover:bg-muted transition">
              <Menu className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuItem asChild>
              <Link href="/dashboard">🏠 Dashboard</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/job-parser">📄 Job Parser</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/saved">💾 Saved Jobs</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/resume-generator">
                📄 Resume Generator
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/cover-letter-generator">
                💌 Cover Letter Generator
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ThemeToggle />
        <UserButton />
        <SignedOut>
          <SignInButton
            forceRedirectUrl="/dashboard"
            fallbackRedirectUrl="/"
            mode="modal"
          />
        </SignedOut>
      </div>
    </header>
  );
};

export default Navbar;
