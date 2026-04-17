import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'
import { tournamentService } from '@services/tournamentService'

const Leaderboards = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tournaments, setTournaments] = useState([])
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const selectedTournamentId = searchParams.get('tournamentId') || ''

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await tournamentService.getTournaments()
        const list = data.tournaments || []
        setTournaments(list)
        if (!selectedTournamentId && list.length) {
          setSearchParams({ tournamentId: list[0]._id }, { replace: true })
        }
      } catch (err) {
        setError(err.message || 'Failed to load tournaments')
      }
    }
    loadTournaments()
  }, [selectedTournamentId, setSearchParams])

  useEffect(() => {
    const loadLeaderboard = async () => {
      if (!selectedTournamentId) return
      try {
        setLoading(true)
        setError('')
        const data = await tournamentService.getTournamentLeaderboard(selectedTournamentId)
        setLeaderboard(data.leaderboard || [])
      } catch (err) {
        setError(err.message || 'Failed to load leaderboard')
      } finally {
        setLoading(false)
      }
    }
    loadLeaderboard()
  }, [selectedTournamentId])

  return (
    <PublicPageShell title="Leaderboards" subtitle="Transparent rankings by form, contribution, and clutch-impact score.">
      <PublicCard>
        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Tournament</label>
          <select
            value={selectedTournamentId}
            onChange={(event) => setSearchParams({ tournamentId: event.target.value })}
            className="w-full max-w-xl rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
          >
            <option value="">Select tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament._id} value={tournament._id}>{tournament.name}</option>
            ))}
          </select>
        </div>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Top Players (Selected Tournament)</h2>
        {loading ? <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">Loading leaderboard...</p> : null}
        {error ? <p className="mt-3 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
        <div className="mt-4 space-y-2">
          {leaderboard.map((entry) => (
            <div key={entry.player._id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
              <span className="font-medium text-slate-800 dark:text-slate-100">
                {entry.rank}. {entry.player.displayName} ({entry.player.playerId})
              </span>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-300">{entry.stats?.points || 0} pts</span>
            </div>
          ))}
          {!loading && !leaderboard.length ? <p className="text-sm text-slate-600 dark:text-slate-300">No player stats found for this tournament yet.</p> : null}
        </div>
      </PublicCard>
    </PublicPageShell>
  )
}

export default Leaderboards