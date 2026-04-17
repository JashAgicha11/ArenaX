import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { WorkspacePageShell } from '@components/workspace/WorkspacePrimitives'
import { tournamentService } from '@services/tournamentService'

const TournamentApplications = () => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  const loadTournaments = async () => {
    try {
      setLoading(true)
      const data = await tournamentService.getTournaments({ scope: 'me' })
      setTournaments(data.tournaments || [])
    } catch (error) {
      toast.error(error.message || 'Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTournaments()
  }, [])

  const handleReview = async (tournamentId, applicationId, status) => {
    try {
      await tournamentService.reviewApplication(tournamentId, applicationId, status)
      toast.success(`Application ${status}`)
      await loadTournaments()
    } catch (error) {
      toast.error(error.message || 'Failed to update application')
    }
  }

  return (
    <WorkspacePageShell eyebrow="Organizer Action" title="Tournament Applications" description="Review player requests to join your tournaments.">
      {loading ? <p className="text-slate-600 dark:text-slate-300">Loading applications...</p> : null}
      <div className="space-y-4">
        {tournaments.map((tournament) => (
          <div key={tournament._id} className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{tournament.name}</h2>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Sport: {tournament.sport}</p>
            <div className="space-y-3">
              {(tournament.applications || []).map((application) => (
                <div key={application._id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-700">
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {application.playerId?.displayName || 'Player'} ({application.playerId?.playerId || 'N/A'})
                    </p>
                    <p className="text-xs capitalize text-slate-500 dark:text-slate-400">Status: {application.status}</p>
                  </div>
                  {application.status === 'pending' ? (
                    <div className="flex gap-2">
                      <button type="button" onClick={() => handleReview(tournament._id, application._id, 'approved')} className="rounded-lg bg-emerald-600 px-3 py-1 text-sm font-medium text-white hover:bg-emerald-700">Approve</button>
                      <button type="button" onClick={() => handleReview(tournament._id, application._id, 'rejected')} className="rounded-lg bg-rose-600 px-3 py-1 text-sm font-medium text-white hover:bg-rose-700">Reject</button>
                    </div>
                  ) : null}
                </div>
              ))}
              {!(tournament.applications || []).length ? <p className="text-sm text-slate-600 dark:text-slate-300">No applications yet.</p> : null}
            </div>
          </div>
        ))}
      </div>
    </WorkspacePageShell>
  )
}

export default TournamentApplications
