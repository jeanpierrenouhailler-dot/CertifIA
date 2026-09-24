import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  type User, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  onSnapshot, 
  setDoc,
  updateDoc 
} from 'firebase/firestore';
import { 
  auth, 
  db, 
  signInWithGoogle, 
  logOut, 
  syncUserProfile, 
  handleFirestoreError, 
  OperationType,
  testFirestoreConnection
} from '../lib/firebase';
import type { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isFirebaseConnected: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserGoal: (targetExam: string, targetExamTitle: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);

  // Check connection on mount
  useEffect(() => {
    testFirestoreConnection().then(connected => {
      setIsFirebaseConnected(connected);
    });
  }, []);

  // Listen for Firebase Auth state changes and real-time Firestore profile
  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userDocRef = doc(db, 'users', currentUser.uid);

        // Ensure user profile document exists or is initialized in Firestore
        try {
          await syncUserProfile(currentUser);
        } catch (err) {
          console.warn('[AuthContext] syncUserProfile fallback notice:', err);
        }

        // Real-time snapshot listener on the user's document
        unsubscribeFirestore = onSnapshot(
          userDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              setUserProfile(snapshot.data() as UserProfile);
            } else {
              // Create default doc if missing
              syncUserProfile(currentUser).catch(console.error);
            }
            setLoading(false);
          },
          (error) => {
            handleFirestoreError(error, OperationType.READ, `users/${currentUser.uid}`);
            setLoading(false);
          }
        );
      } else {
        setUserProfile(null);
        if (unsubscribeFirestore) {
          unsubscribeFirestore();
          unsubscribeFirestore = null;
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const signedInUser = await signInWithGoogle();
      await syncUserProfile(signedInUser);
    } catch (error) {
      console.error('[AuthContext] Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logOut();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('[AuthContext] Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserGoal = async (targetExam: string, targetExamTitle: string) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        targetExam,
        targetExamTitle,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      throw err;
    }
  };

  const updateDisplayName = async (name: string) => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: name,
        updatedAt: new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isFirebaseConnected,
        loginWithGoogle,
        logout,
        updateUserGoal,
        updateDisplayName
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
