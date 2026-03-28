import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowLeft, ShieldCheck, IndianRupee } from 'lucide-react'

export default async function CharityDonationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: charity } = await supabase
    .from('charities')
    .select('*')
    .eq('id', id)
    .single()

  if (!charity) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <Link 
          href={`/charities/${id}`} 
          className="inline-flex items-center gap-2 text-foreground/40 hover:text-white mb-12 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Profile
        </Link>

        <div className="p-12 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Heart className="w-64 h-64 text-primary" strokeWidth={1} />
          </div>

          <div className="relative z-10 space-y-8">
            <div className="space-y-2">
              <span className="text-primary font-black uppercase tracking-[0.2em] text-[10px]">One-Off Contribution</span>
              <h1 className="text-4xl font-black tracking-tight">Support {charity.name}.</h1>
              <p className="text-foreground/60 leading-relaxed">
                100% of your donation (minus payment processing fees) goes directly to the charity's mission.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[500, 1000, 2000].map((amount) => (
                <button 
                  key={amount}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 hover:border-primary/50 hover:bg-primary/5 transition-all group text-center"
                >
                  <p className="text-xs text-foreground/40 font-bold uppercase mb-1">Impact</p>
                  <p className="text-xl font-black group-hover:text-primary transition-colors">₹{amount}</p>
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-foreground/40">Custom Amount</label>
              <div className="relative group">
                <IndianRupee className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/20 group-focus-within:text-primary transition-colors" />
                <input 
                  type="number" 
                  placeholder="Enter custom amount"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-xl font-bold focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
                />
              </div>
            </div>

            <div className="pt-4 space-y-6">
              <button className="w-full py-6 rounded-3xl bg-primary text-primary-foreground text-xl font-black hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20">
                Complete Donation
              </button>
              
              <div className="flex items-center justify-center gap-3 text-foreground/30 text-xs font-medium">
                <ShieldCheck className="w-4 h-4" />
                Secure PCI-Compliant Transaction
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
