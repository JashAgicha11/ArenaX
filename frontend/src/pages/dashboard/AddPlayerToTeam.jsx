import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { WorkspacePageShell } from '@components/workspace/WorkspacePrimitives'
import { dashboardService } from '@services/dashboardService'

const AddPlayerToTeam = () => {
  const [teams, setTeams] = useState([])
  const [formData, setFormData] = useState({ teamId: '', playerId: '' })
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await dashboardService.getTeams()
        setTeams(data.teams || [])
      } catch (error) {
        toast.error(error.message || 'Failed to load teams')
      } finally {
        setFetching(false)
      }
    }
    loadTeams()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await dashboardService.addPlayerToTeam(formData.teamId, formData.playerId.trim())
      toast.success('Player added to team')
      setFormData((prev) => ({ ...prev, playerId: '' }))
    } catch (error) {
      toast.error(error.message || 'Failed to add player')
    } finally {
      setLoading(false)
    }
  }

  return (
    <WorkspacePageShell eyebrow="Organizer Action" title="Add Player To Team" description="Add a player using their unique playerId.">
      {fetching ? <p className="text-slate-600 dark:text-slate-300">Loading teams...</p> : null}
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Team</label>
          <select name="teamId" value={formData.teamId} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
            <option value="">Select team</option>
            {teams.map((team) => (
              <option key={team._id} value={team._id}>{team.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Player ID</label>
          <input name="playerId" value={formData.playerId} onChange={handleChange} required placeholder="PLY12345" className="w-full rounded-xl border border-slate-300 px-4 py-3 uppercase dark:border-slate-700 dark:bg-slate-800" />
        </div>
        <button type="submit" disabled={loading} className="rounded-xl bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {loading ? 'Adding...' : 'Add Player'}
        </button>
      </form>
    </WorkspacePageShell>
  )
}

export default AddPlayerToTeam
