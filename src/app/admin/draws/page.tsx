import { createClient } from '@/utils/supabase/server'
import { Plus, Play, Info, Settings2, BarChart2, Eye } from 'lucide-react'
import Link from 'next/link'
import { createNextDraw } from './actions'

export default async function AdminDrawsPage() {
  const supabase = await createClient()

  // Fetch real subscriber data for the pool
  const { count: activeSubs } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  const currentPool = (activeSubs || 0) * 19 * 0.40 // 40% of $19 fee
  
  const { data: draws } = await supabase
    .from('draws')
    .select('*')
    .order('draw_month', { ascending: false })

  const monthlyPool = 4250.00 // Mock value for now
  
  return (
    <div className="space-y-12">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Draw Engine.</h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl">
            Configure, simulate, and publish the monthly prize pool rewards based on subscriber performance.
          </p>
        </div>
        <form action={async () => {
          'use server'
          await createNextDraw()
        }}>
          <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all">
            <Plus className="w-5 h-5" />
            Create Next Draw
          </button>
        </form>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-4">Current Pool</p>
          <p className="text-3xl font-black text-primary">₹{currentPool.toLocaleString()}</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <p className="text-[10px] font-black text-foreground/40 uppercase tracking-widest mb-4">Active Entries</p>
          <p className="text-3xl font-black">{activeSubs || 0}</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-4">Jackpot Rollover</h4>
          <p className="text-3xl font-black text-accent">₹{(draws?.[0]?.jackpot_rollover || 0).toLocaleString()}</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-4">Logic Mode</h4>
          <p className="text-xl font-bold flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-foreground/20" />
            Random Gen
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Draw History & Schedule</h2>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10">All Months</button>
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10">Pending Only</button>
          </div>
        </div>

        <div className="rounded-[2.5rem] border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Month</th>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Status</th>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Winning Numbers</th>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Prize Pool</th>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!draws || draws.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-10 py-20 text-center text-foreground/40">
                    <Info className="w-10 h-10 mx-auto mb-4 opacity-10" />
                    No draws have been configured yet.
                  </td>
                </tr>
              ) : (
                draws.map((draw) => (
                  <tr key={draw.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-8 font-bold text-xl">
                      {new Date(draw.draw_month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                        draw.status === 'published' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-foreground/40'
                      }`}>
                        {draw.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      {draw.winning_numbers ? (
                        <div className="flex gap-2">
                          {draw.winning_numbers.map((n: number, i: number) => (
                            <span key={i} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-black text-sm">
                              {n}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-foreground/20 font-medium">Not Generated</span>
                      )}
                    </td>
                    <td className="px-10 py-8 font-bold">
                      ₹{draw.total_pool.toLocaleString()}
                    </td>
                    <td className="px-10 py-8">
                      {draw.status === 'pending' ? (
                        <Link 
                          href={`/admin/draws/${draw.id}/run`}
                          className="flex items-center gap-2 text-primary font-bold hover:underline"
                        >
                          <Play className="w-4 h-4 fill-current" />
                          Execute Draw
                        </Link>
                      ) : (
                        <Link 
                          href={`/admin/draws/${draw.id}`}
                          className="flex items-center gap-2 text-foreground/40 hover:text-white transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          View Results
                        </Link>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
