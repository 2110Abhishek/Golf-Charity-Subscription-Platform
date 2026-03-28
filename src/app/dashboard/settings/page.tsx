import { createClient } from '@/utils/supabase/server'
import { Heart, User, Shield, Zap } from 'lucide-react'
import { updateUserSettings } from './actions'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, charities(name)')
    .eq('id', user?.id)
    .single()

  const { data: charities } = await supabase
    .from('charities')
    .select('*')
    .order('name')

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Settings.</h1>
        <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl">
          Personalize your experience and manage your impact.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Profile Section */}
          <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Profile Info</h3>
            </div>
            
            <div className="grid gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40">Email Address</label>
                <div className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-foreground/60">
                  {user?.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40">Status</label>
                <div className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                  <Zap className="w-4 h-4 text-primary" />
                  <span className="font-bold uppercase tracking-tighter text-sm">
                    {profile?.subscription_status || 'Trial'} Mode
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Charity Selection Section */}
          <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 space-y-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-accent/10 text-accent">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Charity Impact</h3>
            </div>
            
            <form action={updateUserSettings} className="space-y-8">
              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40">Choose Your Cause</label>
                <select 
                  name="charity_id"
                  defaultValue={profile?.selected_charity_id || ""}
                  className="w-full bg-[#111] border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:border-primary/50 transition-all"
                >
                  <option value="" disabled>Select a charity...</option>
                  {charities?.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40">Impact Percentage</label>
                <div className="grid grid-cols-4 gap-4">
                  {[10, 20, 30, 50].map(pct => (
                    <label key={pct} className="relative cursor-pointer group">
                      <input 
                        type="radio" 
                        name="percentage" 
                        value={pct}
                        defaultChecked={profile?.charity_percentage === pct || (pct === 10 && !profile?.charity_percentage)}
                        className="peer sr-only"
                      />
                      <div className="px-4 py-5 rounded-2xl border border-white/5 bg-white/5 text-center transition-all peer-checked:bg-primary/10 peer-checked:border-primary/50 peer-checked:text-primary group-hover:bg-white/10">
                        <span className="text-xl font-black">{pct}%</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all shadow-[0_20px_40px_-10px_rgba(0,196,255,0.3)]"
              >
                Save Preferences
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 rounded-[2.5rem] bg-accent/5 border border-accent/10 space-y-4">
            <h4 className="text-lg font-bold flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" />
              Privacy & Security
            </h4>
            <p className="text-xs text-foreground/40 leading-relaxed">
              We never share your golf scores with 3rd parties. Impact settings are private between you and your chosen charity.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
