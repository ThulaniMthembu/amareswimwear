import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

let serviceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Remove any leading/trailing whitespace and single quotes
    const cleanedKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim().replace(/^'|'$/g, '');
    serviceAccount = JSON.parse(cleanedKey);
  } else {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not defined in environment variables');
  }
} catch (error) {
  console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error);
  console.log("Raw FIREBASE_SERVICE_ACCOUNT_KEY:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  throw new Error("Invalid FIREBASE_SERVICE_ACCOUNT_KEY");
}

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
    databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  })
}

const db = getFirestore()

export { db }