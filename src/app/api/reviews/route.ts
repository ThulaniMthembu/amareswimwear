import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'
import { Review } from '@/types'

async function handleGET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    console.log(`Fetching reviews for product ${productId}`)

    const snapshot = await db.collection('reviews').where('productId', '==', parseInt(productId)).get()
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review))

    console.log(`Found ${reviews.length} reviews for product ${productId}`)

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error in GET /api/reviews:", error)
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 })
  }
}

async function handlePOST(request: Request) {
  try {
    const body = await request.json()
    const { productId, review } = body

    if (!productId || !review) {
      return NextResponse.json({ error: 'Product ID and review are required' }, { status: 400 })
    }

    console.log('Received review:', review)

    const newReview: Omit<Review, 'id'> = {
      ...review,
      productId: parseInt(productId),
      createdAt: new Date().toISOString()
    }

    console.log('Saving review:', newReview)

    const docRef = await db.collection('reviews').add(newReview)
    const createdReview: Review = { id: docRef.id, ...newReview }

    console.log('Review saved successfully:', createdReview)

    return NextResponse.json(createdReview, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/reviews:", error)
    return NextResponse.json({ error: 'Internal Server Error', details: (error as Error).message }, { status: 500 })
  }
}

function corsMiddleware(handler: (request: Request) => Promise<NextResponse>) {
  return async (request: Request) => {
    const response = await handler(request)
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    return response
  }
}

export const GET = corsMiddleware(handleGET)
export const POST = corsMiddleware(handlePOST)

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}