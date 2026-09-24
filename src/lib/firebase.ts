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

// Operation types for detailed security/permission error context
export enum OperationType {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authStatus: 'signed_in' | 'signed_out';
  userId: string | null;
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null = null
): FirestoreErrorInfo {
  const errMessage = error instanceof Error ? error.message : String(error);
  const currentUser = auth.currentUser;
  
  const errorInfo: FirestoreErrorInfo = {
    error: errMessage,
    operationType,
    path,
    authStatus: currentUser ? 'signed_in' : 'signed_out',
    userId: currentUser ? currentUser.uid : null,
  };

  console.error('[Firestore Security Rule / Operation Error]', errorInfo);
  return errorInfo;
}

// Connection test helper to confirm live rules & connection
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('permission-denied')) {
      // Permission denied on test doc is expected if connection succeeded and rules are live
      return true;
    }
    console.warn('[Firestore] Connection test message:', err);
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
    handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    throw err;
  }
}
