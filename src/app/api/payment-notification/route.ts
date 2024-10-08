import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  const data = await req.formData()
  const pfData = Object.fromEntries(data)

  // Verify the signature
  const passphrase = process.env.PAYFAST_PASSPHRASE
  const dataString = Object.keys(pfData)
    .filter(key => key !== 'signature')
    .sort()
    .map(key => `${key}=${encodeURIComponent(pfData[key as keyof typeof pfData] as string)}`)
    .join('&')

  const stringToHash = `${dataString}${passphrase ? `&passphrase=${encodeURIComponent(passphrase)}` : ''}`
  const calculatedSignature = crypto.createHash('md5').update(stringToHash).digest('hex')

  if (calculatedSignature !== pfData.signature) {
    console.error('Invalid signature')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  // Verify the payment data
  if (pfData.payment_status === 'COMPLETE') {
    // Payment is complete
    // Update your database or perform any other necessary actions
    console.log('Payment complete:', pfData)
    // TODO: Implement your logic here (e.g., update order status, send confirmation email, etc.)
  } else {
    console.log('Payment not complete:', pfData)
    // TODO: Handle other payment statuses if necessary
  }

  return NextResponse.json({ message: 'Payment notification received and verified' })
}