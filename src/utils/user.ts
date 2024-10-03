import { db } from '@/config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';

export async function createUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    await setDoc(userRef, {
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      createdAt: new Date(),
    });
  }
}

export async function getUserProfile(userId: string) {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    return null;
  }
}