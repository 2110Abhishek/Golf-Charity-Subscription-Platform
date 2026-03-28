'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateUserSettings(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthorized')

  const charity_id = formData.get('charity_id') as string
  const percentage = parseInt(formData.get('percentage') as string)

  const { error } = await supabase
    .from('profiles')
    .update({
      selected_charity_id: charity_id,
      charity_percentage: percentage
    })
    .eq('id', user.id)

  if (error) {
    console.error('Update settings error:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard/settings')
  revalidatePath('/dashboard')
  return { success: true }
}
