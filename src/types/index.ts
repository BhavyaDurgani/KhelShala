export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
export type GameStatus = 'Active' | 'Beta' | 'Coming Soon';
export type GameEngine = 'phaser' | 'godot' | 'canvas' | 'custom';

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  avatar: string;
  selectedTrack?: string;
  totalXP: number;
  currentLevel: number;
  level?: number;
  rankName?: string;
  joinedDate?: string;
  streakDays?: number;
  gamesPlayed?: number;
  gamesCompleted?: number;
  completedGamesCount?: number;
  badges?: Achievement[];
  createdAt?: string;
}

export interface Track {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  banner: string;
  color: string;
  difficulty: DifficultyLevel;
  skills: string[];
  active: boolean;
  gameCount: number;
}

export interface GameLevel {
  id: string;
  gameId: string;
  levelNumber: number;
  title: string;
  description: string;
  difficulty: DifficultyLevel;
  requiredXP: number;
  unlockRequirement?: string;
  objectives: string[];
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  thumbnail: string;
  banner: string;
  domainId: string;
  difficulty: DifficultyLevel;
  estimatedTime: string;
  skills: string[];
  learningObjectives: string[];
  rules: string[];
  gameEngine: GameEngine;
  gameUrl?: string;
  status: GameStatus;
  featured: boolean;
  xpReward: number;
  playerCount: number;
  rating: number;
  levels: GameLevel[];
  createdAt: string;
}

export interface UserGameProgress {
  id: string;
  userId: string;
  gameId: string;
  currentLevel: number;
  completionPercentage: number;
  highestScore: number;
  bestTime: string;
  XP: number;
  status: 'In Progress' | 'Completed' | 'Not Started';
  lastPlayedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  requirement: string;
  category: 'Cybersecurity' | 'Software Engineering' | 'AI Engineering' | 'Cloud DevOps' | 'Robotics' | 'General' | 'Mastery' | 'Speed';
  XPReward: number;
  unlockedAt?: string;
  unlocked?: boolean;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  unlockedAt: string;
}

export interface Score {
  id: string;
  userId: string;
  gameId: string;
  score: number;
  level: number;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  userName: string;
  username?: string;
  avatar: string;
  track?: string;
  totalXP: number;
  highestScore?: number;
  gamesCompleted: number;
  badgesCount?: number;
  badge?: string;
  badgeTitle?: string;
  primarySkill?: string;
  trend?: 'up' | 'down' | 'same';
}

export interface GameSession {
  sessionId: string;
  userId: string;
  gameId: string;
  level: number;
  score: number;
  lives?: number;
  status: 'active' | 'completed' | 'failed';
  threatsNeutralized?: number;
  budgetRemaining?: number;
  decisionsMade?: number;
  startTime: string;
  endTime?: string;
}
