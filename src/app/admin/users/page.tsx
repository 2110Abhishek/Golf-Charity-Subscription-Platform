import { createClient } from '@/utils/supabase/server'
import { Search, Filter, Mail, CreditCard, ArrowUpRight, Ban } from 'lucide-react'
import Link from 'next/link'

export default async function AdminUsersPage() {
  const supabase = await createClient()
  
  const { data: users } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">User Registry.</h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl">
            Managing subscribers, roles, and platform access.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="px-6 py-3 rounded-xl border border-white/10 bg-white/5 font-bold hover:bg-white/10 transition-all flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all">
            Export CSV
          </button>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Subscriber</th>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Plan</th>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Cause</th>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Impact %</th>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users?.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-accent opacity-20" />
                    <div>
                      <p className="font-bold text-sm tracking-tight">{user.email}</p>
                      <p className="text-[10px] text-foreground/40 font-mono">ID: {user.id.slice(0, 8)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Monthly</span>
                  </div>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-medium">{user.charities?.name || 'Unassigned'}</span>
                </td>
                <td className="px-8 py-6">
                  <span className="text-sm font-bold text-primary">{user.charity_percentage}%</span>
                </td>
                <td className="px-8 py-6">
                  <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                    user.subscription_status === 'active' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-foreground/40'
                  }`}>
                    {user.subscription_status || 'Trial'}
                  </span>
                </td>
                <td className="px-8 py-6">
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={`/admin/users/${user.id}`} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                      <Mail className="w-4 h-4" />
                    </Link>
                    <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-accent">
                      <Ban className="w-4 h-4" />
                    </button>
                    <Link href={`/admin/users/${user.id}`} className="p-2 rounded-lg bg-primary text-primary-foreground hover:scale-110 transition-all">
                      <ArrowUpRight className="w-4 h-4" />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
