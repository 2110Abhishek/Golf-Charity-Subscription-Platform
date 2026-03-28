import { createCharity } from '../actions'
import Link from 'next/link'
import { ArrowLeft, Heart, Globe, Image as ImageIcon, Star } from 'lucide-react'

export default function NewCharityPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Link 
        href="/admin/charities" 
        className="inline-flex items-center gap-2 text-foreground/40 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Directory
      </Link>

      <div className="max-w-3xl mx-auto space-y-12 pb-32">
        <div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">New Partner.</h1>
          <p className="text-xl text-foreground/60 leading-relaxed">
            Register a new charitable organization to the ImpactSphere network.
          </p>
        </div>

        <form 
          action={async (formData) => {
            'use server'
            await createCharity(formData)
          }} 
          className="space-y-8 p-12 rounded-[3.5rem] bg-white/5 border border-white/10 backdrop-blur-3xl"
        >
          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-widest text-foreground/40 px-6">Organization Name</label>
            <input 
              name="name" 
              required
              placeholder="e.g. Hope Foundation"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-xl font-bold focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all"
            />
          </div>

          <div className="space-y-4">
            <label className="block text-xs font-black uppercase tracking-widest text-foreground/40 px-6">Description (Elevator Pitch)</label>
            <textarea 
              name="description" 
              required
              rows={4}
              placeholder="Clearly state the organization's mission and impact..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 px-8 text-lg font-medium focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all resize-none"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-foreground/40 px-6 flex items-center gap-2">
                <Globe className="w-3 h-3" />
                Website URL
              </label>
              <input 
                name="website_url" 
                type="url"
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-primary/50"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-xs font-black uppercase tracking-widest text-foreground/40 px-6 flex items-center gap-2">
                <ImageIcon className="w-3 h-3" />
                Thumbnail URL
              </label>
              <input 
                name="image_url" 
                type="url"
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm font-bold focus:outline-none focus:border-primary/50"
              />
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-primary/20 transition-all">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Star className="w-6 h-6 fill-current" />
                </div>
                <div>
                   <h4 className="font-bold">Featured Spotlight</h4>
                   <p className="text-xs text-foreground/40">Promote this charity on the public homepage.</p>
                </div>
            </div>
            <input 
                type="checkbox" 
                name="is_featured"
                className="w-6 h-6 rounded-lg bg-white/5 border-white/10 text-primary focus:ring-primary/20 accent-primary" 
            />
          </div>

          <div className="pt-8">
            <button className="w-full py-6 rounded-3xl bg-primary text-primary-foreground text-xl font-black hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-2xl shadow-primary/20">
               Confirm Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
