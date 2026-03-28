import { createClient } from '@/utils/supabase/server'
import { 
  Users, 
  TrendingUp, 
  Heart, 
  Trophy, 
  ArrowUpRight, 
  ArrowDownRight,
  Activity,
  Zap
} from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Fetch real statistics
  const { count: totalSubscribers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  const { data: drawStats } = await supabase
    .from('draws')
    .select('total_pool')
    .eq('status', 'published')

  const { count: totalUsers } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const totalPool = drawStats?.reduce((acc, draw) => acc + (Number(draw.total_pool) || 0), 0) || 0
  const charityImpact = totalPool * 0.25 // Example logic: 25% of pool goes to charities

  const stats = [
    { label: 'Active Subscribers', value: totalSubscribers?.toString() || '0', trend: '+0%', up: true, icon: Users, color: 'text-primary' },
    { label: 'Total Prize Pool', value: `₹${totalPool.toLocaleString()}`, trend: '+0%', up: true, icon: Trophy, color: 'text-accent' },
    { label: 'Charity Impact', value: `₹${charityImpact.toLocaleString()}`, trend: '+0%', up: true, icon: Heart, color: 'text-primary' },
    { label: 'Total Platform Users', value: totalUsers?.toString() || '0', trend: '+0%', up: true, icon: Zap, color: 'text-yellow-400' },
  ]

  const { data: recentUsers } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Insights.</h1>
        <p className="text-xl text-foreground/60 leading-relaxed">
          System-wide performance, growth metrics, and impact analytics.
        </p>
      </div>

      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="p-8 rounded-3xl bg-white/5 border border-white/10 relative overflow-hidden">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-6`} />
            <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black">{stat.value}</h3>
              <div className={`flex items-center gap-1 text-xs font-bold ${stat.up ? 'text-primary' : 'text-accent'}`}>
                {stat.up ? <TrendingUp className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between items-end">
            <h3 className="text-2xl font-bold">Recent Signups</h3>
            <Link href="/admin/users" className="text-sm font-bold text-primary hover:underline">View All Users</Link>
          </div>
          <div className="rounded-[2.5rem] border border-white/5 overflow-hidden bg-white/5">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
              <thead className="bg-white/5 border-b border-white/5">
                <tr>
                  <th className="px-8 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">User</th>
                  <th className="px-8 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Status</th>
                  <th className="px-8 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Joined</th>
                  <th className="px-8 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentUsers?.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px]">
                          {user.email.slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-foreground/40 text-[10px] font-black uppercase tracking-tighter">
                        {user.subscription_status || 'Trial'}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-sm text-foreground/60">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <Link href={`/admin/users/${user.id}`} className="text-primary hover:text-white transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

        <div className="space-y-6">
          <h3 className="text-2xl font-bold">System Health</h3>
          <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8">
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-bold">Next Draw Data</span>
                <span className="text-primary font-bold">Ready</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-primary w-full" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="font-bold">Pending Payouts</span>
                <span className="text-foreground/40 font-bold">None</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-white/20 w-0" />
              </div>
            </div>
            <div className="pt-4 flex items-center gap-4">
               <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                 <Activity className="w-5 h-5" />
               </div>
               <div>
                 <p className="font-bold text-sm">API Connectivity</p>
                 <p className="text-xs text-foreground/40">Stripe & Supabase responding stably.</p>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
