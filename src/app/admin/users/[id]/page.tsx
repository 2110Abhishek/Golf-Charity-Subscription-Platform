import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, CreditCard, Heart, Trophy, Trash2, Shield, Mail } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function AdminUserDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // 1. Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .eq('id', id)
    .single()

  if (!profile) {
    notFound()
  }

  // 2. Fetch user scores
  const { data: scores } = await supabase
    .from('scores')
    .select('*')
    .eq('user_id', id)
    .order('date_played', { ascending: false })

  // --- SERVER ACTIONS ---
  async function deleteScore(formData: FormData) {
    'use server'
    const scoreId = formData.get('scoreId') as string
    const supabase = await createClient()
    await supabase.from('scores').delete().eq('id', scoreId)
    revalidatePath(`/admin/users/${id}`)
  }

  async function updateStatus(formData: FormData) {
    'use server'
    const status = formData.get('status') as string
    const supabase = await createClient()
    await supabase.from('profiles').update({ subscription_status: status }).eq('id', id)
    revalidatePath(`/admin/users/${id}`)
  }

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link 
        href="/admin/users" 
        className="inline-flex items-center gap-2 text-foreground/40 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to User Registry
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start gap-8">
        <div className="flex gap-8 items-center">
          <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-primary-foreground shadow-2xl shadow-primary/20">
            <User className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-5xl font-extrabold tracking-tight mb-2">{profile.email}</h1>
            <p className="text-foreground/40 font-mono text-xs">Internal ID: {profile.id}</p>
          </div>
        </div>

        <div className="flex gap-4">
          <form action={updateStatus} className="flex gap-2">
            <select 
              name="status" 
              defaultValue={profile.subscription_status || 'trial'}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm font-bold focus:outline-none focus:border-primary/50"
            >
              <option value="active">Active</option>
              <option value="trial">Trial</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="px-6 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors text-sm font-bold">
              Update Status
            </button>
          </form>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard className="w-5 h-5 text-primary" />
            <p className="text-xs font-black uppercase tracking-widest text-foreground/40">Subscription</p>
          </div>
          <p className="text-2xl font-black capitalize">{profile.subscription_status || 'Trial'}</p>
          <p className="text-[10px] text-foreground/40 mt-1 uppercase tracking-tighter">Plan: Monthly Impact</p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Heart className="w-5 h-5 text-accent" />
            <p className="text-xs font-black uppercase tracking-widest text-foreground/40">Cause Partner</p>
          </div>
          <p className="text-2xl font-black">{profile.charities?.name || 'Unassigned'}</p>
          <p className="text-[10px] text-foreground/40 mt-1 uppercase tracking-tighter">Contribution: {profile.charity_percentage}%</p>
        </div>

        <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10">
          <div className="flex items-center gap-3 mb-6">
            <Trophy className="w-5 h-5 text-primary" />
            <p className="text-xs font-black uppercase tracking-widest text-foreground/40">Platform Usage</p>
          </div>
          <p className="text-2xl font-black">{scores?.length || 0} Rounds</p>
          <p className="text-[10px] text-foreground/40 mt-1 uppercase tracking-tighter">Member since {new Date(profile.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h2 className="text-3xl font-black tracking-tight">Manage Scores.</h2>
          <span className="text-foreground/40 text-sm">Showing all time performance data</span>
        </div>

        <div className="rounded-[2.5rem] border border-white/5 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-white/5 border-b border-white/5">
              <tr>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Date Played</th>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Stableford Score</th>
                <th className="px-10 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {!scores || scores.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-10 py-16 text-center text-foreground/40 italic">
                    This user hasn't recorded any scores yet.
                  </td>
                </tr>
              ) : (
                scores.map((score) => (
                  <tr key={score.id} className="hover:bg-red-500/5 transition-colors group">
                    <td className="px-10 py-6 font-medium">
                      {new Date(score.date_played).toLocaleDateString(undefined, { dateStyle: 'long' })}
                    </td>
                    <td className="px-10 py-6">
                      <span className="text-2xl font-black text-primary">{score.score}</span>
                      <span className="text-foreground/20 text-xs font-bold ml-2">Points</span>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <form action={deleteScore}>
                        <input type="hidden" name="scoreId" value={score.id} />
                        <button className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
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
