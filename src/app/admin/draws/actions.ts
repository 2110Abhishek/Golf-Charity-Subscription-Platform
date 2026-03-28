'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createNextDraw() {
  const supabase = await createClient()

  // Get the most recent draw to determine the next month
  const { data: lastDraw } = await supabase
    .from('draws')
    .select('draw_month')
    .order('draw_month', { ascending: false })
    .limit(1)
    .single()

  let nextDate: Date
  if (lastDraw) {
    nextDate = new Date(lastDraw.draw_month)
    nextDate.setMonth(nextDate.getMonth() + 1)
  } else {
    // Start with current month if no draws exist
    nextDate = new Date()
    nextDate.setDate(1) // First of the month
  }

  // Calculate current pool based on active subscribers
  const { count: activeSubs } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  const totalPool = (activeSubs || 0) * 1599 * 0.40 // 40% of standard fee

  const { error } = await supabase
    .from('draws')
    .insert({
      draw_month: nextDate.toISOString(),
      status: 'pending',
      total_pool: totalPool,
      jackpot_rollover: 0 // Reset for new draw, or logic to inherit from previous
    })

  if (error) {
    console.error('Create draw error:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/draws')
  return { success: true }
}
