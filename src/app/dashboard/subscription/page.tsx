import { createClient } from '@/utils/supabase/server'
import { Check, CreditCard, Star, Zap } from 'lucide-react'
import Link from 'next/link'
import { processMockPayment } from './actions'

export default async function SubscriptionPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user?.id)
    .single()

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Impact',
      price: '₹1,599',
      period: '/mo',
      description: 'The standard way to play and give.',
      features: [
        'Entry into Monthly Draw',
        '10% Charity Contribution',
        'Classic Dashboard Access',
        'Rolling 5 Score Tracking'
      ],
      cta: 'Choose Monthly',
      accent: false
    },
    {
      id: 'yearly',
      name: 'Yearly Legend',
      price: '₹15,999',
      period: '/yr',
      description: 'The ultimate commitment to impact.',
      features: [
        'Entry into Monthly Draw',
        'Higher Charity Impact (Fixed)',
        'Founder Badge on Profile',
        '2 Months Free (Savings)',
        'Priority Draw Notifications'
      ],
      cta: 'Choose Yearly',
      accent: true
    }
  ]

  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Subscription.</h1>
        <p className="text-xl text-foreground/60 leading-relaxed">
          Manage your membership and the power of your impact. Choose the plan that fits your journey.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`p-10 rounded-[3rem] border transition-all flex flex-col ${
              plan.accent 
                ? 'bg-primary text-primary-foreground border-primary shadow-2xl shadow-primary/20' 
                : 'bg-white/5 border-white/10'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-8 ${
              plan.accent ? 'bg-black/10' : 'bg-primary/10 text-primary'
            }`}>
              {plan.accent ? <Star className="w-6 h-6" /> : <Zap className="w-6 h-6" />}
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p className={`mb-8 ${plan.accent ? 'text-primary-foreground/70' : 'text-foreground/40'}`}>
                {plan.description}
              </p>
              
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-5xl font-black">{plan.price}</span>
                <span className={`text-lg ${plan.accent ? 'text-primary-foreground/60' : 'text-foreground/40'}`}>
                  {plan.period}
                </span>
              </div>

              <div className="space-y-4 mb-10">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className={`w-5 h-5 ${plan.accent ? 'text-primary-foreground' : 'text-primary'}`} />
                    <span className="font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            <form action={processMockPayment}>
              <input type="hidden" name="planId" value={plan.id} />
              <button 
                type="submit"
                className={`w-full py-5 rounded-full font-bold text-lg transition-all ${
                  plan.accent 
                    ? 'bg-black text-white hover:bg-black/80' 
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }`}
              >
                {plan.cta}
              </button>
            </form>
          </div>
        ))}
      </div>

      <div className="p-8 rounded-[2rem] bg-white/5 border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="p-4 rounded-2xl bg-white/5">
            <CreditCard className="w-8 h-8 text-foreground/40" />
          </div>
          <div>
            <h4 className="font-bold">Next Billing Cycle</h4>
            <p className="text-sm text-foreground/40">You will be charged ₹1,599.00 on May 12, 2026.</p>
          </div>
        </div>
        <button className="px-8 py-3 rounded-xl border border-white/10 text-sm font-bold hover:bg-white/5 transition-colors">
          Manage Billing in Stripe
        </button>
      </div>
    </div>
  )
}
