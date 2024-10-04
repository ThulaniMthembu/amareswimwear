import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { ServiceAccount } from 'firebase-admin/app'

let serviceAccount: ServiceAccount;

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    // Remove any leading/trailing whitespace and single quotes
    const cleanedKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY.trim().replace(/^'|'$/g, '');
    try {
      const parsedAccount = JSON.parse(cleanedKey);
      if (typeof parsedAccount === 'object' && parsedAccount !== null) {
        serviceAccount = parsedAccount as ServiceAccount;
      } else {
        throw new Error("Invalid service account format");
      }
    } catch (parseError) {
      console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", parseError);
      console.log("Cleaned FIREBASE_SERVICE_ACCOUNT_KEY:", cleanedKey);
      throw new Error("Invalid JSON in FIREBASE_SERVICE_ACCOUNT_KEY");
    }
  } else {
    throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY is not defined in environment variables');
  }
} catch (error) {
  console.error("Error setting up Firebase service account:", error);
  console.log("Raw FIREBASE_SERVICE_ACCOUNT_KEY:", process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  throw error; // Re-throw the error to prevent Firebase initialization with invalid credentials
}

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
    });
  } catch (initError) {
    console.error("Error initializing Firebase app:", initError);
    throw initError;
  }
}

let db: Firestore;
try {
  db = getFirestore();
} catch (dbError) {
  console.error("Error getting Firestore instance:", dbError);
  throw dbError;
}

export { db }