import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'
import { useAuth } from '@contexts/AuthContext'
import { matchService } from '@services/matchService'

const Matches = () => {
  const { user } = useAuth()
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true)
        setError('')
        const data = user?.role === 'player'
          ? await matchService.getMyMatches()
          : await matchService.getMatches()
        setMatches(data.matches || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load matches.')
        setMatches([])
      } finally {
        setLoading(false)
      }
    }

    loadMatches()
  }, [user])

  const getMatchScore = (match) => {
    if (match?.result?.homeScore || match?.result?.awayScore) {
      return `${match.result.homeScore || '-'} - ${match.result.awayScore || '-'}`
    }
    return 'Score unavailable'
  }

  const getTeamsLabel = (match) =>
    `${match?.homeTeamId?.name || 'TBD'} vs ${match?.awayTeamId?.name || 'TBD'}`

  return (
    <PublicPageShell title="Live Matches" subtitle="Follow high-intensity fixtures with real-time match states and event feeds.">
      {loading ? (
        <p className="text-slate-600 dark:text-slate-300">Loading matches...</p>
      ) : null}
      {error ? (
        <p className="mb-4 text-sm text-rose-600 dark:text-rose-300">{error}</p>
      ) : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <PublicCard key={match._id}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm capitalize text-slate-500 dark:text-slate-400">{match.tournamentId?.sport || 'sport'}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${match.status === 'live' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'}`}>
                {match.status}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{getTeamsLabel(match)}</h2>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{getMatchScore(match)}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {match.scheduledAt ? new Date(match.scheduledAt).toLocaleString() : 'Schedule pending'}
            </p>
            <Link to={`/matches/${match._id}`} className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
              Open Match
            </Link>
          </PublicCard>
        ))}
      </div>
      {!loading && matches.length === 0 ? (
        <p className="mt-6 text-slate-600 dark:text-slate-300">
          {user?.role === 'player' ? 'No matches found for this player' : 'No matches found.'}
        </p>
      ) : null}
    </PublicPageShell>
  )
}

export default Matches