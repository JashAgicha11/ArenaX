import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { WorkspacePageShell } from '@components/workspace/WorkspacePrimitives'
import { dashboardService } from '@services/dashboardService'

const CreateMatch = () => {
  const [tournaments, setTournaments] = useState([])
  const [teams, setTeams] = useState([])
  const [players, setPlayers] = useState([])
  const [formData, setFormData] = useState({
    tournamentId: '',
    homeTeamId: '',
    awayTeamId: '',
    scheduledAt: '',
  })
  const [playersInvolved, setPlayersInvolved] = useState([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const loadDependencies = async () => {
      try {
        const [tournamentData, teamData, playerData] = await Promise.all([
          dashboardService.getTournaments(),
          dashboardService.getTeams(),
          dashboardService.getPlayers(),
        ])
        setTournaments(tournamentData.tournaments || [])
        setTeams(teamData.teams || [])
        setPlayers(playerData.players || [])
      } catch (error) {
        toast.error(error.message || 'Failed to load match dependencies')
      }
    }
    loadDependencies()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const addPlayerRow = () => {
    setPlayersInvolved((prev) => [...prev, { playerId: '', teamId: '', role: '' }])
  }

  const updatePlayerRow = (index, key, value) => {
    setPlayersInvolved((prev) => prev.map((entry, idx) => (idx === index ? { ...entry, [key]: value } : entry)))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await dashboardService.createMatch({
        ...formData,
        playersInvolved: playersInvolved.filter((entry) => entry.playerId && entry.teamId),
        status: 'upcoming',
      })
      toast.success('Match created successfully')
      navigate('/matches')
    } catch (error) {
      toast.error(error.message || 'Failed to create match')
    } finally {
      setLoading(false)
    }
  }

  return (
    <WorkspacePageShell eyebrow="Organizer Action" title="Create Match" description="Create a tournament match and link players from team rosters.">
      <form onSubmit={handleSubmit} className="mx-auto max-w-4xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Tournament</label>
            <select name="tournamentId" value={formData.tournamentId} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <option value="">Select tournament</option>
              {tournaments.map((tournament) => <option key={tournament._id} value={tournament._id}>{tournament.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Scheduled At</label>
            <input type="datetime-local" name="scheduledAt" value={formData.scheduledAt} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Home Team</label>
            <select name="homeTeamId" value={formData.homeTeamId} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <option value="">Select home team</option>
              {teams.map((team) => <option key={team._id} value={team._id}>{team.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Away Team</label>
            <select name="awayTeamId" value={formData.awayTeamId} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <option value="">Select away team</option>
              {teams.map((team) => <option key={team._id} value={team._id}>{team.name}</option>)}
            </select>
          </div>
        </div>

        <div className="space-y-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Players Involved</h3>
            <button type="button" onClick={addPlayerRow} className="rounded-lg border border-slate-300 px-3 py-1 text-sm dark:border-slate-700">Add Player</button>
          </div>
          {playersInvolved.map((entry, index) => (
            <div key={`entry-${index}`} className="grid grid-cols-1 gap-3 md:grid-cols-3">
              <select value={entry.playerId} onChange={(event) => updatePlayerRow(index, 'playerId', event.target.value)} className="rounded-xl border border-slate-300 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
                <option value="">Player</option>
                {players.map((player) => <option key={player._id} value={player._id}>{player.displayName} ({player.playerId})</option>)}
              </select>
              <select value={entry.teamId} onChange={(event) => updatePlayerRow(index, 'teamId', event.target.value)} className="rounded-xl border border-slate-300 px-4 py-2 dark:border-slate-700 dark:bg-slate-800">
                <option value="">Team</option>
                {teams.map((team) => <option key={team._id} value={team._id}>{team.name}</option>)}
              </select>
              <input value={entry.role} onChange={(event) => updatePlayerRow(index, 'role', event.target.value)} placeholder="Role (optional)" className="rounded-xl border border-slate-300 px-4 py-2 dark:border-slate-700 dark:bg-slate-800" />
            </div>
          ))}
        </div>

        <button type="submit" disabled={loading} className="rounded-xl bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {loading ? 'Creating...' : 'Create Match'}
        </button>
      </form>
    </WorkspacePageShell>
  )
}

export default CreateMatch
