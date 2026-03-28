import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  BarChart3, 
  Users, 
  Heart, 
  Shield, 
  Settings, 
  LogOut, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react'
import { AdminNav } from '@/components/admin/nav'
import { MobileMenu } from '@/components/ui/MobileMenu'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  const { count: pendingCount } = await supabase
    .from('winner_verifications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row h-screen">
      {/* Admin Sidebar - Hidden on Mobile */}
      <aside className="hidden md:flex w-64 border-r border-white/5 p-6 flex flex-col gap-8 bg-[#0a0a0a]">
        <Link href="/" className="px-2">
          <div className="flex items-center gap-2 text-2xl font-black tracking-tighter">
            <span className="text-primary">Impact</span>Sphere
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-foreground/40 uppercase tracking-widest">Admin</span>
          </div>
        </Link>

        <div className="flex-1">
          <AdminNav />
        </div>

        <div className="pt-6 border-t border-white/5 space-y-2">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/40 hover:text-white transition-all font-bold">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/40 hover:text-accent transition-all w-full text-left font-bold">
              <LogOut className="w-5 h-5" />
              Exit Admin
            </button>
          </form>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden relative">
        <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between px-6 md:px-10 bg-[#050505]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1">
            {/* Mobile Menu Toggle */}
            <MobileMenu 
              type="admin"
              logo={
                <div className="flex items-center gap-2 text-xl font-black tracking-tight">
                  <span className="text-primary">Impact</span>Sphere
                  <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-foreground/40 uppercase tracking-widest">Admin</span>
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
                    Exit Admin
                  </button>
                </form>
              }
            />

            <div className="relative w-full max-w-sm hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
              <input 
                placeholder="Search..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50 transition-all"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 md:gap-6 ml-4">
            {typeof pendingCount === 'number' && pendingCount > 0 && (
              <Link href="/admin/verifications" className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-all">
                <AlertCircle className="w-4 h-4 text-accent" />
                <span className="hidden xs:inline text-[10px] font-black text-accent uppercase tracking-widest">{pendingCount} Requests</span>
                <span className="xs:hidden text-[10px] font-black text-accent">{pendingCount}</span>
              </Link>
            )}
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs md:text-sm text-foreground/40">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth">
          <div className="max-w-7xl mx-auto pb-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
