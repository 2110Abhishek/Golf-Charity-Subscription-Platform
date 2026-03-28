'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitWinnerProof(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const drawEntryId = formData.get('draw_entry_id') as string

  // Mock file upload - In a real app we'd upload to Supabase Storage
  // For now we'll use a high-quality placeholder image to simulate a scorecard
  const mockProofUrl = `https://images.unsplash.com/photo-1535131749006-b7f58c99034b?q=80&w=2070&auto=format&fit=crop`

  const { error } = await supabase
    .from('winner_verifications')
    .upsert([{
      draw_entry_id: drawEntryId,
      proof_url: mockProofUrl,
      status: 'pending'
    }], { onConflict: 'draw_entry_id' })

  if (error) {
    console.error('Error submitting proof:', error)
    return { error: error.message }
  }

  revalidatePath(`/dashboard/winnings/${drawEntryId}`)
  revalidatePath('/admin/verifications')
  return { success: true }
}
