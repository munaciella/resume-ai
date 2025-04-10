import Image from "next/image"
import Link from "next/link"
import { SignedOut, SignInButton, UserButton } from "@clerk/nextjs"
import logo from "../../public/logo.png"

const Navbar = () => {
  return (
    <header className="flex items-center justify-between">
      <Link href="/" className="flex items-center space-x-2">
        <div className="w-fit">
          <Image
          src={logo}
            alt="logo"
            height={80}
            width={80} 
            priority
          />
        </div>
        <h1 className="font-bold text-xl">AI-Resume</h1>
      </Link>

      <div className="px-5 flex space-x-2 items-center cursor-pointer">
        {/* <ThemeToggle /> */}

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
  )
}

export default Navbar;
