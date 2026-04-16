export const publicNavItems = [
  { path: '/', label: 'Home' },
  { path: '/matches', label: 'Matches' },
  { path: '/tournaments', label: 'Tournaments' },
  { path: '/players', label: 'Players' },
  { path: '/teams', label: 'Teams' },
  { path: '/leaderboards', label: 'Leaderboards' },
  { path: '/news', label: 'News' },
]

export const userMenuItems = [
  { path: '/dashboard', label: 'Dashboard', roles: ['player', 'fan', 'organizer', 'scorer', 'admin'] },
  { path: '/scorer', label: 'Scorer Console', roles: ['scorer', 'organizer', 'admin'] },
  { path: '/admin', label: 'Admin Panel', roles: ['admin'] },
]
