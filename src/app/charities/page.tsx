import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Heart, Globe, ArrowRight } from 'lucide-react'

export default async function CharitiesPage() {
  const supabase = await createClient()
  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .order('is_featured', { ascending: false })

  return (
    <div className="min-h-screen bg-[#050505] bg-grid-pattern relative pb-20">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505] pointer-events-none z-0" />
      
      <header className="relative z-10 p-6 max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold tracking-tighter">
          <span className="text-primary">Impact</span>Sphere
        </Link>
        <Link href="/signup" className="px-5 py-2 rounded-full bg-primary text-primary-foreground font-semibold">
          Join Now
        </Link>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 mt-20">
        <div className="max-w-2xl mb-16">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            Global <span className="text-primary">Impact.</span>
          </h1>
          <p className="text-xl text-foreground/60">
            Every subscription fuels change. Explore the charities we support and choose your cause.
          </p>
        </div>

        {!charities || charities.length === 0 ? (
          <div className="p-20 text-center rounded-3xl bg-white/5 border border-white/10">
            <Heart className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold">No charities listed yet.</h3>
            <p className="text-foreground/60">We're currently onboarding new partners.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charities.map((charity) => (
              <div key={charity.id} className="group relative rounded-3xl bg-white/5 border border-white/10 overflow-hidden hover:border-primary/50 transition-colors">
                <div className="aspect-[16/9] bg-white/5 relative overflow-hidden">
                  {charity.image_url ? (
                    <img 
                      src={charity.image_url} 
                      alt={charity.name}
                      className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Heart className="w-12 h-12 text-foreground/10" />
                    </div>
                  )}
                  {charity.is_featured && (
                    <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                      FEATURED
                    </div>
                  )}
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-3">{charity.name}</h3>
                  <p className="text-foreground/60 mb-6 line-clamp-2">
                    {charity.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Link 
                      href={`/charities/${charity.id}`}
                      className="inline-flex items-center gap-2 text-primary font-bold hover:underline"
                    >
                      View Profile
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    {charity.website_url && (
                      <a href={charity.website_url} target="_blank" rel="noopener noreferrer" className="text-foreground/40 hover:text-white transition-colors">
                        <Globe className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
