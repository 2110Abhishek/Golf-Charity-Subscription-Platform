'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Users, 
  Heart, 
  Shield, 
  CheckCircle2
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Insights', href: '/admin', icon: BarChart3 },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Draws', href: '/admin/draws', icon: Shield },
  { name: 'Charities', href: '/admin/charities', icon: Heart },
  { name: 'Winners', href: '/admin/verifications', icon: CheckCircle2 },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = item.href === '/admin' 
          ? pathname === '/admin' 
          : pathname.startsWith(item.href)
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
              isActive 
                ? "bg-primary/10 text-primary font-bold shadow-[0_0_20px_rgba(0,196,255,0.05)]" 
                : "text-foreground/60 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "opacity-40")} />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
