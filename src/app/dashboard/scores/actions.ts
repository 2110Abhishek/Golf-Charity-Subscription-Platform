'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitScore(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized')
  }

  const score = parseInt(formData.get('score') as string)
  const datePlayed = formData.get('date_played') as string

  if (isNaN(score) || score < 1 || score > 45) {
    throw new Error('Invalid score. Must be between 1 and 45.')
  }

  // 1. Insert the new score
  const { error: insertError } = await supabase
    .from('scores')
    .insert({
      user_id: user.id,
      score: score,
      date_played: datePlayed
    })

  if (insertError) {
    throw new Error(insertError.message)
  }

  // 2. Fetch all scores for this user, ordered by date (descending)
  const { data: scores } = await supabase
    .from('scores')
    .select('id')
    .eq('user_id', user.id)
    .order('date_played', { ascending: false })
    .order('created_at', { ascending: false })

  // 3. Maintain only the latest 5 scores
  if (scores && scores.length > 5) {
    const oldestScores = scores.slice(5)
    const oldestIds = oldestScores.map(s => s.id)

    const { error: deleteError } = await supabase
      .from('scores')
      .delete()
      .in('id', oldestIds)

    if (deleteError) {
      console.error('Failed to delete old scores:', deleteError)
    }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
