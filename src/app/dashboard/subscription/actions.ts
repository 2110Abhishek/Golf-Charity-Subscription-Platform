'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { sendEmail } from '@/utils/notifications'

export async function processMockPayment(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const planId = formData.get('planId') as string
  // Use upsert to ensure profile exists and is updated
  const { error } = await supabase
    .from('profiles')
    .upsert({ 
      id: user.id,
      email: user.email,
      subscription_status: 'active',
      subscription_id: `mock_${planId}_${Date.now()}`
    }, { onConflict: 'id' })

  if (error) {
    console.error('Mock payment database error:', error)
    return { error: error.message }
  }

  // 7. Send Mock Email
  await sendEmail({
    to: user.email!,
    subject: '⛳️ Welcome to the Club! Your ImpactSphere Subscription is Active',
    template: 'subscription_active',
    body: `Your ${planId === 'monthly' ? 'Monthly' : 'Yearly'} subscription is now active. You can now enter your scores and participate in the monthly draws while supporting your chosen charity.`
  })

  revalidatePath('/', 'layout')
  revalidatePath('/dashboard', 'layout')
  
  redirect('/dashboard')
}
