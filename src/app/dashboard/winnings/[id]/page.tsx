import { createClient } from '@/utils/supabase/server'
import { Trophy, ArrowLeft, Send, Upload, ShieldCheck, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function WinnerProofPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: entry } = await supabase
    .from('draw_entries')
    .select('*, draws(draw_month, winning_numbers)')
    .eq('id', id)
    .eq('user_id', user?.id)
    .single()

  if (!entry) {
    notFound()
  }

  // Check if already submitted
  const { data: existingVerification } = await supabase
    .from('winner_verifications')
    .select('*')
    .eq('draw_entry_id', id)
    .single()

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-foreground/40 hover:text-white mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-black text-primary uppercase tracking-widest">
            Identity Verified
        </div>
        <h1 className="text-5xl font-extrabold tracking-tight">Claim Prize.</h1>
        <p className="text-xl text-foreground/60">
            Congratulations on your <span className="text-white font-bold">{entry.match_count}-number match</span> in the {new Date(entry.draws.draw_month).toLocaleDateString(undefined, { month: 'long' })} Draw!
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 space-y-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-primary/5">
            <Trophy className="w-40 h-40" />
        </div>

        <div className="p-8 rounded-3xl bg-black/40 border border-white/5 space-y-6 relative z-10">
            <h3 className="text-xl font-bold flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-primary" />
                Proof of Score
            </h3>
            <p className="text-sm text-foreground/40">
                To verify your win, please upload a screenshot of your scores from the golf platform for the relevant dates.
            </p>

            {existingVerification ? (
                <div className="p-8 rounded-2xl bg-primary/10 border border-primary/20 text-center space-y-4">
                    <CheckCircle className="w-8 h-8 text-primary mx-auto" />
                    <p className="font-bold">Proof successfully submitted.</p>
                    <p className="text-sm text-foreground/60">Our team is currently reviewing your submission. Payout status: <span className="text-white font-bold capitalize">{existingVerification.status}</span></p>
                </div>
            ) : (
                <form 
                  action={async (formData) => {
                    'use server'
                    await (await import('../actions')).submitWinnerProof(formData)
                  }} 
                  className="space-y-6"
                >
                    <input type="hidden" name="draw_entry_id" value={id} />
                    <div className="group relative border-2 border-dashed border-white/10 hover:border-primary/50 rounded-3xl p-12 transition-all cursor-pointer flex flex-col items-center justify-center gap-4 bg-white/[0.02]">
                        <Upload className="w-10 h-10 text-foreground/20 group-hover:text-primary transition-colors" />
                        <div className="text-center">
                            <p className="font-bold">Select Proof Screenshot</p>
                            <p className="text-xs text-foreground/40 mt-1">PNG or JPG up to 10MB</p>
                        </div>
                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" required />
                    </div>

                    <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 flex gap-4 items-start">
                        <AlertTriangle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                        <p className="text-[10px] text-foreground/60 leading-relaxed uppercase tracking-widest font-bold">
                            Submission of falsified data will lead to permanent account termination and forfeiture of all winnings.
                        </p>
                    </div>

                    <button className="w-full py-5 rounded-full bg-primary text-primary-foreground font-black text-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2">
                        Submit Verification
                        <Send className="w-5 h-5" />
                    </button>
                </form>
            )}
        </div>

        <div className="grid grid-cols-2 gap-6 relative z-10">
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Prize Unlocked</p>
                <p className="text-2xl font-black text-primary">${entry.prize_amount.toLocaleString()}</p>
            </div>
            <div className="p-6 rounded-3xl bg-white/5 border border-white/5">
                <p className="text-[10px] font-bold text-foreground/40 uppercase tracking-widest mb-1">Drawn Date</p>
                <p className="text-xl font-bold">{new Date().toLocaleDateString()}</p>
            </div>
        </div>
      </div>
    </div>
  )
}

function CheckCircle(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    )
}
