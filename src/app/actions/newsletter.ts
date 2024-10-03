'use server'

import { z } from 'zod'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

export async function subscribeToNewsletter(prevState: unknown, formData: FormData) {
  const validatedFields = schema.safeParse({
    email: formData.get('email'),
  })

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.errors[0].message }
  }

  const { email } = validatedFields.data

  try {
    // TODO: Implement actual newsletter subscription logic here
    // This could involve saving to a database or calling an external API
    console.log('Subscribing email:', email)

    // Simulate a delay to mimic an API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    return { success: true, message: 'Successfully subscribed to the newsletter!' }
  } catch (error) {
    console.error('Failed to subscribe:', error)
    return { success: false, message: 'Failed to subscribe. Please try again later.' }
  }
}