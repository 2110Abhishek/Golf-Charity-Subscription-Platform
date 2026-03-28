'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { 
  Menu, 
  X,
  BarChart3, 
  Trophy, 
  Heart, 
  CreditCard,
  Settings,
  Users,
  Shield,
  CheckCircle2
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface MobileMenuProps {
  type?: 'user' | 'admin' | 'public'
  logo?: React.ReactNode
  footer?: React.ReactNode
}

export function MobileMenu({ type = 'public', logo, footer }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Ensure portal target exists and component is mounted on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-foreground/60 hover:text-white transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>
    )
  }

  // Determine mode based on path if default is passed
  const isDashboard = pathname?.startsWith('/dashboard')
  const isAdmin = pathname?.startsWith('/admin')
  const finalType = type === 'public' ? (isDashboard ? 'user' : isAdmin ? 'admin' : 'public') : type

  const menuContent = (
    <div className="fixed inset-0 bg-[#050505] z-[99999] flex flex-col p-6 overflow-hidden animate-in fade-in duration-200">
      {/* Safe Area Header */}
      <div className="flex items-center justify-between mb-8 mt-2">
        {logo || <div className="text-xl font-bold text-white tracking-tighter">ImpactSphere</div>}
        <button 
          onClick={() => setIsOpen(false)} 
          className="bg-white/10 p-2 rounded-2xl hover:bg-white/20 transition-colors"
        >
          <X className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar">
        {(finalType === 'user' || isDashboard) && (
          <div className="flex flex-col gap-3">
            <MobileNavLink href="/dashboard" name="Overview" icon={BarChart3} active={pathname === '/dashboard'} />
            <MobileNavLink href="/dashboard/scores" name="Scores & Draws" icon={Trophy} active={pathname.startsWith('/dashboard/scores')} />
            <MobileNavLink href="/dashboard/charity" name="Impact" icon={Heart} active={pathname.startsWith('/dashboard/charity')} />
            <MobileNavLink href="/dashboard/subscription" name="Subscription" icon={CreditCard} active={pathname.startsWith('/dashboard/subscription')} />
            <MobileNavLink href="/dashboard/settings" name="Settings" icon={Settings} active={pathname === '/dashboard/settings'} />
          </div>
        )}

        {(finalType === 'admin' || isAdmin) && (
          <div className="flex flex-col gap-3">
            <MobileNavLink href="/admin" name="Insights" icon={BarChart3} active={pathname === '/admin'} />
            <MobileNavLink href="/admin/users" name="Users" icon={Users} active={pathname.startsWith('/admin/users')} />
            <MobileNavLink href="/admin/draws" name="Draws" icon={Shield} active={pathname.startsWith('/admin/draws')} />
            <MobileNavLink href="/admin/charities" name="Charities" icon={Heart} active={pathname.startsWith('/admin/charities')} />
            <MobileNavLink href="/admin/verifications" name="Winners" icon={CheckCircle2} active={pathname.startsWith('/admin/verifications')} />
            <MobileNavLink href="/admin/settings" name="Settings" icon={Settings} active={pathname === '/admin/settings'} />
          </div>
        )}

        {finalType === 'public' && !isDashboard && !isAdmin && (
          <div className="flex flex-col gap-3">
            <MobileNavLink href="/charities" name="Charities" active={pathname === '/charities'} />
            <MobileNavLink href="/login" name="Sign In" active={pathname === '/login'} />
          </div>
        )}
      </nav>

      {/* Footer Area (Sign Out etc) */}
      {footer && (
        <div className="mt-auto pt-8 border-t border-white/10 pb-4">
          {footer}
        </div>
      )}
    </div>
  )

  // Use Portal to render into body, bypassing any header clipping/blur
  if (mounted && isOpen) {
    return createPortal(menuContent, document.body)
  }

  return null
}

function MobileNavLink({ href, name, icon: Icon, active }: { href: string; name: string; icon?: any; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-5 px-6 py-5 rounded-[2rem] text-xl font-bold transition-all active:scale-[0.98] ${
        active 
          ? 'bg-primary text-black shadow-lg shadow-primary/20' 
          : 'bg-white/5 text-white/70 hover:text-white hover:bg-white/10'
      }`}
    >
      {Icon && <Icon className={`w-6 h-6 ${active ? 'text-black' : 'text-primary/60'}`} />}
      {name}
    </Link>
  )
}
