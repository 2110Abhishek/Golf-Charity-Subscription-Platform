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

/**
 * Robust Mobile Menu component for production environments.
 * Uses React Portals to solve stacking context issues 
 * and persistent trigger rendering for hydration safety.
 */
export function MobileMenu({ type = 'public', logo, footer }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  // Ensure component is on the client for Portals
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Manage body scroll overflow
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

  // Determine navigation mode based on path or explicit type
  const isDashboard = pathname?.startsWith('/dashboard')
  const isAdmin = pathname?.startsWith('/admin')
  const finalType = type === 'public' ? (isDashboard ? 'user' : isAdmin ? 'admin' : 'public') : type

  const drawerContent = (
    <div 
      className="fixed inset-0 bg-[#050505] z-[9999] flex flex-col p-6 overflow-hidden animate-in fade-in duration-200"
      style={{ isolation: 'isolate' }}
    >
      {/* Drawer Header */}
      <div className="flex items-center justify-between mb-8 mt-2">
        {logo || <div className="text-xl font-bold text-white tracking-tighter">ImpactSphere</div>}
        <button 
          onClick={() => setIsOpen(false)} 
          className="bg-zinc-800 p-2 rounded-2xl hover:bg-zinc-700 transition-colors"
        >
          <X className="w-8 h-8 text-white" />
        </button>
      </div>

      {/* Nav List Wrapper */}
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

      {/* Footer Area */}
      {footer && (
        <div className="mt-auto pt-8 border-t border-zinc-800/80 pb-6">
          {footer}
        </div>
      )}
    </div>
  )

  return (
    <>
      {/* Persistent trigger button remains in its place in the layout */}
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 -mr-2 text-foreground/40 hover:text-white transition-colors block md:hidden"
        aria-label="Open Mobile Menu"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Drawer rendered through Portal to Body to avoid stacking context issues */}
      {mounted && isOpen && createPortal(drawerContent, document.body)}
    </>
  )
}

/**
 * Individual Mobile Navigation Link
 */
function MobileNavLink({ href, name, icon: Icon, active }: { href: string; name: string; icon?: any; active: boolean }) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-5 px-6 py-5 rounded-[2rem] text-xl font-bold transition-all active:scale-[0.98] ${
        active 
          ? 'bg-primary text-black shadow-lg shadow-primary/30 border border-white/20' 
          : 'bg-white/5 text-white/50 hover:text-white hover:bg-white/10 border border-transparent'
      }`}
    >
      {Icon && <Icon className={`w-6 h-6 ${active ? 'text-black' : 'text-primary/70'}`} />}
      {name}
    </Link>
  )
}
