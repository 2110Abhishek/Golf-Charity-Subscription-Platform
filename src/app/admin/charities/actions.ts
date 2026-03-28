'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCharity(formData: FormData) {
  const supabase = await createClient()
  
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const website_url = formData.get('website_url') as string
  const image_url = formData.get('image_url') as string
  const is_featured = formData.get('is_featured') === 'on'

  const { error } = await supabase
    .from('charities')
    .insert([{
      name,
      description,
      website_url,
      image_url,
      is_featured
    }])

  if (error) {
    console.error('Error creating charity:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/charities')
  revalidatePath('/charities')
  redirect('/admin/charities')
}

export async function deleteCharity(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('charities')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting charity:', error)
    return { error: error.message }
  }

  revalidatePath('/admin/charities')
  revalidatePath('/charities')
  return { success: true }
}
