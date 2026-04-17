import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'
import { useAuth } from '@contexts/AuthContext'
import { tournamentService } from '@services/tournamentService'

const Tournaments = () => {
  const { user } = useAuth()
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        setLoading(true)
        setError('')
        const data = user?.role === 'player'
          ? await tournamentService.getMyTournaments()
          : await tournamentService.getTournaments()
        setTournaments(data.tournaments || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load tournaments.')
        setTournaments([])
      } finally {
        setLoading(false)
      }
    }

    loadTournaments()
  }, [user])

  return (
    <PublicPageShell title="Tournaments" subtitle="Compete in pro-grade events with bracket intelligence and live progression insights.">
      {loading ? <p className="text-slate-600 dark:text-slate-300">Loading tournaments...</p> : null}
      {error ? <p className="mb-4 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <PublicCard key={tournament._id || tournament.id}>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{tournament.name}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              {(tournament.sport || 'N/A')}
            </p>
            <p className="mt-3 text-sm text-primary-600 dark:text-primary-300">Status: {tournament.status || 'upcoming'}</p>
            <Link to={`/tournaments/${tournament._id || tournament.id}`} className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
              View Details
            </Link>
          </PublicCard>
        ))}
      </div>
      {!loading && tournaments.length === 0 ? (
        <p className="mt-6 text-slate-600 dark:text-slate-300">
          {user?.role === 'player' ? 'No tournaments found for this player' : 'No tournaments found.'}
        </p>
      ) : null}
    </PublicPageShell>
  )
}

export default Tournaments