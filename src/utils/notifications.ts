/**
 * Mock Email Notification Utility
 * Logs system emails to the console in development
 */

export async function sendEmail({
  to,
  subject,
  body,
  template
}: {
  to: string
  subject: string
  body: string
  template: 'welcome' | 'draw_results' | 'winner_alert' | 'subscription_active'
}) {
  console.log('----------------------------------------------------')
  console.log(`📧 MOCK EMAIL SENT TO: ${to}`)
  console.log(`🔖 SUBJECT: ${subject}`)
  console.log(`📁 TEMPLATE: ${template}`)
  console.log('----------------------------------------------------')
  console.log(body)
  console.log('----------------------------------------------------')
  
  return { success: true }
}

export async function notifyWinners(winners: { email: string; prize: number }[]) {
    for (const winner of winners) {
        await sendEmail({
            to: winner.email,
            subject: '🏆 You matching numbers in the Monthly Draw!',
            template: 'winner_alert',
            body: `Congratulations! You matched numbers in the latest draw and won ₹${winner.prize}. Log in to specify your proof and claim your prize.`
        })
    }
}

export async function notifyDrawPublished(subscriberEmails: string[], drawMonth: string) {
    console.log(`📢 Notifying ${subscriberEmails.length} subscribers about ${drawMonth} results.`)
    // In a real app, we'd use a BCC or a bulk email service
    await sendEmail({
        to: 'subscribers@impactsphere.com',
        subject: `⛳️ The ${drawMonth} Draw Results are Live!`,
        template: 'draw_results',
        body: `The winning numbers for ${drawMonth} have been drawn. Head over to your dashboard to see if you've won!`
    })
}
