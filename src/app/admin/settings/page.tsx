import { Shield, Bell, Database, Lock } from 'lucide-react'

export default function AdminSettingsPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-5xl font-extrabold tracking-tight mb-4">Settings.</h1>
        <p className="text-xl text-foreground/60 leading-relaxed max-w-2xl">
          Manage system parameters, security policies, and platform configurations.
        </p>
      </div>

      <div className="grid gap-6">
        <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-start gap-8">
          <div className="p-4 rounded-2xl bg-primary/10 text-primary">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-4">
            <h3 className="text-xl font-bold">Platform Fees & Allocation</h3>
            <p className="text-sm text-foreground/40 max-w-md">
              Configure how much of the ₹1,599 subscription fee goes to the prize pool vs. charity partners.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40">Prize Pool (%)</label>
                <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 font-bold">40%</div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase font-black tracking-widest text-foreground/40">Charity Impact (%)</label>
                <div className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 font-bold">10%</div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-start gap-8 opacity-50 cursor-not-allowed">
          <div className="p-4 rounded-2xl bg-yellow-400/10 text-yellow-400">
            <Bell className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-bold">Notifications</h3>
            <p className="text-sm text-foreground/40">Automated email alerts for winners and admins.</p>
          </div>
          <span className="px-3 py-1 rounded-full bg-white/10 text-[8px] font-black uppercase tracking-widest">Enterprise Only</span>
        </div>

        <div className="p-10 rounded-[2.5rem] bg-white/5 border border-white/10 flex items-start gap-8">
          <div className="p-4 rounded-2xl bg-accent/10 text-accent">
            <Database className="w-6 h-6" />
          </div>
          <div className="flex-1 space-y-2">
            <h3 className="text-xl font-bold">Database Backups</h3>
            <p className="text-sm text-foreground/40">Daily snapshots are handled automatically by Supabase.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
