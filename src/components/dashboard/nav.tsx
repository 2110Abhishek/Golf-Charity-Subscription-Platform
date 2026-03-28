'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BarChart3, 
  Trophy, 
  Heart, 
  CreditCard,
  Settings
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: BarChart3 },
  { name: 'Scores & Draws', href: '/dashboard/scores', icon: Trophy },
  { name: 'Impact', href: '/dashboard/charity', icon: Heart },
  { name: 'Subscription', href: '/dashboard/subscription', icon: CreditCard },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1">
      {navItems.map((item) => {
        const isActive = item.href === '/dashboard' 
          ? pathname === '/dashboard' 
          : pathname.startsWith(item.href)
        return (
          <Link 
            key={item.href}
            href={item.href} 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300",
              isActive 
                ? "bg-primary/10 text-primary font-bold" 
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

export function DashboardSettingsLink() {
  const pathname = usePathname()
  const isActive = pathname === '/dashboard/settings'

  return (
    <Link 
      href="/dashboard/settings" 
      className={cn(
        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
        isActive 
          ? "bg-white/10 text-white font-bold" 
          : "text-foreground/40 hover:text-white hover:bg-white/5"
      )}
    >
      <Settings className="w-5 h-5" />
      Settings
    </Link>
  )
}

export function DashboardBreadcrumb() {
  const pathname = usePathname()
  const segment = pathname.split('/').pop() || 'Overview'
  const name = segment.charAt(0).toUpperCase() + segment.slice(1)

  return (
    <span className="text-white font-medium">{name}</span>
  )
}
