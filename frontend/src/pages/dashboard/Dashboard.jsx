import { Link } from 'react-router-dom'
import { useAuth } from '@contexts/AuthContext'
import { ActionPanel, DataList, StatCard, WorkspacePageShell } from '@components/workspace/WorkspacePrimitives'

const Dashboard = () => {
  const { user } = useAuth()

  const quickActions = [
    { title: 'Explore live matches', description: 'Follow ongoing games with minute-level updates.', actionLabel: 'Open Matches', to: '/matches' },
    { title: 'Track tournaments', description: 'View active brackets, schedules, and standings.', actionLabel: 'View Tournaments', to: '/tournaments' },
    { title: 'Read updates', description: 'Stay current with the latest ArenaX sports coverage.', actionLabel: 'Open News', to: '/news' },
  ]

  if (user?.role === 'scorer' || user?.role === 'organizer' || user?.role === 'admin') {
    quickActions.unshift({
      title: 'Go to scorer console',
      description: 'Capture events, scores, and momentum changes in real time.',
      actionLabel: 'Open Console',
      to: '/scorer',
    })
  }

  return (
    <WorkspacePageShell
      eyebrow="Personal Workspace"
      title={`Welcome back, ${user?.name || 'Player'}`}
      description="Your ArenaX control center for matches, updates, and role-based tools."
      actions={
        <>
          <Link to="/leaderboards" className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Leaderboards</Link>
          <Link to="/matches" className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">Live Matches</Link>
        </>
      }
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Matches Followed" value="42" helper="Last 30 days" />
        <StatCard label="Favorite Sport" value="Football" helper="Auto-personalized feed" />
        <StatCard label="Prediction Accuracy" value="78%" helper="Across 115 picks" />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {quickActions.map((action) => (
          <ActionPanel key={action.title} {...action} />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DataList
          title="Recent Activity"
          items={[
            'Watched Manchester United vs Liverpool',
            'Followed Barcelona FC',
            'Joined Premier League predictions',
          ]}
        />
        <DataList
          title="Notifications"
          items={[
            'New match starts in 30 minutes',
            'Tournament bracket updated',
            'Player transfer news alert',
          ]}
        />
      </div>
    </WorkspacePageShell>
  )
}

export default Dashboard