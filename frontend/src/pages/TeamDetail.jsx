import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'
import { teamService } from '@services/teamService'
import { useAuth } from '@contexts/AuthContext'

const TeamDetail = () => {
  const { teamId } = useParams()
  const { user } = useAuth()
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [playerId, setPlayerId] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const canManageTeam = useMemo(() => {
    if (!user || !team) return false
    if (user.role === 'admin') return true
    return user.role === 'organizer' && String(team.tournamentId?.organizerId || '') === String(user._id)
  }, [user, team])

  useEffect(() => {
    const loadTeam = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await teamService.getTeamById(teamId)
        setTeam(data.team)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load team details.')
      } finally {
        setLoading(false)
      }
    }
    if (teamId) loadTeam()
  }, [teamId])

  const handleAddPlayer = async (event) => {
    event.preventDefault()
    if (!playerId.trim()) return
    try {
      setSubmitting(true)
      await teamService.addPlayerToTeam(teamId, playerId.trim().toUpperCase())
      toast.success('Player added to team')
      setPlayerId('')
      const data = await teamService.getTeamById(teamId)
      setTeam(data.team)
    } catch (err) {
      toast.error(err.message || 'Failed to add player')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PublicPageShell title="Team Profile" subtitle="Season trajectory, roster depth, and competitive achievements.">
      <PublicCard>
        {loading ? <p className="text-slate-600 dark:text-slate-300">Loading team details...</p> : null}
        {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
        {!loading && !error && !team ? <p className="text-slate-600 dark:text-slate-300">Team not found.</p> : null}
        {team ? (
          <>
            <div className="mb-6 flex items-center">
              <div className="mr-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{team.name}</h1>
                <p className="text-slate-600 dark:text-slate-400 capitalize">{team.sport}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Tournament: {team.tournamentId?.name || 'N/A'}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{(team.players || []).length}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Players</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">{team.createdBy?.name || 'Unknown'}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Created By</div>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
                <div className="text-2xl font-bold text-slate-900 dark:text-white capitalize">{team.sport}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400">Sport</div>
              </div>
            </div>
            <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Team Players</h3>
              <div className="mt-3 space-y-2">
                {(team.players || []).map((player) => (
                  <div key={player._id} className="flex items-center justify-between rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                    <span className="font-medium text-slate-900 dark:text-white">{player.displayName}</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">{player.playerId}</span>
                  </div>
                ))}
                {!(team.players || []).length ? <p className="text-sm text-slate-600 dark:text-slate-400">No players added yet.</p> : null}
              </div>
              {canManageTeam ? (
                <form onSubmit={handleAddPlayer} className="mt-4 flex flex-col gap-2 sm:flex-row">
                  <input
                    value={playerId}
                    onChange={(event) => setPlayerId(event.target.value)}
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
              ) : null}
            </div>
          </>
        ) : null}
      </PublicCard>
    </PublicPageShell>
  )
}

export default TeamDetail