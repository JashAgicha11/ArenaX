import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'
import { tournamentService } from '@services/tournamentService'

const TournamentDetail = () => {
  const { tournamentId } = useParams()
  const [tournament, setTournament] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTournament = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await tournamentService.getTournamentById(tournamentId)
        setTournament(data.tournament)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load tournament details.')
      } finally {
        setLoading(false)
      }
    }

    if (tournamentId) {
      loadTournament()
    }
  }, [tournamentId])

  return (
    <PublicPageShell title="Tournament Details" subtitle="Track standings, prize pool progress, and matchday outcomes.">
      <PublicCard>
        {loading ? <p className="text-slate-600 dark:text-slate-300">Loading tournament details...</p> : null}
        {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
        {!loading && !error && !tournament ? <p className="text-slate-600 dark:text-slate-300">Tournament not found.</p> : null}
        {tournament ? (
          <>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{tournament.name}</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {(tournament.sportKey || 'sport unavailable').toString()} tournament - Season {tournament.season || 'N/A'}
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Tournament Info</h3>
            <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li><strong>Sport:</strong> {tournament.sportKey || 'N/A'}</li>
              <li><strong>Teams:</strong> {(tournament.teams || []).length}</li>
              <li><strong>Players:</strong> {(tournament.players || []).length}</li>
              <li><strong>Status:</strong> {tournament.status || 'N/A'}</li>
              <li><strong>Prize Pool:</strong> {tournament.settings?.prizePool || 'N/A'}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Current Standings</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {(tournament.standings || []).map((standing, idx) => (
                <div key={standing._id || idx} className="flex justify-between rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                  <span>{standing.rank || idx + 1}. {standing.entityType}</span>
                  <span>{standing.points || 0} pts</span>
                </div>
              ))}
              {!(tournament.standings || []).length ? <p>No standings available yet.</p> : null}
            </div>
          </div>
        </div>
          </>
        ) : null}
      </PublicCard>
    </PublicPageShell>
  )
}

export default TournamentDetail