import { createContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, firebaseProjectId, isFirebaseConfigured } from '../firebase';

const AuthContext = createContext({
  currentUser: null,
  isReady: false,
  isConfigured: false,
  createAccount: async () => {},
  login: async () => {},
  logout: async () => {},
});

function toPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.uid,
    name: user.displayName || user.email,
    email: user.email,
  };
}

function mapAuthError(error) {
  switch (error.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/invalid-email':
      return 'Enter a valid email.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Check your connection.';
    case 'auth/operation-not-allowed':
    case 'auth/admin-restricted-operation':
      return `Email/Password is still disabled on Firebase project "${firebaseProjectId}". Open that project in Firebase Console → Authentication → Sign-in method, enable Email/Password, then click Save.`;
    default:
      return error.message || 'Something went wrong.';
  }
}

function assertFirebaseReady() {
  if (!auth || !isFirebaseConfigured) {
    throw new Error(
      'Firebase is not configured. Add your web app keys to .env.local.',
    );
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [isReady, setIsReady] = useState(!isFirebaseConfigured);

  useEffect(() => {
    if (!auth) {
      setIsReady(true);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(toPublicUser(user));
      setIsReady(true);
    });

    return unsubscribe;
  }, []);

  async function createAccount({ name, email, password }) {
    assertFirebaseReady();

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
      await updateProfile(credential.user, { displayName: name.trim() });
      await credential.user.reload();
      setCurrentUser(toPublicUser(auth.currentUser));
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  }

  async function login({ email, password }) {
    assertFirebaseReady();

    try {
      await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password,
      );
    } catch (error) {
      throw new Error(mapAuthError(error));
    }
  }

  async function logout() {
    if (!auth) {
      setCurrentUser(null);
      return;
    }

    await signOut(auth);
  }

  const value = {
    currentUser,
    isReady,
    isConfigured: isFirebaseConfigured,
    createAccount,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthContext;
