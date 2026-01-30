import type { Activity, Certificate, LeaderboardEntry, Skill } from '../types';

export const userStats = {
  totalHours: 36,
  campaigns: 12,
  points: 450,
  certificates: 5,
  level: 'Gold Volunteer',
  levelNumber: 3,
};

export const userSkills: Skill[] = [
  { name: 'Photography', level: 'Expert', progress: 90 },
  { name: 'First Aid', level: 'Advanced', progress: 75 },
  { name: 'Public Speaking', level: 'Intermediate', progress: 60 },
  { name: 'Teaching', level: 'Advanced', progress: 80 },
];

export const recentActivity: Activity[] = [
  {
    title: 'Completed Campaign',
    subtitle: 'Clean Water Initiative',
    timeAgo: '2 days ago',
    icon: 'check_circle',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
  },
  {
    title: 'Earned Badge',
    subtitle: 'Photography Expert',
    timeAgo: '5 days ago',
    icon: 'star',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
  },
  {
    title: 'Joined Campaign',
    subtitle: 'Tree Plantation Program',
    timeAgo: '1 week ago',
    icon: 'volunteer_activism',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { position: 1, name: 'Sarah Johnson', points: 850, colorClass: 'bg-yellow-400', iconColor: 'text-yellow-500' },
  { position: 2, name: 'Mike Chen', points: 720, colorClass: 'bg-gray-400', iconColor: 'text-gray-400' },
  { position: 3, name: 'Emma Davis', points: 680, colorClass: 'bg-orange-400', iconColor: 'text-orange-400' },
  { position: 7, name: 'You', points: 450, colorClass: 'bg-teal-600', isCurrentUser: true },
];

export const certificates: Certificate[] = [
  {
    id: 'cert-water',
    title: 'Clean Water Initiative',
    org: 'WaterAid Foundation',
    issued: 'Issued: March 30, 2026',
    colorClass: 'border-teal-200 bg-gradient-to-br from-teal-50 to-white text-teal-600',
  },
  {
    id: 'cert-education',
    title: 'Education Campaign',
    org: 'Bright Futures Org',
    issued: 'Issued: In Progress',
    colorClass: 'border-blue-200 bg-gradient-to-br from-blue-50 to-white text-blue-600',
  },
  {
    id: 'cert-tree',
    title: 'Tree Plantation',
    org: 'Green Earth Society',
    issued: 'Issued: Dec 15, 2025',
    colorClass: 'border-green-200 bg-gradient-to-br from-green-50 to-white text-green-600',
  },
  {
    id: 'cert-women',
    title: 'Women Empowerment',
    org: 'Rising Women Foundation',
    issued: 'Issued: Nov 10, 2025',
    colorClass: 'border-purple-200 bg-gradient-to-br from-purple-50 to-white text-purple-600',
  },
];
