import { createClient } from '@/utils/supabase/server'
import RunDrawClient from './RunDrawClient'

export default async function RunDrawPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Fetch draw details
  const { data: draw } = await supabase
    .from('draws')
    .select('*')
    .eq('id', id)
    .single()

  // Fetch real subscriber count
  const { count: activeSubs } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })
    .eq('subscription_status', 'active')

  // Fetch all recent scores to calculate "Hot Numbers" for weighted logic
  const { data: allRecentScores } = await supabase
    .from('scores')
    .select('score')
    .order('created_at', { ascending: false })
    .limit(1000)

  const { getHotNumbers } = await import('@/utils/draw-engine')
  const hotNumbers = getHotNumbers(allRecentScores?.map(s => s.score) || [])

  const formattedDate = draw?.draw_month 
    ? new Date(draw.draw_month).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })
    : 'Unknown Month'
  const totalPool = (activeSubs || 0) * 19 * 0.40 // 40% of $19 fee

  return (
    <div className="max-w-4xl mx-auto py-10">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight mb-2">Execute Draw.</h1>
        <p className="text-foreground/40 font-medium">
          Running draw for {formattedDate} • Current Pool: ₹{totalPool.toLocaleString()}
        </p>
      </div>

      <RunDrawClient 
        drawId={id} 
        activeSubs={activeSubs || 0} 
        totalPool={totalPool} 
        hotNumbers={hotNumbers}
      />
    </div>
  )
}
