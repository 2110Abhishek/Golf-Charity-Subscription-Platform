import Link from "next/link";
import { ArrowRight, Heart, Trophy, Activity } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-grid-pattern relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] pointer-events-none z-0" />
      
      {/* Navigation placeholder */}
      <nav className="relative z-10 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <div className="text-2xl font-bold tracking-tighter">
          <span className="text-primary">Impact</span>Sphere
        </div>
        <div className="flex gap-6 items-center">
          <Link href="/charities" className="text-foreground/80 hover:text-white transition-colors">Charities</Link>
          <Link href="/login" className="px-5 py-2 rounded-full border border-white/10 hover:bg-white/5 transition-colors">
            Sign In
          </Link>
          <Link href="/signup" className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-32 pb-20 px-6 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm mb-8">
          <Heart className="w-4 h-4 text-accent" />
          <span>Play with Purpose. Win with Impact.</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
          Elevate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Game.</span><br/>
          Elevate <span className="text-white">Others.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-foreground/70 mb-10 max-w-2xl">
          A next-generation subscription platform linking your performance on the course to life-changing charitable giving and monthly prize pools.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/signup" className="group flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all hover:scale-105 active:scale-95">
            Start Your Journey
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/how-it-works" className="px-8 py-4 rounded-full border border-white/10 bg-white/5 font-semibold text-lg hover:bg-white/10 transition-colors">
            Learn How It Works
          </Link>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="relative z-10 max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-3 gap-8">
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <Activity className="w-10 h-10 text-primary mb-6" />
          <h3 className="text-2xl font-bold mb-3">Track Performance</h3>
          <p className="text-foreground/70">
            Log your latest Stableford scores in our streamlined engine. Only your last 5 rounds matter.
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <Trophy className="w-10 h-10 text-accent mb-6" />
          <h3 className="text-2xl font-bold mb-3">Monthly Draws</h3>
          <p className="text-foreground/70">
            Your scores turn into tickets. Match 3, 4, or 5 numbers in our monthly algorithm draw to win big.
          </p>
        </div>
        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm">
          <Heart className="w-10 h-10 text-primary mb-6" />
          <h3 className="text-2xl font-bold mb-3">Charitable Impact</h3>
          <p className="text-foreground/70">
            A fixed portion of your subscription goes directly to a verified charity of your choice.
          </p>
        </div>
      </section>
    </div>
  );
}
