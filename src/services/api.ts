import type { Game, Track, User, UserGameProgress, Achievement, LeaderboardEntry, GameSession } from '../types';
import { currentUserMock, mockTracks, mockGames, mockUserProgress, mockAchievements, mockLeaderboard } from '../data/mockData';
import { RealtimeDbService } from './realtimeDbService';

// Toggle between local mock service and NestJS production REST API
const USE_MOCK_API = true;
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export class ApiService {
  static async getTracks(): Promise<Track[]> {
    if (USE_MOCK_API) {
      return Promise.resolve([...mockTracks]);
    }
    const res = await fetch(`${API_BASE_URL}/tracks`);
    return res.json();
  }

  static async getTrackBySlug(slug: string): Promise<Track | undefined> {
    if (USE_MOCK_API) {
      return Promise.resolve(mockTracks.find(t => t.slug === slug || t.id === slug));
    }
    const res = await fetch(`${API_BASE_URL}/tracks/${slug}`);
    return res.json();
  }

  static async getGames(filters?: { domainId?: string; difficulty?: string; search?: string }): Promise<Game[]> {
    if (USE_MOCK_API) {
      let filtered = [...mockGames];
      if (filters?.domainId && filters.domainId !== 'all') {
        filtered = filtered.filter(g => g.domainId === filters.domainId);
      }
      if (filters?.difficulty && filters.difficulty !== 'all') {
        filtered = filtered.filter(g => g.difficulty === filters.difficulty);
      }
      if (filters?.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(g => 
          g.title.toLowerCase().includes(q) || 
          g.shortDescription.toLowerCase().includes(q) ||
          g.skills.some(s => s.toLowerCase().includes(q))
        );
      }
      return Promise.resolve(filtered);
    }
    const params = new URLSearchParams(filters as Record<string, string>).toString();
    const res = await fetch(`${API_BASE_URL}/games?${params}`);
    return res.json();
  }

  static async getGameBySlug(slug: string): Promise<Game | undefined> {
    if (USE_MOCK_API) {
      return Promise.resolve(mockGames.find(g => g.slug === slug || g.id === slug));
    }
    const res = await fetch(`${API_BASE_URL}/games/${slug}`);
    return res.json();
  }

  static async getUserProfile(): Promise<User> {
    if (USE_MOCK_API) {
      return Promise.resolve({ ...currentUserMock });
    }
    const res = await fetch(`${API_BASE_URL}/users/me`);
    return res.json();
  }

  static async getUserProgress(): Promise<UserGameProgress[]> {
    if (USE_MOCK_API) {
      return Promise.resolve([...mockUserProgress]);
    }
    const res = await fetch(`${API_BASE_URL}/users/me/progress`);
    return res.json();
  }

  static async getAchievements(): Promise<Achievement[]> {
    if (USE_MOCK_API) {
      return Promise.resolve([...mockAchievements]);
    }
    const res = await fetch(`${API_BASE_URL}/achievements`);
    return res.json();
  }

  static async getLeaderboard(filter: string = 'global'): Promise<LeaderboardEntry[]> {
    if (USE_MOCK_API) {
      return Promise.resolve([...mockLeaderboard]);
    }
    const res = await fetch(`${API_BASE_URL}/leaderboard?filter=${filter}`);
    return res.json();
  }

  static async submitGameSession(session: GameSession): Promise<{
    success: boolean;
    xpEarned: number;
    newTotalXP: number;
    levelCompleted: boolean;
    badgeUnlocked?: Achievement;
  }> {
    return RealtimeDbService.submitGameSessionRealtime(session);
  }
}

