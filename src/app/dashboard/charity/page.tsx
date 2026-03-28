import { createClient } from '@/utils/supabase/server'
import { Heart, Activity, Settings, Save, AlertCircle } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function CharitySettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, charities(*)')
    .eq('id', user?.id)
    .single()

  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .limit(10)

  async function updateCharity(formData: FormData) {
    'use server'
    const charityId = formData.get('charity_id') as string
    const percentage = parseInt(formData.get('percentage') as string)
    
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    await supabase.from('profiles').update({
      selected_charity_id: charityId,
      charity_percentage: percentage
    }).eq('id', user?.id)
    
    redirect('/dashboard/charity?success=true')
  }

  return (
    <div className="space-y-12">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Your Impact.</h1>
        <p className="text-xl text-foreground/60 leading-relaxed">
          Fine-tune how your subscription contributes to the causes you care about.
        </p>
      </div>

      <form action={updateCharity} className="space-y-10">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Heart className="w-6 h-6 text-primary" />
                Select Cause
              </h3>
              
              <div className="space-y-4">
                {charities?.map((charity) => (
                  <label key={charity.id} className="relative flex items-center gap-4 p-4 rounded-2xl bg-black/40 border border-white/10 hover:border-primary/50 cursor-pointer transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                    <input 
                      type="radio" 
                      name="charity_id" 
                      value={charity.id} 
                      defaultChecked={profile?.selected_charity_id === charity.id}
                      className="w-4 h-4 accent-primary" 
                    />
                    <div>
                      <p className="font-bold">{charity.name}</p>
                      <p className="text-xs text-foreground/40">{charity.is_featured ? 'Global Partner' : 'Community Partner'}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-6">
              <h3 className="text-2xl font-bold flex items-center gap-3">
                <Activity className="w-6 h-6 text-accent" />
                Contribute %
              </h3>
              <p className="text-sm text-foreground/40">
                Min 10% is included in your plan. You can voluntarily increase this amount to amplify your impact.
              </p>
              
              <div className="space-y-2">
                <div className="flex justify-between font-bold mb-2">
                  <span>Current: {profile?.charity_percentage || 10}%</span>
                  <span className="text-primary">Impact Amplified</span>
                </div>
                <input 
                  type="range" 
                  name="percentage"
                  min="10" 
                  max="50" 
                  step="5"
                  defaultValue={profile?.charity_percentage || 10}
                  className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary" 
                />
                <div className="flex justify-between text-xs text-foreground/40">
                  <span>10% (Min)</span>
                  <span>50% (Max)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-10 rounded-[3rem] bg-primary text-primary-foreground relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 text-black/10 transition-transform group-hover:scale-110">
                <Heart className="w-40 h-40" />
              </div>
              <h4 className="text-primary-foreground/60 font-bold uppercase tracking-widest mb-10">Current Impact</h4>
              <div className="space-y-4 relative z-10">
                <p className="text-sm font-medium">Supporting</p>
                <h3 className="text-4xl font-black leading-none mb-6">{profile?.charities?.name || 'Loading...'}</h3>
                <div className="h-px bg-black/10 my-6" />
                <div className="flex justify-between items-center">
                  <span className="font-bold">Total Donated</span>
                  <span className="text-2xl font-black">$0.00</span>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-foreground/20 shrink-0" />
              <p className="text-sm text-foreground/40 leading-relaxed">
                Changes to your charity selection or contribution percentage will take effect from your next billing cycle on May 12, 2026.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-8">
          <button className="flex items-center gap-2 px-10 py-5 rounded-full bg-white text-black font-bold hover:scale-105 active:scale-95 transition-all">
            <Save className="w-5 h-5" />
            Save Impact Settings
          </button>
        </div>
      </form>
    </div>
  )
}
