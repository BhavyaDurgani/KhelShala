import { create } from 'zustand';
import type { User, Track, UserGameProgress, Achievement } from '../types';
import { currentUserMock, mockTracks, mockUserProgress, mockAchievements } from '../data/mockData';

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'xp' | 'level' | 'achievement' | 'info';
  timestamp: string;
}

interface AppState {
  user: User;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  tracks: Track[];
  activeTrackId: string;
  userProgress: UserGameProgress[];
  achievements: Achievement[];
  notifications: NotificationItem[];
  
  // Actions
  setSelectedTrack: (trackId: string) => void;
  addXP: (xp: number) => void;
  updateGameProgress: (gameId: string, level: number, score: number, xpEarned: number) => void;
  unlockAchievement: (achievementId: string) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp'>) => void;
  clearNotification: (id: string) => void;
  updateUser: (partialUser: Partial<User>) => void;
  setUser: (user: User | null) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  logout: () => void;
}

const getInitialUser = (): User => {
  try {
    const stored = localStorage.getItem('khelshala_user');
    if (stored) return JSON.parse(stored);
  } catch (e) {
    console.error('Failed parsing stored user profile', e);
  }
  return currentUserMock;
};

const initialUser = getInitialUser();

export const useStore = create<AppState>((set) => ({
  user: initialUser,
  isAuthenticated: initialUser.id !== 'guest_operative',
  isAuthModalOpen: false,
  tracks: mockTracks,
  activeTrackId: initialUser.selectedTrack || 'software_engineering',
  userProgress: mockUserProgress,
  achievements: mockAchievements,
  notifications: [
    {
      id: 'notif_welcome',
      title: 'Welcome to KhelShala! 👋',
      message: 'Sign in to save your game progress and rank on the live global leaderboard.',
      type: 'info',
      timestamp: new Date().toLocaleTimeString()
    }
  ],

  setSelectedTrack: (trackId: string) => set((state) => {
    const updatedUser = { ...state.user, selectedTrack: trackId };
    if (state.isAuthenticated) {
      localStorage.setItem('khelshala_user', JSON.stringify(updatedUser));
    }
    return {
      activeTrackId: trackId,
      user: updatedUser
    };
  }),

  addXP: (xp: number) => set((state) => {
    const newTotalXP = state.user.totalXP + xp;
    const newLevel = Math.floor(newTotalXP / 750) + 1;
    const updatedUser = {
      ...state.user,
      totalXP: newTotalXP,
      currentLevel: newLevel
    };
    if (state.isAuthenticated) {
      localStorage.setItem('khelshala_user', JSON.stringify(updatedUser));
    }
    return { user: updatedUser };
  }),

  updateGameProgress: (gameId: string, level: number, score: number, xpEarned: number) => set((state) => {
    const existingIndex = state.userProgress.findIndex(p => p.gameId === gameId);
    let updatedProgress = [...state.userProgress];
    let actualXPAwarded = 0;

    if (existingIndex >= 0) {
      const existing = updatedProgress[existingIndex];
      const previousXP = existing.XP || 0;
      actualXPAwarded = Math.max(0, xpEarned - previousXP);

      updatedProgress[existingIndex] = {
        ...existing,
        currentLevel: Math.max(existing.currentLevel, level),
        completionPercentage: Math.min(100, Math.max(existing.completionPercentage, level * 33)),
        highestScore: Math.max(existing.highestScore, score),
        XP: Math.max(existing.XP, xpEarned),
        status: level >= 3 || Math.max(existing.completionPercentage, level * 33) >= 100 ? 'Completed' : 'In Progress',
        lastPlayedAt: new Date().toISOString()
      };
    } else {
      actualXPAwarded = xpEarned;
      updatedProgress.push({
        id: `prog_${Date.now()}`,
        userId: state.user.id,
        gameId,
        currentLevel: level,
        completionPercentage: Math.min(100, level * 33),
        highestScore: score,
        bestTime: '10m 00s',
        XP: xpEarned,
        status: 'In Progress',
        lastPlayedAt: new Date().toISOString()
      });
    }

    const newTotalXP = state.user.totalXP + actualXPAwarded;
    const newLevel = Math.floor(newTotalXP / 750) + 1;
    const currentGamesPlayed = state.user.gamesPlayed ?? 0;
    const updatedUser = {
      ...state.user,
      totalXP: newTotalXP,
      currentLevel: newLevel,
      gamesPlayed: existingIndex >= 0 ? currentGamesPlayed : currentGamesPlayed + 1
    };

    if (state.isAuthenticated) {
      localStorage.setItem('khelshala_user', JSON.stringify(updatedUser));
    }

    const newNotifications = [...state.notifications];
    if (actualXPAwarded > 0) {
      newNotifications.unshift({
        id: `notif_${Date.now()}`,
        title: '🌟 XP Earned!',
        message: `You earned +${actualXPAwarded} XP for completing Level ${level}!`,
        type: 'xp',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } else {
      newNotifications.unshift({
        id: `notif_${Date.now()}`,
        title: '🎯 Replayed Level',
        message: `Level ${level} replayed! Highest XP (+${xpEarned} XP) retained. No duplicate XP awarded.`,
        type: 'info',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    return {
      userProgress: updatedProgress,
      user: updatedUser,
      notifications: newNotifications
    };
  }),

  unlockAchievement: (achievementId: string) => set((state) => ({
    achievements: state.achievements.map(a => 
      a.id === achievementId 
        ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() }
        : a
    )
  })),

  addNotification: (notification) => set((state) => ({
    notifications: [
      {
        ...notification,
        id: `notif_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...state.notifications
    ]
  })),

  clearNotification: (id: string) => set((state) => ({
    notifications: state.notifications.filter(n => n.id !== id)
  })),

  updateUser: (partialUser: Partial<User>) => set((state) => {
    const updatedUser = { ...state.user, ...partialUser };
    if (updatedUser.id !== 'guest_operative') {
      localStorage.setItem('khelshala_user', JSON.stringify(updatedUser));
    }
    return {
      user: updatedUser,
      isAuthenticated: updatedUser.id !== 'guest_operative'
    };
  }),

  setUser: (newUser: User | null) => {
    if (newUser && newUser.id !== 'guest_operative') {
      localStorage.setItem('khelshala_user', JSON.stringify(newUser));
      set({
        user: newUser,
        isAuthenticated: true,
      });
    } else if (newUser === null) {
      const stored = localStorage.getItem('khelshala_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed && parsed.name && parsed.id !== 'guest_operative') {
            set({
              user: parsed,
              isAuthenticated: true,
            });
            return;
          }
        } catch (e) {}
      }
      localStorage.removeItem('khelshala_user');
      set({
        user: currentUserMock,
        isAuthenticated: false,
      });
    }
  },

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),

  logout: () => {
    localStorage.removeItem('khelshala_user');
    set({
      user: currentUserMock,
      isAuthenticated: false,
    });
  },
}));

