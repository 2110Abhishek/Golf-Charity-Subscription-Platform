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
  ChevronRight
} from 'lucide-react'
import { DashboardNav, DashboardSettingsLink, DashboardBreadcrumb } from '@/components/dashboard/nav'

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
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/5 p-6 flex flex-col gap-6 bg-[#0a0a0a]/50 backdrop-blur-xl">
        <Link href="/" className="text-xl font-bold tracking-tighter px-2">
          <span className="text-primary">Impact</span>Sphere
        </Link>

        <DashboardNav />

        <div className="space-y-2">
          <DashboardSettingsLink />
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/40 hover:text-accent transition-all w-full text-left">
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]">
          <div className="text-sm text-foreground/40 flex items-center gap-2">
            Pages <ChevronRight className="w-3 h-3" /> <DashboardBreadcrumb />
          </div>
          <div className="flex items-center gap-4">
            <Link href="/dashboard/scores/new" className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors">
              <PlusCircle className="w-4 h-4" />
              Enter Score
            </Link>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent" />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
