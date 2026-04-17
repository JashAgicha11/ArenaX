import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'
import { tournamentService } from '@services/tournamentService'
import { useAuth } from '@contexts/AuthContext'

const TournamentDetail = () => {
  const { tournamentId } = useParams()
  const { user } = useAuth()
  const [tournament, setTournament] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [assignment, setAssignment] = useState({ teamId: '', playerId: '' })
  const [submitting, setSubmitting] = useState(false)

  const canManageTournament = useMemo(() => {
    if (!user || !tournament) return false
    if (user.role === 'admin') return true
    return user.role === 'organizer' && String(tournament.organizerId?._id || '') === String(user._id)
  }, [user, tournament])

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

  const handleAssignPlayer = async (event) => {
    event.preventDefault()
    if (!assignment.teamId || !assignment.playerId) {
      toast.error('Select team and player ID first')
      return
    }
    try {
      setSubmitting(true)
      await tournamentService.addPlayerToTournamentTeam(tournamentId, assignment)
      toast.success('Player added to tournament team')
      setAssignment({ teamId: '', playerId: '' })
      const data = await tournamentService.getTournamentById(tournamentId)
      setTournament(data.tournament)
    } catch (err) {
      toast.error(err.message || 'Failed to add player')
    } finally {
      setSubmitting(false)
    }
  }

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
          {(tournament.sport || 'sport unavailable').toString()} tournament
        </p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Tournament Info</h3>
            <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li><strong>Sport:</strong> {tournament.sport || 'N/A'}</li>
              <li><strong>Teams:</strong> {(tournament.teams || []).length}</li>
              <li><strong>Status:</strong> {tournament.status || 'N/A'}</li>
              <li><strong>Matches:</strong> {(tournament.matches || []).length}</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Fixture Snapshot</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {(tournament.matches || []).map((match, idx) => (
                <div key={match._id || idx} className="flex justify-between rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                  <span>Match {idx + 1}</span>
                  <span className="capitalize">{match.status || 'upcoming'}</span>
                </div>
              ))}
              {!(tournament.matches || []).length ? <p>No matches available yet.</p> : null}
            </div>
          </div>
        </div>
        {canManageTournament ? (
          <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Tournament Actions</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Create and manage matches inside this tournament only.</p>
              <Link to={`/tournaments/${tournamentId}/create-match`} className="mt-4 inline-flex rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700">
                Create Match In This Tournament
              </Link>
            </div>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800">
              <h3 className="text-lg font-medium text-slate-900 dark:text-white">Add Player To Tournament Team</h3>
              <form onSubmit={handleAssignPlayer} className="mt-3 space-y-3">
                <select
                  value={assignment.teamId}
                  onChange={(event) => setAssignment((prev) => ({ ...prev, teamId: event.target.value }))}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900"
                  required
                >
                  <option value="">Select team</option>
                  {(tournament.teams || []).map((team) => (
                    <option key={team._id} value={team._id}>{team.name}</option>
                  ))}
                </select>
                <input
                  value={assignment.playerId}
                  onChange={(event) => setAssignment((prev) => ({ ...prev, playerId: event.target.value }))}
                  placeholder="Enter playerId (e.g. PLR0001)"
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-900"
                  required
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60"
                >
                  {submitting ? 'Adding...' : 'Add Player'}
                </button>
              </form>
            </div>
          </div>
        ) : null}
          </>
        ) : null}
      </PublicCard>
    </PublicPageShell>
  )
}

export default TournamentDetail