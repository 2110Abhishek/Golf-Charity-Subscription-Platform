import { createClient } from '@/utils/supabase/server'
import { Trophy, ArrowLeft, Send, Upload, ShieldCheck, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function ParticipationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entries } = await supabase
    .from('draw_entries')
    .select('*, draws(*)')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Participation.</h1>
        <p className="text-xl text-foreground/60 leading-relaxed">
          Your history in the monthly impact draws. Every round entered is a chance to win and give.
        </p>
      </div>

      {!entries || entries.length === 0 ? (
        <div className="py-32 text-center rounded-[3rem] bg-white/5 border border-white/10">
          <Trophy className="w-16 h-16 text-foreground/10 mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-2">No Draw History</h3>
          <p className="text-foreground/60 max-w-sm mx-auto">
            Once a monthly draw is executed, your participation and any winnings will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {entries.map((entry) => (
            <div key={entry.id} className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 group">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className={`w-24 h-24 rounded-3xl flex flex-col items-center justify-center ${
                    entry.match_count >= 3 ? 'bg-primary/20 border border-primary/30' : 'bg-white/5 border border-white/10'
                }`}>
                    <span className={`text-4xl font-black ${entry.match_count >= 3 ? 'text-primary' : 'text-foreground/20'}`}>
                        {entry.match_count}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">Match</span>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-1">
                    {new Date(entry.draws.draw_month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} Draw
                  </h3>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                    {entry.scores.map((s: number, i: number) => (
                        <span key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            entry.draws.winning_numbers?.includes(s) ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-foreground/40'
                        }`}>
                            {s}
                        </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center md:items-end gap-3">
                {entry.match_count >= 3 ? (
                    <>
                        <p className="text-3xl font-black text-primary">${entry.prize_amount.toLocaleString()}</p>
                        <Link 
                            href={`/dashboard/winnings/${entry.id}`}
                            className="px-6 py-2 rounded-full bg-white text-black text-sm font-bold hover:scale-105 transition-all"
                        >
                            Claim Prize
                        </Link>
                    </>
                ) : (
                    <div className="text-right">
                        <p className="text-xs font-bold text-foreground/20 uppercase tracking-widest mb-1 text-center md:text-right">Result</p>
                        <p className="font-bold text-foreground/40">No Match</p>
                    </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
