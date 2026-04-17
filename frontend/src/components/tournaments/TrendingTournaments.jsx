import { useState, useEffect } from 'react'
import { tournamentService } from '@services/tournamentService'

const TrendingTournaments = () => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadTournaments = async () => {
      try {
        setLoading(true)
        setError('')
        const data = await tournamentService.getTournaments()
        setTournaments((data.tournaments || []).slice(0, 3))
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load tournaments.')
        setTournaments([])
      } finally {
        setLoading(false)
      }
    }

    loadTournaments()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-2 h-4 w-3/4 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mb-4 h-3 w-1/2 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-8 w-full rounded bg-slate-200 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Trending Tournaments</h2>
      {error ? <p className="mb-4 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament._id || tournament.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-800">
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{tournament.name}</h3>
            <p className="mb-1 text-slate-600 dark:text-slate-300">Sport: {tournament.sport}</p>
            <p className="mb-1 text-slate-600 dark:text-slate-300">Teams: {(tournament.teams || []).length}</p>
            <p className="mb-3 text-slate-600 dark:text-slate-300">Matches: {(tournament.matches || []).length}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              tournament.status === 'ongoing' 
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' 
                : 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300'
            }`}>
              {tournament.status}
            </span>
          </div>
        ))}
      </div>
      {!loading && !tournaments.length && !error ? <p className="mt-4 text-slate-600 dark:text-slate-300">No tournaments found.</p> : null}
    </div>
  )
}

export default TrendingTournaments