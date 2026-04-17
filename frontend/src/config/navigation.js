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
  { path: '/dashboard', label: 'Dashboard', roles: ['player', 'organizer', 'admin'] },
  { path: '/dashboard/player', label: 'Player Dashboard', roles: ['player', 'admin'] },
  { path: '/dashboard/organizer', label: 'Organizer Dashboard', roles: ['organizer', 'admin'] },
  { path: '/dashboard/admin', label: 'Admin Dashboard', roles: ['admin'] },
]
