import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  BarChart3, 
  Trophy, 
  Heart, 
  Settings, 
  LogOut, 
  PlusCircle, 
  CreditCard,
  ChevronRight,
  User
} from 'lucide-react'
import { DashboardNav, DashboardSettingsLink, DashboardBreadcrumb } from '@/components/dashboard/nav'
import { MobileMenu } from '@/components/ui/MobileMenu'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row h-screen">
      {/* Sidebar - Hidden on Mobile */}
      <aside className="hidden md:flex w-64 border-r border-white/5 p-6 flex-col gap-8 bg-[#0a0a0a]/50 backdrop-blur-xl h-full sticky top-0">
        <Link href="/" className="text-2xl font-black tracking-tight px-2">
          <span className="text-primary">Impact</span>Sphere
        </Link>

        <div className="flex-1">
          <DashboardNav />
        </div>

        <div className="pt-6 border-t border-white/5 space-y-2">
          <DashboardSettingsLink />
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/40 hover:text-accent transition-all w-full text-left font-bold">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        {/* Responsive Header */}
        <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            {/* Mobile Menu Toggle */}
            <MobileMenu 
              type="user"
              logo={
                <div className="text-xl font-black tracking-tight">
                  <span className="text-primary">Impact</span>Sphere
                </div>
              }
              footer={
                <form action="/auth/signout" method="post" className="w-full">
                  <button className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-accent/10 text-accent font-bold w-full transition-all active:scale-95">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Sign Out
                  </button>
                </form>
              }
            />
            
            <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-foreground/40 uppercase tracking-widest">
              Pages <ChevronRight className="w-3 h-3 opacity-40" /> <DashboardBreadcrumb />
            </div>
          </div>

          <div className="flex items-center gap-4 md:gap-6">
            <Link 
              href="/dashboard/scores/new" 
              className="px-4 py-2 md:px-6 md:py-2.5 rounded-full bg-primary text-primary-foreground text-xs md:text-sm font-black flex items-center gap-2 hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden xs:inline">Enter Score</span>
              <span className="xs:hidden">Post</span>
            </Link>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
              <User className="w-4 h-4 md:w-5 md:h-5 text-foreground/40" />
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-6xl mx-auto pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
