import { createClient } from '@/utils/supabase/server'
import { Plus, Edit3, Trash2, Heart, ExternalLink, Star } from 'lucide-react'
import Link from 'next/link'

import CharityCard from './CharityCard'

export default async function AdminCharitiesPage() {
  const supabase = await createClient()
  
  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Charity Directory.</h1>
          <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl">
            Managing verified partners and spotlighting impactful causes.
          </p>
        </div>
        <Link 
          href="/admin/charities/new"
          className="flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-xl shadow-primary/10"
        >
          <Plus className="w-5 h-5" />
          Add New Charity
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {charities?.map((charity) => (
          <CharityCard key={charity.id} charity={charity} />
        ))}

        <Link 
          href="/admin/charities/new"
          className="p-8 rounded-[2.5rem] border-2 border-dashed border-white/5 hover:border-white/10 hover:bg-white/[0.02] transition-all flex flex-col items-center justify-center gap-4 group"
        >
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Plus className="w-8 h-8 text-foreground/20" />
            </div>
            <span className="font-bold text-foreground/40">Register New Partner</span>
        </Link>
      </div>
    </div>
  )
}
