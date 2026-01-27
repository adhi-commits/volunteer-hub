export type CampaignStatus = 'Active' | 'Upcoming' | 'Completed';

export type CampaignCategory =
  | 'Environment'
  | 'Education'
  | 'Healthcare'
  | 'Poverty'
  | 'Human Rights';

export interface Campaign {
  id: string;
  title: string;
  status: CampaignStatus;
  category: CampaignCategory;
  description: string;
  organization: string;
  location: string;
  dateRange: string;
  volunteersCurrent: number;
  volunteersTarget: number;
}

export interface Ngo {
  id: string;
  name: string;
  category: CampaignCategory | 'General';
  description: string;
  location: string;
  campaigns: number;
  volunteers: number;
  colorClass: string;
  verified?: boolean;
}

export interface Activity {
  title: string;
  subtitle: string;
  timeAgo: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}

export interface LeaderboardEntry {
  position: number;
  name: string;
  points: number;
  colorClass: string;
  iconColor?: string;
  isCurrentUser?: boolean;
}

export interface Certificate {
  id: string;
  title: string;
  org: string;
  issued: string;
  colorClass: string;
}

export interface Skill {
  name: string;
  level: string;
  progress: number;
}
