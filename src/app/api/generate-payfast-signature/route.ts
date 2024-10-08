// src/app/api/generate-payfast-signature/route.ts

import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(request: Request) {
  const data = await request.json()
  
  // Sort the keys alphabetically
  const sortedKeys = Object.keys(data).sort()

  // Create the string to hash
  let stringToHash = ''
  for (const key of sortedKeys) {
    if (key !== 'signature' && key !== 'passphrase') {
      stringToHash += `${key}=${encodeURIComponent(data[key]).replace(/%20/g, '+')}&`
    }
  }

  // Add the passphrase
  const passphrase = process.env.PAYFAST_PASSPHRASE || ''
  stringToHash += `passphrase=${encodeURIComponent(passphrase)}`

  console.log('String to hash:', stringToHash) // For debugging

  // Generate the signature
  const signature = crypto.createHash('md5').update(stringToHash).digest('hex')

  console.log('Generated signature:', signature) // For debugging

  return NextResponse.json({ signature })
}