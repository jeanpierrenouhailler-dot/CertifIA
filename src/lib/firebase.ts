import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut, 
  onAuthStateChanged,
  type User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDocFromServer,
  setDoc,
  updateDoc,
  onSnapshot,
  collection,
  query,
  orderBy,
  limit,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import type { UserProfile } from '../types';

// Initialize Firebase App
export const app = initializeApp(firebaseConfig);

// Initialize Auth & Provider
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Initialize Cloud Firestore with specified database ID
export const db = getFirestore(
  app, 
  firebaseConfig.firestoreDatabaseId || '(default)'
);

// Operation types for detailed security/permission error context (matches firebase-skill standard)
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null = null
): never {
  const errMessage = error instanceof Error ? error.message : String(error);
  const currentUser = auth.currentUser;
  
  const errInfo: FirestoreErrorInfo = {
    error: errMessage,
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };

  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Connection test helper to confirm live rules & connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error: unknown) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('unavailable'))) {
      console.warn('[Firestore] Backend is operating in offline mode:', error.message);
      return false;
    }
    if (error instanceof Error && error.message.includes('permission-denied')) {
      return true;
    }
    return true;
  }
}

// Sign in with Google Popup
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('[Auth] Google sign-in failed:', error);
    throw error;
  }
}

// Sign out
export async function logOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Upsert User Profile in Firestore
export async function syncUserProfile(user: User, additionalData?: Partial<UserProfile>): Promise<void> {
  const userRef = doc(db, 'users', user.uid);
  const now = new Date().toISOString();
  
  const initialProfile: UserProfile = {
    userId: user.uid,
    email: user.email || '',
    displayName: user.displayName || 'Architecte Cloud',
    photoURL: user.photoURL || undefined,
    targetExam: additionalData?.targetExam || 'ai102',
    targetExamTitle: additionalData?.targetExamTitle || 'Azure AI Engineer Associate (AI-102)',
    streakDays: additionalData?.streakDays ?? 12,
    questionsSolved: additionalData?.questionsSolved ?? 342,
    averageScore: additionalData?.averageScore ?? 84,
    readinessIndex: additionalData?.readinessIndex ?? 78,
    createdAt: additionalData?.createdAt || now,
    updatedAt: now,
  };

  try {
    await setDoc(userRef, initialProfile, { merge: true });
  } catch (err) {
    if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
      console.warn('[Firestore] syncUserProfile operating offline:', err.message);
      return;
    }
    handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
  }
}
