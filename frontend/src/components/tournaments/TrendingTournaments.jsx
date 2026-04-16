import { useState, useEffect } from 'react'

const TrendingTournaments = () => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now
    const mockTournaments = [
      {
        id: 1,
        name: 'Premier League Championship',
        sport: 'Football',
        participants: 20,
        status: 'ongoing',
        prize: '$50,000'
      },
      {
        id: 2,
        name: 'NBA Finals',
        sport: 'Basketball',
        participants: 2,
        status: 'upcoming',
        prize: '$100,000'
      },
      {
        id: 3,
        name: 'Wimbledon Open',
        sport: 'Tennis',
        participants: 128,
        status: 'ongoing',
        prize: '$200,000'
      }
    ]

    setTimeout(() => {
      setTournaments(mockTournaments)
      setLoading(false)
    }, 1000)
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4 transition-shadow hover:shadow-lg dark:border-slate-800 dark:bg-slate-800">
            <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">{tournament.name}</h3>
            <p className="mb-1 text-slate-600 dark:text-slate-300">Sport: {tournament.sport}</p>
            <p className="mb-1 text-slate-600 dark:text-slate-300">Participants: {tournament.participants}</p>
            <p className="mb-3 text-slate-600 dark:text-slate-300">Prize: {tournament.prize}</p>
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
    </div>
  )
}

export default TrendingTournaments