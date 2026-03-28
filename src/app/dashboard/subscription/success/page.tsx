import { CheckCircle, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function SubscriptionSuccessPage() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 bg-grid-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-md w-full relative z-10 text-center space-y-8 animate-in fade-in zoom-in duration-700">
        <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-10">
          <CheckCircle className="w-12 h-12 text-primary" />
        </div>
        
        <div className="space-y-4">
          <h1 className="text-5xl font-extrabold tracking-tight">Impact Activated.</h1>
          <p className="text-xl text-foreground/60 leading-relaxed">
            Congratulations! Your subscription is active. You are now fueling change and eligible for the next monthly draw.
          </p>
        </div>

        <Link 
          href="/dashboard"
          className="inline-flex w-full py-5 rounded-full bg-primary text-primary-foreground font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20 items-center justify-center gap-2"
        >
          Enter Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </div>
  )
}
