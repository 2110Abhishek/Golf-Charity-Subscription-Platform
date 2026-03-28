import Link from 'next/link'
import { ArrowLeft, CheckCircle, Trophy, Heart, Activity, ArrowRight } from 'lucide-react'

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <header className="p-6 max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="inline-flex items-center gap-2 text-foreground/60 hover:text-white transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </Link>
        <div className="font-black tracking-tighter text-xl">
          <span className="text-primary">Impact</span>Sphere
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-20 space-y-32">
        <section className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter">How it Works.</h1>
          <p className="text-xl text-foreground/60 max-w-2xl mx-auto leading-relaxed">
            A simple 4-step process to track your game, win prizes, and support world-class charities.
          </p>
        </section>

        <div className="space-y-40">
          {/* Step 1 */}
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                Step 01
              </div>
              <h2 className="text-4xl font-extrabold">Join the Club.</h2>
              <p className="text-lg text-foreground/60 leading-relaxed">
                Choose between a Monthly or Yearly subscription. A fixed portion of your fee goes directly to your selected charity, ensuring every round you play starts with an impact.
              </p>
              <ul className="space-y-3">
                {['Monthly Plan: ₹1,600', 'Yearly Plan: ₹14,900 (Save 20%)', 'Cancel Anytime'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="aspect-square rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center">
               <Activity className="w-32 h-32 text-primary/20" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 aspect-square rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center">
               <Trophy className="w-32 h-32 text-accent/20" />
            </div>
            <div className="order-1 md:order-2 space-y-6 text-right md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-bold uppercase tracking-widest">
                Step 02
              </div>
              <h2 className="text-4xl font-extrabold text-right md:text-left">Enter Your Scores.</h2>
              <p className="text-lg text-foreground/60 leading-relaxed text-right md:text-left">
                Simply log your Stableford scores after your round. Our engine only tracks your **latest 5 rounds**, creating a "Rolling Performance" that determines your probability in the monthly draws.
              </p>
              <div className="flex flex-wrap gap-2 justify-end md:justify-start">
                 {[34, 38, 32, 41, 36].map(s => (
                   <div key={s} className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center font-bold">{s}</div>
                 ))}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                Step 03
              </div>
              <h2 className="text-4xl font-extrabold">The Monthly Draw.</h2>
              <p className="text-lg text-foreground/60 leading-relaxed">
                Every month, we draw 5 winning numbers (1-45). If your rolling 5 scores match any of these numbers, you win! 
              </p>
              <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-4">
                <div className="flex justify-between text-sm uppercase font-bold tracking-widest opacity-60">
                   <span>Match</span>
                   <span>Reward</span>
                </div>
                <div className="flex justify-between font-black text-xl">
                   <span>5 Numbers</span>
                   <span className="text-primary">₹250,000+</span>
                </div>
                <div className="flex justify-between font-black text-lg">
                   <span>4 Numbers</span>
                   <span>₹15,000</span>
                </div>
                <div className="flex justify-between font-black">
                   <span>3 Numbers</span>
                   <span>₹1,600</span>
                </div>
              </div>
            </div>
            <div className="aspect-square rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center relative group">
               <div className="absolute inset-0 bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="text-6xl font-black text-white/5 group-hover:text-primary transition-colors">JACKPOT</div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 aspect-square rounded-[3rem] bg-white/5 border border-white/10 flex items-center justify-center">
               <Heart className="w-32 h-32 text-primary/20" />
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                Step 04
              </div>
              <h2 className="text-4xl font-extrabold">Impact Delivery.</h2>
              <p className="text-lg text-foreground/60 leading-relaxed">
                Regardless of the draw outcome, your charity receives its contribution monthly. We provide full transparency reports so you can see the collective impact of the ImpactSphere community.
              </p>
              <Link href="/charities" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
                Explore Partner Charities
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        <section className="pt-20 pb-40 text-center">
           <div className="p-12 md:p-20 rounded-[4rem] bg-gradient-to-tr from-primary to-accent relative overflow-hidden group">
              <div className="absolute inset-0 bg-black/20" />
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white">Start Your Journey.</h2>
                <p className="text-white/80 max-w-xl mx-auto text-lg leading-relaxed font-medium">
                  Join hundreds of golfers who are turning their game into a force for good.
                </p>
                <Link href="/signup" className="inline-block px-10 py-5 rounded-full bg-white text-black font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-2xl">
                   Join ImpactSphere Now
                </Link>
              </div>
           </div>
        </section>
      </main>
    </div>
  )
}
