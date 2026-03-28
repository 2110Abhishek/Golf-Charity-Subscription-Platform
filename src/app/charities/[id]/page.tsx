import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Heart, ArrowLeft, Globe, Info, Calendar } from 'lucide-react'

export default async function CharityProfilePage({
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
    <div className="min-h-screen bg-[#050505] relative">
      <div className="absolute top-0 left-0 w-full h-[40vh] overflow-hidden">
        {charity.image_url ? (
          <img 
            src={charity.image_url} 
            alt={charity.name}
            className="w-full h-full object-cover opacity-30 blur-sm scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-b from-primary/10 to-transparent" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]" />
      </div>

      <header className="relative z-10 p-6 max-w-7xl mx-auto">
        <Link href="/charities" className="inline-flex items-center gap-2 text-foreground/60 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-20 pb-32">
        <div className="flex flex-col md:flex-row gap-12 items-start">
          <div className="w-full md:w-1/3">
            <div className="aspect-square rounded-3xl bg-white/5 border border-white/10 overflow-hidden mb-8">
              {charity.image_url ? (
                <img src={charity.image_url} alt={charity.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Heart className="w-20 h-20 text-foreground/10" />
                </div>
              )}
            </div>
            
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-6">
              <div>
                <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-2">Impact Type</h4>
                <p className="font-semibold">Subscription Supported</p>
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground/40 uppercase tracking-widest mb-2">Total Contributions</h4>
                <p className="text-2xl font-bold text-primary">$0.00</p>
              </div>
              <button className="w-full py-4 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors">
                Select as My Charity
              </button>
              <Link 
                href={`/charities/${charity.id}/donate`}
                className="block w-full py-4 rounded-full border border-white/10 text-center font-bold hover:bg-white/5 transition-colors"
              >
                Donate Now
              </Link>
            </div>
          </div>

          <div className="w-full md:w-2/3 space-y-12">
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tighter mb-6">{charity.name}</h1>
              <div className="flex gap-4">
                {charity.website_url && (
                  <a href={charity.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm hover:bg-white/10 transition-colors">
                    <Globe className="w-4 h-4" />
                    Official Website
                  </a>
                )}
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm">
                  <Info className="w-4 h-4" />
                  Verified Partner
                </div>
              </div>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-2xl font-bold mb-6">About the Charity</h3>
              <p className="text-xl leading-relaxed text-foreground/70">
                {charity.description || "No description provided."}
              </p>
            </div>

            <div className="space-y-6">
              <h3 className="text-2xl font-bold">Upcoming Events</h3>
              <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                    <Calendar className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold">Charity Golf Day 2026</h4>
                    <p className="text-sm text-foreground/40">October 12, 2026 • Royal Springs Golf Club</p>
                  </div>
                </div>
                <button className="px-6 py-2 rounded-full border border-white/10 text-sm hover:bg-white/5">Register</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
