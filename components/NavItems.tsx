'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AiOutlineHome, AiOutlineRobot, AiOutlineUser } from "react-icons/ai";

const navItems = [
  { label: 'Home', href: '/', icon: <AiOutlineHome size={24} /> },
  { label: 'Companions', href: '/companions', icon: <AiOutlineRobot size={24} /> },
  { label: 'My Journey', href: '/my-journey', icon: <AiOutlineUser size={24} /> },
]

const NavItems = () => {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-8">
      {navItems.map(({ label, href, icon }) => (
        <Link
          href={href}
          key={label}
          className={cn(
            "flex flex-col items-center gap-1 text-gray-600 hover:text-primary transition-all duration-300 group",
            pathname === href && "text-primary font-semibold"
          )}
        >
          <div className={cn(
            "p-2 rounded-xl transition-all duration-300 group-hover:bg-primary/10",
            pathname === href && "bg-primary/10"
          )}>
            {icon}
          </div>
          <span className="text-xs font-medium tracking-wide">{label}</span>
          
          {/* Active indicator */}
          <div className={cn(
            "w-0 h-0.5 bg-primary rounded-full transition-all duration-300",
            pathname === href && "w-4"
          )} />
        </Link>
      ))}
    </nav>
  )
}

export default NavItems;