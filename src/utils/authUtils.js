import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider } from './firebase';

export const signInWithGoogle = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithEmail = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const registerWithEmail = (email, password, displayName) =>
  createUserWithEmailAndPassword(auth, email, password).then((result) =>
    updateProfile(result.user, { displayName })
  );

export const logOut = () => signOut(auth);
