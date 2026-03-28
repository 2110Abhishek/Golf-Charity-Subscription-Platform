import { createClient } from '@/utils/supabase/server'
import { Heart, Activity, Trophy, Calendar, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*, charities(*)')
    .eq('id', user?.id)
    .single()

  // if (profileError) console.error('Profile Fetch Error:', profileError) // Removed console.error

  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', user?.id)
    .order('date_played', { ascending: false })
    .limit(5)

  // Fetch winnings and pending verifications
  const { data: winnings } = await supabase
    .from('draw_entries')
    .select('prize_amount, status')
    .eq('user_id', user?.id)
    .not('prize_amount', 'is', null)

  const { data: pendingVerification } = await supabase
    .from('winner_verifications')
    .select('id, status')
    .eq('user_id', user?.id)
    .eq('status', 'pending')
    .single()

  const totalWinnings = winnings?.reduce((sum, w) => sum + (Number(w.prize_amount) || 0), 0) || 0

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-2">Hello, Athlete.</h1>
          <p className="text-foreground/60">Here is your current impact and performance summary.</p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="text-right">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Status</p>
            <p className="text-primary font-bold">
              {profile?.subscription_status 
                ? profile.subscription_status.charAt(0).toUpperCase() + profile.subscription_status.slice(1) 
                : 'Trial'}
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-right">
            <p className="text-xs font-bold text-foreground/40 uppercase tracking-widest">Renewal</p>
            <p className="font-bold">May 12</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Charity Card */}
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-primary/10 group-hover:text-primary/20 transition-colors">
            <Heart className="w-24 h-24" />
          </div>
          <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-6">Active Cause</p>
          <h3 className="text-2xl font-bold mb-2">{profile?.charities?.name || 'No Charity Selected'}</h3>
          <p className="text-primary font-bold text-4xl mb-4">{profile?.charity_percentage || 10}%</p>
          <p className="text-sm text-foreground/60 mb-8">of your subscription fuels this cause.</p>
          <Link href="/dashboard/charity" className="inline-flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors">
            Change Impact <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Participation Card */}
        <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col justify-between">
          <div>
            <p className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-6">Upcoming Draw</p>
            <div className="flex items-center gap-4 mb-4">
              <Calendar className="w-5 h-5 text-accent" />
              <span className="text-2xl font-bold">April 1st</span>
            </div>
            <p className="text-sm text-foreground/60">Tickets automatically generated from your latest scores.</p>
          </div>
          <div className="mt-8 pt-8 border-t border-white/5">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-bold">Entry Status</span>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">Active</span>
            </div>
          </div>
        </div>

        {/* Winnings Card */}
        <div className="p-8 rounded-[2rem] bg-primary text-primary-foreground relative overflow-hidden group">
          <p className="text-sm font-bold text-primary-foreground/60 uppercase tracking-widest mb-6">Total Winnings</p>
          <h3 className="text-5xl font-extrabold tracking-tighter mb-4">₹{totalWinnings.toLocaleString()}</h3>
          
          {pendingVerification ? (
            <Link 
              href={`/dashboard/winnings/${pendingVerification.id}`}
              className="w-full py-4 rounded-xl bg-white text-primary font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2 shadow-xl animate-pulse"
            >
              Verify Your Win Now! <ArrowUpRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <p className="text-sm font-medium text-primary-foreground/80 mb-10">All winnings are automatically processed via your connected account.</p>
              <button className="w-full py-3 rounded-xl bg-black/10 font-bold hover:bg-black/20 transition-colors">
                View History
              </button>
            </>
          )}
        </div>
      </div>

      {/* Scores Table */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <h3 className="text-2xl font-bold">Latest Rounds</h3>
          <Link href="/dashboard/scores" className="text-sm font-bold text-primary hover:underline">View All</Link>
        </div>
        
        <div className="rounded-[2rem] border border-white/5 overflow-hidden bg-white/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[500px]">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-8 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Score (Stableford)</th>
                <th className="px-8 py-4 text-xs font-bold text-foreground/40 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!scores || scores.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-8 py-12 text-center text-foreground/40">
                    <Activity className="w-8 h-8 mx-auto mb-4 opacity-20" />
                    No scores entered yet.
                  </td>
                </tr>
              ) : (
                scores.map((score) => (
                  <tr key={score.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-6 font-medium">{new Date(score.date_played).toLocaleDateString()}</td>
                    <td className="px-8 py-6">
                      <span className="text-xl font-bold">{score.score}</span>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 rounded-full bg-white/5 text-xs font-bold">Active</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
