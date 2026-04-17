import { useEffect, useMemo, useState } from 'react'
import { ActionPanel, DataList, StatCard, WorkspacePageShell } from '@components/workspace/WorkspacePrimitives'
import { dashboardService } from '@services/dashboardService'

const PlayerDashboard = () => {
  const [loading, setLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true)
        const data = await dashboardService.getPlayerDashboard()
        setDashboardData(data)
      } catch (loadError) {
        setError(loadError.message || 'Failed to load player dashboard')
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [])

  const seasonStats = useMemo(() => {
    return dashboardData?.player?.stats || {}
  }, [dashboardData])

  const tournamentItems = useMemo(
    () =>
      (dashboardData?.tournaments || []).map(
        (tournament) => `${tournament.name} (${tournament.sport}) - ${tournament.status}`
      ),
    [dashboardData]
  )

  if (loading) {
    return (
      <WorkspacePageShell
        eyebrow="Player Dashboard"
        title="Player Workspace"
        description="Loading your tournaments and statistics..."
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          Loading dashboard...
        </div>
      </WorkspacePageShell>
    )
  }

  if (error) {
    return (
      <WorkspacePageShell
        eyebrow="Player Dashboard"
        title="Player Workspace"
        description="Unable to load dashboard data."
      >
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          {error}
        </div>
      </WorkspacePageShell>
    )
  }

  return (
    <WorkspacePageShell
      eyebrow="Player Dashboard"
      title="Player Workspace"
      description="Track tournaments, follow matches, and monitor your backend-driven performance."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Tournaments Joined" value={dashboardData?.summary?.tournamentsCount ?? 0} />
        <StatCard label="Matches Played" value={dashboardData?.summary?.matchesCount ?? 0} />
        <StatCard label="Live Matches" value={dashboardData?.summary?.liveMatchesCount ?? 0} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {Object.entries(seasonStats)
          .slice(0, 3)
          .map(([key, value]) => (
            <StatCard key={key} label={key} value={String(value)} />
          ))}
      </div>

      <div className="mt-2 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ActionPanel title="Upcoming Matches" description="See your upcoming fixtures and schedules." actionLabel="View Matches" to="/matches" />
        <ActionPanel title="Active Tournaments" description="Browse tournaments you can participate in." actionLabel="Browse Tournaments" to="/tournaments" />
        <ActionPanel title="Rankings" description="Review where you stand in the leaderboard." actionLabel="Open Leaderboards" to="/leaderboards" />
      </div>
      <div className="mt-6">
        <DataList
          title="My Tournaments"
          items={tournamentItems.length > 0 ? tournamentItems : ['No tournaments joined yet']}
        />
      </div>
    </WorkspacePageShell>
  )
}

export default PlayerDashboard
