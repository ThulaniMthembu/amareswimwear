import { NextResponse } from 'next/server'
import { adminDb } from '@/lib/firebase-admin'
import { Review } from '@/types'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const snapshot = await adminDb.ref(`reviews/${productId}`).once('value')
    const reviewsObj = snapshot.val() || {}
    const reviews = Object.values(reviewsObj) as Review[]

    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error in GET /api/reviews:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, review } = body

    if (!productId || !review) {
      return NextResponse.json({ error: 'Product ID and review are required' }, { status: 400 })
    }

    const newReview: Review = {
      id: Date.now().toString(),
      ...review,
      createdAt: new Date().toISOString()
    }

    const newReviewRef = await adminDb.ref(`reviews/${productId}`).push()
    newReview.id = newReviewRef.key || newReview.id
    await newReviewRef.set(newReview)

    return NextResponse.json(newReview, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/reviews:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}