'use client'

import { useState } from 'react'
import { submitScore } from '../actions'
import { useRouter } from 'next/navigation'
import { Activity, ArrowLeft, Target, Calendar } from 'lucide-react'
import Link from 'next/link'

export default function NewScorePage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    try {
      await submitScore(formData)
      router.push('/dashboard')
    } catch (err: any) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-foreground/40 hover:text-white mb-10 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <div className="space-y-2 mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight">Post Score.</h1>
        <p className="text-foreground/60">Enter your latest Stableford round result.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 p-10 rounded-[2.5rem] bg-white/5 border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-primary/5">
          <Target className="w-32 h-32" />
        </div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest px-1">Stableford Score</label>
            <div className="relative">
              <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="number"
                name="score"
                min="1"
                max="45"
                placeholder="Range: 1 - 45"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-colors text-xl font-bold"
                required
              />
            </div>
            <p className="text-xs text-foreground/40 px-1">Only your last 5 scores are used for monthly draws.</p>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-bold text-foreground/40 uppercase tracking-widest px-1">Date Played</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
              <input
                type="date"
                name="date_played"
                defaultValue={new Date().toISOString().split('T')[0]}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-primary/50 transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-accent text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground font-bold py-5 rounded-full hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 disabled:opacity-50 relative z-10"
        >
          {loading ? 'Processing...' : 'Submit Round'}
        </button>
      </form>
    </div>
  )
}
