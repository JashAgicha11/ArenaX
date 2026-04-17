import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { WorkspacePageShell } from '@components/workspace/WorkspacePrimitives'
import { dashboardService } from '@services/dashboardService'

const initialState = {
  name: '',
  sportKey: 'football',
  type: 'league',
  season: `${new Date().getFullYear()}`,
  startDate: '',
  endDate: '',
}

const CreateTournament = () => {
  const [formData, setFormData] = useState(initialState)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    try {
      await dashboardService.createTournament(formData)
      toast.success('Tournament created successfully')
      navigate('/tournaments')
    } catch (error) {
      toast.error(error.message || 'Failed to create tournament')
    } finally {
      setLoading(false)
    }
  }

  return (
    <WorkspacePageShell
      eyebrow="Organizer Action"
      title="Create Tournament"
      description="Set up a tournament and publish it for players."
    >
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Tournament Name</label>
          <input name="name" value={formData.name} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Sport</label>
            <select name="sportKey" value={formData.sportKey} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <option value="cricket">Cricket</option>
              <option value="football">Football</option>
              <option value="basketball">Basketball</option>
              <option value="badminton">Badminton</option>
              <option value="tennis">Tennis</option>
              <option value="volleyball">Volleyball</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Type</label>
            <select name="type" value={formData.type} onChange={handleChange} className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
              <option value="league">League</option>
              <option value="knockout">Knockout</option>
              <option value="round-robin">Round Robin</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Season</label>
            <input name="season" value={formData.season} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">Start Date</label>
            <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">End Date</label>
            <input type="date" name="endDate" value={formData.endDate} onChange={handleChange} required className="w-full rounded-xl border border-slate-300 px-4 py-3 dark:border-slate-700 dark:bg-slate-800" />
          </div>
        </div>

        <button type="submit" disabled={loading} className="rounded-xl bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700 disabled:opacity-60">
          {loading ? 'Creating...' : 'Create Tournament'}
        </button>
      </form>
    </WorkspacePageShell>
  )
}

export default CreateTournament
