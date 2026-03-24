import type { Activity, Certificate, LeaderboardEntry, Skill } from '../types';

export const userStats = {
  totalHours: 0,
  campaigns: 0,
  points: 0,
  certificates: 0,
  level: 'New Volunteer',
  levelNumber: 1,
};

export const userSkills: Skill[] = [];

export const recentActivity: Activity[] = [];

export const leaderboard: LeaderboardEntry[] = [];

export const certificates: Certificate[] = [];
