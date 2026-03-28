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
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 border-r border-white/5 p-6 flex flex-col gap-6 bg-[#0a0a0a]">
        <Link href="/" className="px-2">
          <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
            <span className="text-primary">Impact</span>Sphere
            <span className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[8px] font-bold text-foreground/40 uppercase tracking-widest">Admin</span>
          </div>
        </Link>

        <AdminNav />

        <div className="space-y-2">
          <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/40 hover:text-white transition-all">
            <Settings className="w-5 h-5" />
            Settings
          </Link>
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/40 hover:text-accent transition-all w-full text-left">
              <LogOut className="w-5 h-5" />
              Exit Admin
            </button>
          </form>
        </div>
      </aside>

      {/* Admin Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#050505]">
          <div className="relative w-96 max-w-sm">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/20" />
            <input 
              placeholder="Search users or draws..." 
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/50"
            />
          </div>
          
          <div className="flex items-center gap-6">
            {typeof pendingCount === 'number' && pendingCount > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
                <AlertCircle className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-accent">{pendingCount} Verification Requests</span>
              </div>
            )}
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
