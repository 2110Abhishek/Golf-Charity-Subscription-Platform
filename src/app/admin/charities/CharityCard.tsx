'use client'

import { useState } from 'react'
import { Edit3, Trash2, Heart, ExternalLink, Star, Loader } from 'lucide-react'
import { deleteCharity } from './actions'

interface CharityCardProps {
  charity: any
}

export default function CharityCard({ charity }: CharityCardProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${charity.name}?`)) return
    
    setIsDeleting(true)
    const result = await deleteCharity(charity.id)
    if (result.error) {
      alert('Error deleting: ' + result.error)
      setIsDeleting(false)
    }
  }

  return (
    <div className={`p-8 rounded-[2.5rem] bg-white/5 border border-white/10 relative group hover:border-white/20 transition-all overflow-hidden ${isDeleting ? 'opacity-50 grayscale' : ''}`}>
      <div className="absolute top-0 right-0 p-8 text-foreground/5 transition-transform group-hover:scale-110">
        <Heart className="w-32 h-32" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden">
            {charity.image_url ? (
              <img src={charity.image_url} alt="" className="w-full h-full object-cover" />
            ) : (
              <Heart className="w-8 h-8 text-foreground/20" />
            )}
          </div>
          {charity.is_featured && (
            <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
        </div>

        <h3 className="text-2xl font-bold mb-3">{charity.name}</h3>
        <p className="text-sm text-foreground/40 line-clamp-2 mb-8 leading-relaxed">
          {charity.description}
        </p>

        <div className="flex items-center justify-between pt-8 border-t border-white/5">
          <div className="flex gap-2">
            <button className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <Edit3 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-3 rounded-xl bg-white/5 hover:bg-accent/10 hover:text-accent transition-colors disabled:opacity-50"
            >
              {isDeleting ? <Loader className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          </div>
          {charity.website_url && (
            <a href={charity.website_url} target="_blank" rel="noopener noreferrer" className="p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
