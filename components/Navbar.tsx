import Link from "next/link";
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import NavItems from "@/components/NavItems";

const Navbar = () => {
  return (
    <nav className="navbar flex justify-between items-center px-6 py-4 shadow-md bg-white/95 backdrop-blur-sm">
      <Link href="/">
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <Image
            src="/images/loggo.png"
            alt="logo"
            width={40}
            height={38}
            className="transition-transform duration-300 group-hover:scale-110"
          />
          <span className="text-sm font-bold text-primary tracking-widest uppercase letter-spacing-wide">
            Kyno
          </span>
        </div>
      </Link>

      <div className="flex items-center gap-8">
        <NavItems />
        <SignedOut>
          <SignInButton>
            <button className="btn-signin">Sign In</button>
          </SignInButton>
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </nav>
  )
}

export default Navbar;