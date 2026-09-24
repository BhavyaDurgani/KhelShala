import { 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, isConfigured } from './firebase';
import type { LeaderboardEntry, GameSession, User, Achievement } from '../types';
import { mockLeaderboard, currentUserMock, mockAchievements } from '../data/mockData';

const BROADCAST_CHANNEL_NAME = 'khelshala_realtime_sync';
const broadcastChannel = typeof window !== 'undefined' && 'BroadcastChannel' in window
  ? new BroadcastChannel(BROADCAST_CHANNEL_NAME)
  : null;

// Local in-memory reactive state for instant multi-tab real-time sync fallback
let memoryLeaderboard: LeaderboardEntry[] = [...mockLeaderboard];
let memoryUser: User = { ...currentUserMock };

export class RealtimeDbService {
  /**
   * Subscribe to Live Leaderboard updates in Real-Time
   */
  static subscribeLeaderboard(
    onData: (entries: LeaderboardEntry[]) => void,
    limitCount: number = 20
  ): () => void {
    if (isConfigured && db) {
      try {
        const q = query(
          collection(db, 'leaderboard'),
          orderBy('score', 'desc'),
          limit(limitCount)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const entries: LeaderboardEntry[] = [];
          snapshot.forEach((docSnap) => {
            const data = docSnap.data();
            entries.push({
              rank: entries.length + 1,
              userId: docSnap.id,
              userName: data.userName || data.username || 'Anonymous Operative',
              username: data.username || 'Anonymous Operative',
              avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
              totalXP: data.score || data.totalXP || 0,
              gamesCompleted: data.gamesCompleted || 1,
              primarySkill: data.primarySkill || 'Cyber Security',
              badgeTitle: data.badgeTitle || 'City Architect',
              trend: data.trend || 'same',
            });
          });

          if (entries.length > 0) {
            onData(entries);
          } else {
            onData(memoryLeaderboard);
          }
        }, (error) => {
          console.warn('[RealtimeDB] Firestore listener error, using reactive fallback:', error);
          onData(memoryLeaderboard);
        });

        return unsubscribe;
      } catch (e) {
        console.warn('[RealtimeDB] Error initializing Firestore listener:', e);
      }
    }

    // Local Reactive Fallback via BroadcastChannel & Storage events
    onData([...memoryLeaderboard]);

    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'LEADERBOARD_UPDATE') {
        memoryLeaderboard = event.data.payload;
        onData([...memoryLeaderboard]);
      }
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'khelshala_leaderboard_data' && e.newValue) {
        try {
          memoryLeaderboard = JSON.parse(e.newValue);
          onData([...memoryLeaderboard]);
        } catch { /* ignore */ }
      }
    };

    broadcastChannel?.addEventListener('message', handleBroadcast);
    window.addEventListener('storage', handleStorage);

    return () => {
      broadcastChannel?.removeEventListener('message', handleBroadcast);
      window.removeEventListener('storage', handleStorage);
    };
  }

  /**
   * Subscribe to Live User Profile & XP Progress
   */
  static subscribeUserProfile(
    userId: string,
    onData: (user: User) => void
  ): () => void {
    if (isConfigured && db) {
      try {
        const userRef = doc(db, 'users', userId);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            memoryUser = {
              ...memoryUser,
              ...data,
              totalXP: data.totalXP || memoryUser.totalXP,
              level: data.level || memoryUser.level,
            } as User;
            onData(memoryUser);
          } else {
            onData(memoryUser);
          }
        });
        return unsubscribe;
      } catch (e) {
        console.warn('[RealtimeDB] Error initializing User Profile listener:', e);
      }
    }

    onData({ ...memoryUser });

    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'USER_UPDATE') {
        memoryUser = event.data.payload;
        onData({ ...memoryUser });
      }
    };

    broadcastChannel?.addEventListener('message', handleBroadcast);

    return () => {
      broadcastChannel?.removeEventListener('message', handleBroadcast);
    };
  }

  /**
   * Submit a Completed Game Session & Synchronize Real-Time Leaderboard and User XP
   */
  static async submitGameSessionRealtime(session: GameSession): Promise<{
    success: boolean;
    xpEarned: number;
    newTotalXP: number;
    levelCompleted: boolean;
    badgeUnlocked?: Achievement;
  }> {
    const xpGained = Math.round((session.score || 500) / 10) + 150;
    const newTotalXP = memoryUser.totalXP + xpGained;

    // Update memory user
    memoryUser = {
      ...memoryUser,
      totalXP: newTotalXP,
      level: Math.floor(newTotalXP / 1000) + 1,
    };

    // Update memory leaderboard
    const userIndex = memoryLeaderboard.findIndex(e => e.userId === memoryUser.id || e.username === memoryUser.username);
    if (userIndex !== -1) {
      memoryLeaderboard[userIndex].totalXP = newTotalXP;
      memoryLeaderboard[userIndex].gamesCompleted += 1;
      memoryLeaderboard[userIndex].trend = 'up';
    } else {
      memoryLeaderboard.push({
        rank: memoryLeaderboard.length + 1,
        userId: memoryUser.id,
        userName: memoryUser.name || memoryUser.username || 'Operative',
        username: memoryUser.username,
        avatar: memoryUser.avatar,
        totalXP: newTotalXP,
        gamesCompleted: 1,
        primarySkill: 'Systems & Cyber',
        badgeTitle: 'City Architect',
        trend: 'up',
      });
    }

    // Sort leaderboard by score
    memoryLeaderboard.sort((a, b) => b.totalXP - a.totalXP);
    memoryLeaderboard.forEach((entry, idx) => {
      entry.rank = idx + 1;
    });

    // Notify other tabs reactively
    try {
      localStorage.setItem('khelshala_leaderboard_data', JSON.stringify(memoryLeaderboard));
      broadcastChannel?.postMessage({ type: 'LEADERBOARD_UPDATE', payload: memoryLeaderboard });
      broadcastChannel?.postMessage({ type: 'USER_UPDATE', payload: memoryUser });
    } catch { /* ignore */ }

    // Sync to Cloud Firestore if configured
    if (isConfigured && db) {
      try {
        // 1. Log Session
        const sessionRef = doc(collection(db, 'game_sessions'));
        await setDoc(sessionRef, {
          ...session,
          xpEarned: xpGained,
          createdAt: serverTimestamp(),
        });

        // 2. Update User Profile
        const userRef = doc(db, 'users', memoryUser.id);
        await setDoc(userRef, {
          username: memoryUser.username,
          avatar: memoryUser.avatar,
          totalXP: newTotalXP,
          level: memoryUser.level,
          updatedAt: serverTimestamp(),
        }, { merge: true });

        // 3. Update Leaderboard Entry
        const lbRef = doc(db, 'leaderboard', memoryUser.id);
        await setDoc(lbRef, {
          userId: memoryUser.id,
          username: memoryUser.username,
          avatar: memoryUser.avatar,
          score: newTotalXP,
          gamesCompleted: (userIndex !== -1 ? memoryLeaderboard[userIndex].gamesCompleted : 1),
          primarySkill: 'Systems & Cyber',
          badgeTitle: 'City Architect',
          updatedAt: serverTimestamp(),
        }, { merge: true });
      } catch (err) {
        console.warn('[RealtimeDB] Firestore sync error (running in local reactive mode):', err);
      }
    }

    return {
      success: true,
      xpEarned: xpGained,
      newTotalXP,
      levelCompleted: true,
      badgeUnlocked: mockAchievements[1],
    };
  }
}
