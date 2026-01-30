import type { Campaign } from '../types';

export const campaigns: Campaign[] = [
  {
    id: 'clean-water',
    title: 'Clean Water Initiative',
    status: 'Active',
    category: 'Environment',
    description:
      'Providing clean water access to 5,000+ families through sustainable well construction.',
    organization: 'WaterAid Foundation',
    location: 'Rural Kenya',
    dateRange: 'Jan 15 - Mar 30, 2026',
    volunteersCurrent: 45,
    volunteersTarget: 100,
  },
  {
    id: 'education-all',
    title: 'Education for All',
    status: 'Active',
    category: 'Education',
    description:
      'Building schools and training teachers in underserved communities.',
    organization: 'Bright Futures Org',
    location: 'New Delhi, India',
    dateRange: 'Feb 1 - Dec 31, 2026',
    volunteersCurrent: 120,
    volunteersTarget: 200,
  },
  {
    id: 'healthcare-outreach',
    title: 'Healthcare Outreach',
    status: 'Upcoming',
    category: 'Healthcare',
    description:
      'Free medical camps and health awareness programs for urban poor.',
    organization: 'MedCare International',
    location: 'Lagos, Nigeria',
    dateRange: 'Mar 10 - Jun 15, 2026',
    volunteersCurrent: 30,
    volunteersTarget: 50,
  },
  {
    id: 'tree-plantation',
    title: 'Tree Plantation Program',
    status: 'Active',
    category: 'Environment',
    description:
      'Reforestation initiative planting 100,000 native trees to combat deforestation.',
    organization: 'Green Earth Society',
    location: 'Amazon Basin, Brazil',
    dateRange: 'Apr 1 - Oct 30, 2026',
    volunteersCurrent: 15,
    volunteersTarget: 75,
  },
  {
    id: 'women-empowerment',
    title: 'Women Empowerment Workshop',
    status: 'Active',
    category: 'Human Rights',
    description:
      'Skill development and entrepreneurship training for marginalized women.',
    organization: 'Rising Women Foundation',
    location: 'Dhaka, Bangladesh',
    dateRange: 'Feb 15 - May 15, 2026',
    volunteersCurrent: 25,
    volunteersTarget: 40,
  },
  {
    id: 'food-bank',
    title: 'Food Bank Drive',
    status: 'Completed',
    category: 'Poverty',
    description:
      'Distributing meals to homeless shelters and food-insecure families.',
    organization: 'Hunger Relief Network',
    location: 'Chicago, USA',
    dateRange: 'Jan 1 - Jan 31, 2026',
    volunteersCurrent: 80,
    volunteersTarget: 80,
  },
];
