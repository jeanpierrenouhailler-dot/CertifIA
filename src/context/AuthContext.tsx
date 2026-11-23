import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  type User, 
  onAuthStateChanged 
} from 'firebase/auth';
import { 
  doc, 
  getDoc,
  onSnapshot, 
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

const PRIMARY_ADMIN_EMAIL = 'jeanpierre.nouhailler@gmail.com';

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isFirebaseConnected: boolean;
  isAdmin: boolean;
  adminChecking: boolean;
  getIdToken: () => Promise<string | null>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserGoal: (targetExam: string, targetExamTitle: string) => Promise<void>;
  updateDisplayName: (name: string) => Promise<void>;
  updatePreferredLanguage: (lang: 'fr' | 'en') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [adminChecking, setAdminChecking] = useState<boolean>(false);

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
        // Evaluate admin privileges securely without failing for normal learners
        setAdminChecking(true);
        const verifiedEmail = Boolean(currentUser.emailVerified);
        const normalizedEmail = (currentUser.email || '').trim().toLowerCase();
        if (verifiedEmail && normalizedEmail === PRIMARY_ADMIN_EMAIL) {
          setIsAdmin(true);
          setAdminChecking(false);
        } else if (verifiedEmail) {
          getDoc(doc(db, 'admins', currentUser.uid))
            .then((snap) => {
              setIsAdmin(snap.exists() && snap.data()?.active === true);
            })
            .catch(() => {
              setIsAdmin(false);
            })
            .finally(() => {
              setAdminChecking(false);
            });
        } else {
          setIsAdmin(false);
          setAdminChecking(false);
        }

        const userDocRef = doc(db, 'users', currentUser.uid);

        try {
          await syncUserProfile(currentUser);
        } catch (err) {
          console.warn('[AuthContext] syncUserProfile fallback notice:', err);
        }

        unsubscribeFirestore = onSnapshot(
          userDocRef,
          (snapshot) => {
            if (snapshot.exists()) {
              setUserProfile(snapshot.data() as UserProfile);
            } else {
              syncUserProfile(currentUser).catch(console.error);
            }
            setLoading(false);
          },
          (error) => {
            if (error instanceof Error && (error.message.includes('unavailable') || error.message.includes('offline'))) {
              console.warn('[AuthContext] Firestore snapshot in offline mode:', error.message);
              setLoading(false);
              return;
            }
            handleFirestoreError(error, OperationType.GET, `users/${currentUser.uid}`);
            setLoading(false);
          }
        );
      } else {
        setUserProfile(null);
        setIsAdmin(false);
        setAdminChecking(false);
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

  const getIdToken = useCallback(async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch {
      return null;
    }
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
      setIsAdmin(false);
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
      if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
        console.warn('[AuthContext] Offline goal update queued locally:', err.message);
        return;
      }
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
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
      if (err instanceof Error && (err.message.includes('unavailable') || err.message.includes('offline'))) {
        console.warn('[AuthContext] Offline display name update queued locally:', err.message);
        return;
      }
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const updatePreferredLanguage = async (lang: 'fr' | 'en') => {
    try {
      const { changeLanguage } = await import('../i18n');
      await changeLanguage(lang);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        await updateDoc(userDocRef, {
          preferredLanguage: lang,
          updatedAt: new Date().toISOString()
        });
      }
    } catch (err) {
      console.warn('[AuthContext] Failed to persist preferredLanguage to Firestore:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isFirebaseConnected,
        isAdmin,
        adminChecking,
        getIdToken,
        loginWithGoogle,
        logout,
        updateUserGoal,
        updateDisplayName,
        updatePreferredLanguage
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
