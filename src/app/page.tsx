import Link from "next/link";
import { ArrowRight, Heart, Trophy, Activity } from "lucide-react";
import { MobileMenu } from "@/components/ui/MobileMenu";

export default function Home() {
  return (
    <div className="min-h-screen bg-grid-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] pointer-events-none z-0" />
           {/* Navigation */}
      <nav className="relative z-20 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          <span className="text-primary">Impact</span>Sphere
        </Link>
        
        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          <Link href="/charities" className="text-foreground/80 hover:text-white transition-colors font-medium">Charities</Link>
          <Link href="/login" className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-medium">
            Sign In
          </Link>
          <Link href="/signup" className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/20">
            Get Started
          </Link>
        </div>

        {/* Mobile Nav */}
        <MobileMenu 
          type="public"
          footer={
            <Link href="/signup" className="block w-full text-center px-6 py-4 rounded-2xl bg-primary text-primary-foreground font-bold">
              Get Started
            </Link>
          }
        />
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-24 md:pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs md:sm mb-8 animate-in fade-in slide-in-from-top duration-1000">
          <Heart className="w-3 md:w-4 h-3 md:h-4 text-accent" />
          <span className="font-bold tracking-tight">Play with Purpose. Win with Impact.</span>
        </div>
        
        <h1 className="text-5xl md:text-8xl font-black tracking-tight mb-8 leading-[1.05]">
          Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-primary animate-gradient-x">Game.</span><br/>
          Elevate <span className="text-white">Others.</span>
        </h1>
        
        <p className="text-base md:text-xl text-foreground/70 mb-10 max-w-2xl leading-relaxed">
          A next-generation subscription platform linking your performance on the course to life-changing charitable giving and monthly prize pools.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link href="/signup" className="group flex items-center justify-center gap-3 px-10 py-5 rounded-full bg-primary text-primary-foreground font-black text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20">
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/how-it-works" className="px-10 py-5 rounded-full border border-white/10 bg-white/5 font-bold text-lg hover:bg-white/10 transition-all hover:scale-105">
            Learn How It Works
          </Link>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all hover:scale-[1.02]">
          <Activity className="w-12 h-12 text-primary mb-8 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-4">Track Performance</h3>
          <p className="text-foreground/60 leading-relaxed font-medium">
            Log your latest Stableford scores in our streamlined engine. Only your last 5 rounds matter for the weight of your entries.
          </p>
        </div>
        <div className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all hover:scale-[1.02]">
          <Trophy className="w-12 h-12 text-accent mb-8 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-4">Monthly Draws</h3>
          <p className="text-foreground/60 leading-relaxed font-medium">
            Your scores turn into tickets. Match 3, 4, or 5 numbers in our monthly algorithm draw to win large prize pools.
          </p>
        </div>
        <div className="group p-10 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/[0.08] transition-all hover:scale-[1.02]">
          <Heart className="w-12 h-12 text-primary mb-8 group-hover:scale-110 transition-transform" />
          <h3 className="text-2xl font-bold mb-4">Charitable Impact</h3>
          <p className="text-foreground/60 leading-relaxed font-medium">
            A fixed portion of your monthly subscription is sent directly to a verified charity partner of your choice.
          </p>
        </div>
      </section>
    </div>
  );
}
