# Golf Charity Subscription Platform Walkthrough

This document summarizes the implementation of the Golf Charity Subscription Platform as per the PRD requirements.

## 🚀 Key Features Implemented

### 1. Modern, Emotion-Driven UI/UX
- **Design Philosophy**: Moved away from traditional golf cliches. Used a "Deep Obsidian" theme with "Electric Blue" and "Vibrant Coral" accents to focus on tech and charitable impact.
- **Dynamic Homepage**: Clear CTA, impact-first messaging, and feature highlights.
- **Responsive Layouts**: Fully functional and responsive across mobile and desktop.

### 2. Subscription & Payment System (Mocked)
- **Plans**: Supported Monthly ($19) and Yearly ($190) plans.
- **Checkout Flow**: Integrated a mock checkout process that updates user roles and subscription statuses in Supabase.
- **Plan Management**: Users can view their current plan and billing cycle in the dashboard.

### 3. Score Management (Rolling 5 Logic)
- **Stableford Input**: Users can enter scores between 1 and 45.
- **Automated Rolling Logic**: The system automatically retains only the 5 most recent rounds. Adding a 6th round deletes the oldest one.
- **Reverse Chronological Display**: Most recent scores are shown first in the dashboard.

### 4. Charity System
- **Charity Directory**: A searchable, modern grid of verified partners.
- **Charity Profiles**: Detailed views including descriptions, impact stats, and upcoming events (e.g., Charity Golf Days).
- **Contribution Selection**: Users can select a charity and adjust their contribution percentage (Min 10%) from their dashboard.

### 5. Draw & Reward System
- **Prize Pool Logic**: Automatically calculates prize pools (40% Match 5, 35% Match 4, 25% Match 3) based on subscriber count.
- **Draw Simulation**: Admins can run pre-analysis simulations using either Random or Algorithmic (weighted) logic before publishing results.
- **Winner Claims**: Winners can view their matches and upload screenshots for proof of score.

### 6. Admin Control Center
- **Insights Dashboard**: High-level analytics on subscribers, prize pools, and charity impact.
- **User Management**: Searchable registry of all members and their current statuses.
- **Charity Management**: Interface to add, edit, or spotlight partners.
- **Winner Verification**: Queue to review and approve/reject proof submissions.

## 🛠️ Technical Architecture

- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS 4.
- **Backend / DB**: Supabase (PostgreSQL, GoTrue Auth, SSR).
- **State Management**: React Server Components & Server Actions.
- **Iconography**: Lucide-React.
- **Animations**: Framer Motion.

## 🧪 Verification & Proof of Work

### Core Logic: Rolling 5 Scores
Verified in `src/app/dashboard/scores/actions.ts`. The logic ensures `supabase.from('scores').delete().in('id', oldestIds)` is called whenever more than 5 scores exist.

### Core Logic: Draw Matches
Verified in `src/utils/draw-engine.ts`. The `countMatches` function correctly compares a user's 5 scores against the draw's winning numbers.

## 📝 Setup Instructions for USER

1. **Environment Variables**: Update `.env.local` with your Supabase URL and Anon Key.
2. **Database Schema**: Run the SQL found in `supabase/schema.sql` in your Supabase SQL Editor to set up tables, RLS policies, and triggers.
3. **Run Project**: 
   ```bash
   npm run dev
   ```
4. **Admin Access**: Manually set your profile `role` to `'admin'` in the Supabase `profiles` table to access `/admin`.

---
*Developed by Antigravity for Digital Heroes Selection Process.*
