'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { notifyWinners, notifyDrawPublished } from '@/utils/notifications'

export async function publishDrawResults(drawId: string, winningNumbers: number[]) {
  if (!drawId) return { error: 'Draw ID is required' }
  const supabase = await createClient()

  console.log('Publishing draw results for Draw ID:', drawId)

  // 1. Get all active subscribers
  const { data: subscribers, error: subError } = await supabase
    .from('profiles')
    .select('id, email')
    .eq('subscription_status', 'active')

  if (subError) return { error: subError.message }
  if (!subscribers) return { error: 'No active subscribers found' }

  // 2. For each subscriber, get their latest 5 scores
  const entries: any[] = []
  
  for (const sub of subscribers) {
    const { data: scores } = await supabase
      .from('scores')
      .select('score')
      .eq('user_id', sub.id)
      .order('date_played', { ascending: false })
      .limit(5)

    if (!scores || scores.length < 5) continue

    const userScores = scores.map(s => s.score)
    // Calculate matches
    const matches = userScores.filter(s => winningNumbers.includes(s)).length

    entries.push({
      draw_id: drawId,
      user_id: sub.id,
      scores: userScores,
      match_count: matches,
      prize_amount: matches >= 3 ? calculatePrize(matches) : 0
    })
  }

  if (entries.length === 0) {
    // If no one had 5 scores, we still finish the draw
    await supabase.from('draws').update({ status: 'published', winning_numbers: winningNumbers }).eq('id', drawId)
    revalidatePath('/admin/draws')
    return { success: true }
  }

  // 3. Insert draw entries
  const { data: insertedEntries, error: entryError } = await supabase
    .from('draw_entries')
    .insert(entries)
    .select()

  if (entryError) return { error: entryError.message }

  // 4. Create winner verifications for matches >= 3
  const winners = insertedEntries.filter(e => e.match_count >= 3)
  if (winners.length > 0) {
    const verifications = winners.map(w => ({
      draw_entry_id: w.id,
      status: 'pending',
      user_id: w.user_id // Adding user_id for easier tracking, though not in original schema, let's check
    }))

    // Wait, my schema doesn't have user_id in winner_verifications. 
    // It has draw_entry_id which links to draw_entries which has user_id.
    const cleanVerifications = winners.map(w => ({
      draw_entry_id: w.id,
      status: 'pending'
    }))

    await supabase.from('winner_verifications').insert(cleanVerifications)
  }

  // 5. Update draw status
  await supabase
    .from('draws')
    .update({ 
      status: 'published',
      winning_numbers: winningNumbers
    })
    .eq('id', drawId)

  // 6. Send Mock Notifications
  await notifyDrawPublished(subscribers.map(s => s.email), 'Current Month')
  if (winners.length > 0) {
    const winnerData = winners.map(w => ({
      email: subscribers.find(s => s.id === w.user_id)?.email || 'unknown',
      prize: w.prize_amount
    }))
    await notifyWinners(winnerData)
  }

  revalidatePath('/admin/draws')
  return { success: true }
}

function calculatePrize(matches: number) {
  // Simple logic for now
  if (matches === 5) return 250000
  if (matches === 4) return 15000
  if (matches === 3) return 1600
  return 0
}
