import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'
import { matchService } from '@services/matchService'

const MatchDetail = () => {
  const { matchId } = useParams()
  const [match, setMatch] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadMatch = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await matchService.getMatchById(matchId)
        setMatch(data.match)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load match details.')
      } finally {
        setLoading(false)
      }
    }

    if (matchId) {
      loadMatch()
    }
  }, [matchId])

  const events = match?.scoringFeed || []

  return (
    <PublicPageShell title="Match Details" subtitle="Full event timeline, game state, and momentum snapshot.">
      <PublicCard>
        {loading ? <p className="text-slate-600 dark:text-slate-300">Loading match details...</p> : null}
        {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
        {!loading && !error && !match ? <p className="text-slate-600 dark:text-slate-300">Match not found.</p> : null}
        {match ? (
          <>
        <div className="text-center">
          <p className="text-sm capitalize text-primary-600 dark:text-primary-300">{match.tournamentId?.sport || 'sport'} match</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">
            {match.homeTeamId?.name || 'TBD'} vs {match.awayTeamId?.name || 'TBD'}
          </h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {match.scheduledAt ? new Date(match.scheduledAt).toLocaleString() : 'Schedule pending'} - {match.status}
          </p>
        </div>
        <div className="mt-6 grid gap-3">
          {events.map((event) => (
            <div key={event._id || `${event.timestamp}-${event.eventType}`} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
              {(event.time || new Date(event.timestamp).toLocaleTimeString())} - {event.eventType || 'event'}
              {event.data ? ` (${JSON.stringify(event.data)})` : ''}
            </div>
          ))}
          {!events.length ? (
            <p className="text-sm text-slate-600 dark:text-slate-300">No events available for this match.</p>
          ) : null}
        </div>
          </>
        ) : null}
      </PublicCard>
    </PublicPageShell>
  )
}

export default MatchDetail