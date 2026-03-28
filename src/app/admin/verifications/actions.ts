'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateVerificationStatus(id: string, status: 'approved' | 'rejected') {
  const supabase = await createClient()

  const { error } = await supabase
    .from('winner_verifications')
    .update({ status })
    .eq('id', id)

  if (error) {
    console.error('Error updating verification status:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/verifications')
  revalidatePath('/admin') // Update badge in header
  return { success: true }
}
