import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { WorkspacePageShell } from '@components/workspace/WorkspacePrimitives'
import { dashboardService } from '@services/dashboardService'

const CreateTeam = () => {
  const [formData, setFormData] = useState({ name: '', sport: 'football', tournamentId: '' })
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        const data = await dashboardService.getTournaments()
        setTournaments(data.tournaments || [])
      } catch (error) {
        toast.error(error.message || 'Failed to load tournaments')
      } finally {
        setFetching(false)
      }
    }
    loadTournaments()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await dashboardService.createTeam(formData)
      toast.success('Team created successfully')
      navigate('/teams')
    } catch (error) {
      toast.error(error.message || 'Failed to create team')
    } finally {
      setLoading(false)
    }
  }

  return (
    <WorkspacePageShell eyebrow="Organizer Action" title="Create Team" description="Create a team in one of your tournaments.">
      {fetching ? <p className="text-slate-600 dark:text-slate-300">Loading tournaments...</p> : null}
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Team Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Sport</label>
            <select name="sport" value={formData.sport} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="badminton">Badminton</option>
              <option value="tennis">Tennis</option>
              <option value="volleyball">Volleyball</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Tournament</label>
            <select name="tournamentId" value={formData.tournamentId} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <option value="">Select tournament</option>
              {tournaments.map((tournament) => (
                <option key={tournament._id} value={tournament._id}>{tournament.name}</option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading} className="rounded-xl bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {loading ? 'Creating...' : 'Create Team'}
        </button>
      </form>
    </WorkspacePageShell>
  )
}

export default CreateTeam
