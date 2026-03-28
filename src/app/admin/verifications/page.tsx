import { createClient } from '@/utils/supabase/server'
import { CheckCircle2, XCircle, Eye, Clock, ShieldCheck, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default async function AdminVerificationsPage() {
  const supabase = await createClient()

  // Fetch real verification stats
  const { count: pendingCount } = await supabase
    .from('winner_verifications')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { data: paidEntries } = await supabase
    .from('draw_entries')
    .select('prize_amount')
    .not('prize_amount', 'eq', 0)

  const totalPayouts = paidEntries?.reduce((acc, entry) => acc + (Number(entry.prize_amount) || 0), 0) || 0

  const { data: verifications } = await supabase
    .from('winner_verifications')
    .select('*, draw_entries(prize_amount, user_id, draw_id, profiles(email))')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Winner Verification.</h1>
        <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl">
          Reviewing submitted proofs and authorizing payouts for draw winners.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-4">Pending Review</h4>
          <p className="text-3xl font-black text-accent">{pendingCount || 0}</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-4">Total Prize Debt</h4>
          <p className="text-3xl font-black">₹{totalPayouts.toLocaleString()}</p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
          <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-4">Authorized Today</h4>
          <p className="text-3xl font-black text-primary">₹0.00</p>
        </div>
      </div>

      <div className="rounded-[2.5rem] border border-white/5 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 border-b border-white/5">
            <tr>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Winner</th>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Draw Entry</th>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Prize</th>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Status</th>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Verification</th>
              <th className="px-8 py-5 text-xs font-bold text-foreground/40 uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {!verifications || verifications.length === 0 ? (
                <tr>
                    <td colSpan={6} className="px-8 py-20 text-center text-foreground/40">
                        <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-10" />
                        No verification requests at this time.
                    </td>
                </tr>
            ) : (
                verifications.map((v) => (
                    <tr key={v.id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="px-8 py-6">
                            <p className="font-bold text-sm">{v.draw_entries?.profiles?.email || 'Unknown User'}</p>
                            <p className="text-[10px] text-foreground/40">Submitted {new Date(v.created_at).toLocaleDateString()}</p>
                        </td>
                        <td className="px-8 py-6">
                            <div className="flex items-center gap-2 text-sm text-foreground/60">
                                <Clock className="w-4 h-4" />
                                March 2026 Draw
                            </div>
                        </td>
                        <td className="px-8 py-6">
                            <span className="font-black text-primary">₹{v.draw_entries?.prize_amount?.toLocaleString() || '0.00'}</span>
                        </td>
                        <td className="px-8 py-6">
                            <span className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${
                                v.status === 'approved' ? 'bg-primary/20 text-primary' : 
                                v.status === 'pending' ? 'bg-accent/20 text-accent' : 'bg-white/10 text-foreground/40'
                            }`}>
                                {v.status}
                            </span>
                        </td>
                        <td className="px-8 py-6">
                            <a 
                                href={v.proof_url} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-xs font-bold hover:text-primary transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                View Proof
                                <ArrowUpRight className="w-3 h-3" />
                            </a>
                        </td>
                        <td className="px-8 py-6 text-right">
                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <form action={async () => {
                                    'use server'
                                    await (await import('./actions')).updateVerificationStatus(v.id, 'approved')
                                }}>
                                    <button className="p-2 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all" title="Approve">
                                        <CheckCircle2 className="w-4 h-4" />
                                    </button>
                                </form>
                                <form action={async () => {
                                    'use server'
                                    await (await import('./actions')).updateVerificationStatus(v.id, 'rejected')
                                }}>
                                    <button className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-all" title="Reject">
                                        <XCircle className="w-4 h-4" />
                                    </button>
                                </form>
                            </div>
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
