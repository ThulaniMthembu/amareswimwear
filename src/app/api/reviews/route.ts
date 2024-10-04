import { NextResponse } from 'next/server'
import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { Review } from '@/types'

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}')
    if (!serviceAccount.project_id) {
      throw new Error('Invalid service account: missing project_id')
    }
    initializeApp({
      credential: cert(serviceAccount)
    })
    console.log('Firebase Admin SDK initialized successfully')
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error)
    throw error // This will cause the API route to fail if Firebase can't be initialized
  }
}

const db = getFirestore()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 })
    }

    const snapshot = await db.collection('reviews').where('productId', '==', productId).get()
    const reviews = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review))

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

    const newReview: Omit<Review, 'id'> = {
      ...review,
      productId,
      createdAt: new Date().toISOString()
    }

    const docRef = await db.collection('reviews').add(newReview)
    const createdReview: Review = { id: docRef.id, ...newReview }

    return NextResponse.json(createdReview, { status: 201 })
  } catch (error) {
    console.error("Error in POST /api/reviews:", error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}