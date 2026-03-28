import { createClient } from '@/utils/supabase/server'
import { Activity, Trash2, Calendar, LayoutGrid } from 'lucide-react'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function ScoresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user?.id)
    .order('date_played', { ascending: false })

  const { data: results } = await supabase
    .from('draws')
    .select('*')
    .eq('status', 'published')
    .order('draw_month', { ascending: false })
    .limit(3)

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-3">Your Rounds.</h1>
          <p className="text-xl text-foreground/60">Manage your rolling top 5 performances.</p>
        </div>
        <Link href="/dashboard/scores/new" className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all">
          Enter New Score
        </Link>
      </div>

      {!scores || scores.length === 0 ? (
        <div className="py-32 text-center rounded-[3rem] bg-white/5 border border-white/10">
          <Activity className="w-16 h-16 text-foreground/10 mx-auto mb-6" />
          <h3 className="text-2xl font-bold mb-2">No Rounds Recorded</h3>
          <p className="text-foreground/60 max-w-sm mx-auto">
            Log your latest Stableford scores to qualify for the next monthly draw and fuel your chosen charity.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {scores.map((score, index) => (
            <div key={score.id} className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group hover:bg-white/[0.07] transition-all">
              <div className="flex items-center gap-10">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex flex-col items-center justify-center">
                  <span className="text-primary font-black text-2xl">{score.score}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary/60">PTS</span>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-foreground/40 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm font-bold uppercase tracking-widest">{new Date(score.date_played).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xl">Stableford Round</span>
                    {index < 5 ? (
                      <span className="px-2 py-0.5 rounded-md bg-primary/20 text-primary text-[10px] font-black uppercase tracking-tighter">Active Draw</span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md bg-white/10 text-foreground/20 text-[10px] font-black uppercase tracking-tighter">Archived</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right font-mono text-foreground/20 text-sm hidden md:block">
                  #{score.id.slice(0, 8)}
                </div>
                <form action={async () => {
                   'use server'
                   const supabase = await createClient()
                   await supabase.from('scores').delete().eq('id', score.id)
                   revalidatePath('/dashboard/scores')
                }}>
                  <button className="p-3 rounded-xl hover:bg-accent/10 hover:text-accent transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Draw Results Section */}
      <div className="pt-20 border-t border-white/5 space-y-10">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-accent/10 text-accent">
            <LayoutGrid className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold italic tracking-tight">Draw Results.</h2>
        </div>

        {!results || results.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white/5 border border-white/10">
            <p className="text-foreground/40 font-medium">Results will appear here after the first draw.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {results.map((draw) => (
              <div key={draw.id} className="p-8 rounded-[2rem] bg-[#111] border border-white/10 space-y-6 group hover:border-accent/40 transition-all">
                <div className="flex justify-between items-start">
                  <h4 className="font-black text-xs uppercase tracking-widest text-foreground/40">
                    {new Date(draw.draw_month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                  </h4>
                  <span className="px-2 py-1 rounded bg-accent/20 text-accent text-[8px] font-black uppercase tracking-widest">Official</span>
                </div>
                
                <div className="flex gap-2">
                  {draw.winning_numbers?.map((num: number, i: number) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-sm shadow-xl group-hover:bg-accent group-hover:text-black transition-all">
                      {num}
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <span className="text-xs font-bold text-foreground/40">Total Prize Pool</span>
                  <span className="font-bold text-accent">₹{draw.total_pool.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
