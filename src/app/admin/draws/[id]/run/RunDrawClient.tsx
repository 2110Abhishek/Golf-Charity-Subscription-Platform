'use client'

import { useState } from 'react'
import { Play, ShieldAlert, CheckCircle, ArrowRight, Loader, X } from 'lucide-react'
import Link from 'next/link'
import { publishDrawResults } from './actions'
import { generateWinningNumbers } from '@/utils/draw-engine'

interface RunDrawClientProps {
  drawId: string
  activeSubs: number
  totalPool: number
  hotNumbers?: number[]
}

export default function RunDrawClient({ drawId, activeSubs, totalPool, hotNumbers = [] }: RunDrawClientProps) {
  const [stage, setStage] = useState<'idle' | 'simulating' | 'results' | 'published'>('idle')
  const [logic, setLogic] = useState<'random' | 'weighted'>('random')
  const [winningNumbers, setWinningNumbers] = useState<number[]>([])
  const [isPublishing, setIsPublishing] = useState(false)

  const simulateDraw = () => {
    setStage('simulating')
    setTimeout(() => {
      const numbers = generateWinningNumbers(logic, hotNumbers)
      setWinningNumbers(numbers)
      setStage('results')
    }, 2000)
  }

  const handlePublish = async () => {
    setIsPublishing(true)
    const result = await publishDrawResults(drawId, winningNumbers)
    if (result.success) {
      setStage('published')
    } else {
      alert('Error publishing: ' + result.error)
    }
    setIsPublishing(false)
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 space-y-12">
      {stage === 'idle' && (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
          <div className="grid md:grid-cols-2 gap-8">
            <button 
              onClick={() => setLogic('random')}
              className={`p-8 rounded-3xl border text-left transition-all ${
                logic === 'random' ? 'bg-primary/10 border-primary' : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${
                logic === 'random' ? 'bg-primary text-primary-foreground' : 'bg-white/5 text-foreground/40'
              }`}>
                <Play className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">Random Lottery</h3>
              <p className="text-sm text-foreground/40">Standard RNG generator. Equal probability for all combinations (1-45).</p>
            </button>
            
            <button 
              onClick={() => setLogic('weighted')}
              className={`p-8 rounded-3xl border text-left transition-all ${
                logic === 'weighted' ? 'bg-accent/10 border-accent' : 'bg-black/40 border-white/10 hover:border-white/20'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-6 ${
                logic === 'weighted' ? 'bg-accent text-white' : 'bg-white/5 text-foreground/40'
              }`}>
                <ShieldAlert className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-2">Weighted Impact</h3>
              <p className="text-sm text-foreground/40">Optimized distribution based on active subscriber score trends.</p>
            </button>
          </div>

          <button 
            onClick={simulateDraw}
            className="w-full py-6 rounded-full bg-primary text-primary-foreground font-black text-xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/20"
          >
            Run Real-Time Simulation
          </button>
        </div>
      )}

      {stage === 'simulating' && (
        <div className="py-20 flex flex-col items-center gap-8 animate-pulse text-center">
          <Loader className="w-16 h-16 text-primary animate-spin" />
          <div>
            <h2 className="text-3xl font-bold mb-2">Analyzing {activeSubs} Subscriptions</h2>
            <p className="text-foreground/40">Calculating prize distributions for the ₹{totalPool.toLocaleString()} pool...</p>
          </div>
        </div>
      )}

      {stage === 'results' && (
        <div className="space-y-10 animate-in zoom-in duration-500">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Simulation Complete.</h2>
            <p className="text-foreground/60">Generated numbers using {logic === 'random' ? 'Random Gen' : 'Weighted Weighting'}</p>
          </div>

          <div className="flex justify-center gap-4">
            {winningNumbers.map((n, i) => (
              <div key={i} className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white text-black flex items-center justify-center text-3xl font-black shadow-xl">
                {n}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-10 border-t border-white/5">
            <div className="text-center">
              <p className="text-xs font-bold text-foreground/40 uppercase mb-2">5-Match Winners</p>
              <p className="text-2xl font-black text-primary">0</p>
              <p className="text-[10px] text-foreground/40 mt-1">Jackpot Rollover: Yes</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground/40 uppercase mb-2">4-Match Winners (Estimated)</p>
              <p className="text-2xl font-black">Est. 2-5</p>
              <p className="text-[10px] text-foreground/40 mt-1">₹{(totalPool * 0.3 / 3).toLocaleString()} avg</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-foreground/40 uppercase mb-2">3-Match Winners (Estimated)</p>
              <p className="text-2xl font-black">Est. 10-20</p>
              <p className="text-[10px] text-foreground/40 mt-1">₹{(totalPool * 0.2 / 15).toLocaleString()} avg</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={() => setStage('idle')}
              className="flex-1 py-4 rounded-full border border-white/10 hover:bg-white/5 transition-colors font-bold disabled:opacity-50"
              disabled={isPublishing}
            >
              Discard & Retry
            </button>
            <button 
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex-[2] py-4 rounded-full bg-primary text-primary-foreground font-black hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isPublishing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Generating Winners...
                </>
              ) : (
                <>
                  Publish Official Results
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {stage === 'published' && (
        <div className="py-20 text-center space-y-8 animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-primary" />
          </div>
          <div>
            <h2 className="text-4xl font-extrabold mb-3">Draw Published.</h2>
            <p className="text-foreground/60 max-w-sm mx-auto">
              Real winners have been selected and entered into the audit system. Results are now live for players.
            </p>
          </div>
          <Link 
            href="/admin/draws" 
            className="inline-flex py-4 px-10 rounded-full bg-white text-black font-bold hover:scale-105 transition-all"
          >
            Back to Draw History
          </Link>
        </div>
      )}
    </div>
  )
}
