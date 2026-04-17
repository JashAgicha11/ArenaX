import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'
import { teamService } from '@services/teamService'

const Teams = () => {
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTeams = async () => {
      try {
        setLoading(true)
        const data = await teamService.getTeams()
        setTeams(data.teams || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load teams.')
        setTeams([])
      } finally {
        setLoading(false)
      }
    }
    loadTeams()
  }, [])

  return (
    <PublicPageShell title="Teams" subtitle="Analyze roster power, league position, and title momentum by club.">
      {loading ? <p className="text-slate-600 dark:text-slate-300">Loading teams...</p> : null}
      {error ? <p className="mb-4 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <PublicCard key={team._id} className="text-center">
            <div className="mx-auto mb-4 h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{team.name}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{team.sport}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Players: {(team.players || []).length}</p>
            <Link to={`/teams/${team._id}`} className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
              Team Details
            </Link>
          </PublicCard>
        ))}
      </div>
      {!loading && !teams.length && !error ? <p className="mt-6 text-slate-600 dark:text-slate-300">No teams found.</p> : null}
    </PublicPageShell>
  )
}

export default Teams