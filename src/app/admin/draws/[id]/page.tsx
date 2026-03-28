import { createClient } from '@/utils/supabase/server'
import { ArrowLeft, CheckCircle2, Users, Trophy, IndianRupee } from 'lucide-react'
import Link from 'next/link'

export default async function DrawResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch draw details
  const { data: draw } = await supabase
    .from('draws')
    .select('*')
    .eq('id', id)
    .single()

  // Fetch winning entries
  const { data: entries } = await supabase
    .from('draw_entries')
    .select('*, profiles(email)')
    .eq('draw_id', id)
    .order('match_count', { ascending: false })

  if (!draw) return <div>Draw not found</div>

  const winners = entries?.filter(e => e.match_count >= 3) || []

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <Link 
        href="/admin/draws" 
        className="inline-flex items-center gap-2 text-foreground/40 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Draw History
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">
            {new Date(draw.draw_month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} Results.
          </h1>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-tighter">
              {draw.status}
            </span>
            <span className="text-foreground/40 text-sm">
              Published on {new Date(draw.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex gap-4">
          {draw.winning_numbers?.map((n: number, i: number) => (
            <div key={i} className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center text-2xl font-black shadow-xl">
              {n}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-primary" />
            <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Total Participants</p>
          </div>
          <p className="text-4xl font-black">{entries?.length || 0}</p>
        </div>
        
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-5 h-5 text-accent" />
            <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest">Total Winners</p>
          </div>
          <p className="text-4xl font-black">{winners.length}</p>
        </div>

        <div className="p-8 rounded-[2rem] bg-primary text-primary-foreground">
          <div className="flex items-center gap-3 mb-6">
            <IndianRupee className="w-5 h-5 text-primary-foreground/60" />
            <p className="text-sm font-bold text-primary-foreground/60 uppercase tracking-widest">Distributed Pool</p>
          </div>
          <p className="text-4xl font-black">₹{Number(draw.total_pool).toLocaleString()}</p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Winning Entry Breakdown</h2>
        <div className="rounded-[2.5rem] border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">User Email</th>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Matched</th>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Prize Amount</th>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {winners.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-10 py-20 text-center text-foreground/40 italic">
                    No winners recorded for this draw.
                  </td>
                </tr>
              ) : (
                winners.map((entry) => (
                  <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-10 py-6 font-medium">{(entry.profiles as any)?.email}</td>
                    <td className="px-10 py-6">
                      <span className="text-lg font-black">{entry.match_count}</span>
                      <span className="text-foreground/40 ml-1">matches</span>
                    </td>
                    <td className="px-10 py-6 font-bold text-primary text-lg">
                      ₹{entry.prize_amount.toLocaleString()}
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2 text-xs font-bold text-accent">
                        <CheckCircle2 className="w-4 h-4" />
                        Awaiting Verification
                      </div>
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
