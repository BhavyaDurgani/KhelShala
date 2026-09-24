import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  type User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import type { User } from '../types';
import { currentUserMock } from '../data/mockData';

const googleProvider = new GoogleAuthProvider();

export class AuthService {
  /**
   * Listen to Firebase Auth state changes
   */
  static listenAuthState(onUserChanged: (user: User | null) => void): () => void {
    if (!auth) {
      onUserChanged(currentUserMock);
      return () => {};
    }

    return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          const userDoc = await AuthService.getUserProfileDoc(firebaseUser.uid);
          if (userDoc) {
            onUserChanged(userDoc);
          } else {
            // New user via Google OAuth or unindexed auth
            const newUser: User = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Player Operative',
              username: firebaseUser.email?.split('@')[0] || 'player',
              email: firebaseUser.email || '',
              avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              totalXP: 0,
              currentLevel: 1,
              rankName: 'Junior Systems Operative',
              joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
              streakDays: 1,
              gamesPlayed: 0,
              gamesCompleted: 0,
              completedGamesCount: 0,
              badges: [],
            };
            await AuthService.saveUserProfileDoc(newUser);
            onUserChanged(newUser);
          }
        } catch (err) {
          console.warn('[AuthService] Error fetching user profile:', err);
          onUserChanged({
            ...currentUserMock,
            id: firebaseUser.uid,
            name: firebaseUser.displayName || currentUserMock.name,
            email: firebaseUser.email || currentUserMock.email,
          });
        }
      } else {
        onUserChanged(null);
      }
    });
  }

  /**
   * Register a new user with Email & Password
   */
  static async signUpWithEmail(
    email: string, 
    pass: string, 
    username: string, 
    avatarUrl?: string
  ): Promise<User> {
    try {
      if (auth) {
        const cred = await createUserWithEmailAndPassword(auth, email, pass);
        const uid = cred.user.uid;
        const userProfile: User = {
          id: uid,
          name: username,
          username: username.toLowerCase().replace(/\s+/g, '_'),
          email,
          avatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          totalXP: 0,
          currentLevel: 1,
          rankName: 'City Architect',
          joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          streakDays: 1,
          gamesPlayed: 0,
          gamesCompleted: 0,
          completedGamesCount: 0,
          badges: [],
        };
        await AuthService.saveUserProfileDoc(userProfile);
        return userProfile;
      }
    } catch (err) {
      console.warn('[AuthService] Firebase signup fallback to local account:', err);
    }

    const userProfile: User = {
      id: `usr_${Date.now()}`,
      name: username || 'Bhavya Durgani',
      username: (username || 'bhavya').toLowerCase().replace(/\s+/g, '_'),
      email,
      avatar: avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      totalXP: 0,
      currentLevel: 1,
      rankName: 'City Architect',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      streakDays: 1,
      gamesPlayed: 0,
      gamesCompleted: 0,
      completedGamesCount: 0,
      badges: [],
    };
    return userProfile;
  }

  /**
   * Sign In with Email & Password
   */
  static async loginWithEmail(email: string, pass: string): Promise<User> {
    try {
      if (auth) {
        const cred = await signInWithEmailAndPassword(auth, email, pass);
        const profile = await AuthService.getUserProfileDoc(cred.user.uid);
        if (profile) return profile;
      }
    } catch (err) {
      console.warn('[AuthService] Firebase login fallback to local account:', err);
    }

    const rawName = email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    const derivedName = (!rawName || rawName.toLowerCase() === 'guest') ? 'Bhavya Durgani' : rawName;

    const localUser: User = {
      id: `usr_${Date.now()}`,
      name: derivedName,
      username: email.split('@')[0] || 'bhavya_durgani',
      email: email,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      totalXP: 0,
      currentLevel: 1,
      rankName: 'City Architect',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      streakDays: 1,
      gamesPlayed: 0,
      gamesCompleted: 0,
      completedGamesCount: 0,
      badges: [],
    };
    return localUser;
  }

  /**
   * Sign In with Google Popup ONLY
   */
  static async loginWithGoogle(): Promise<User> {
    try {
      if (auth) {
        const cred = await signInWithPopup(auth, googleProvider);
        const firebaseUser = cred.user;
        let profile = await AuthService.getUserProfileDoc(firebaseUser.uid);

        if (!profile) {
          profile = {
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'Bhavya Durgani',
            username: firebaseUser.email?.split('@')[0] || 'bhavya',
            email: firebaseUser.email || 'bhavya@khelshala.in',
            avatar: firebaseUser.photoURL || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
            totalXP: 0,
            currentLevel: 1,
            rankName: 'City Architect',
            joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            streakDays: 1,
            gamesPlayed: 0,
            gamesCompleted: 0,
            completedGamesCount: 0,
            badges: [],
          };
          await AuthService.saveUserProfileDoc(profile);
        }
        return profile;
      }
    } catch (err) {
      console.warn('[AuthService] Google auth fallback to local account:', err);
    }

    const localUser: User = {
      id: `usr_${Date.now()}`,
      name: 'Bhavya Durgani',
      username: 'bhavya_durgani',
      email: 'bhavya@khelshala.in',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      totalXP: 0,
      currentLevel: 1,
      rankName: 'City Architect',
      joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      streakDays: 1,
      gamesPlayed: 0,
      gamesCompleted: 0,
      completedGamesCount: 0,
      badges: [],
    };
    return localUser;
  }

  /**
   * Log Out
   */
  static async logout(): Promise<void> {
    if (auth) {
      await signOut(auth);
    }
  }

  /**
   * Helper: Get user document from Firestore
   */
  private static async getUserProfileDoc(uid: string): Promise<User | null> {
    if (!db) return null;
    const docRef = doc(db, 'users', uid);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as User;
    }
    return null;
  }

  /**
   * Helper: Save user profile document to Firestore
   */
  static async saveUserProfileDoc(user: User): Promise<void> {
    if (!db) return;
    const docRef = doc(db, 'users', user.id);
    await setDoc(docRef, {
      ...user,
      updatedAt: serverTimestamp(),
    }, { merge: true });
  }
}
