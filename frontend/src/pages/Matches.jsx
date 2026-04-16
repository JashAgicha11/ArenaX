import { Link } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const matches = [
  { id: '1', sport: 'Football', status: 'Live', time: "67'", teams: ['Manchester United', 'Liverpool'], score: '2 - 1' },
  { id: '2', sport: 'Cricket', status: 'Live', time: '18.2 overs', teams: ['Mumbai Indians', 'CSK'], score: '156/4 - 142/6' },
  { id: '3', sport: 'Basketball', status: 'Upcoming', time: 'Today 20:00', teams: ['Lakers', 'Warriors'], score: 'Preview' },
]

const Matches = () => {
  return (
    <PublicPageShell title="Live Matches" subtitle="Follow high-intensity fixtures with real-time match states and event feeds.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <PublicCard key={match.id}>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm text-slate-500 dark:text-slate-400">{match.sport}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${match.status === 'Live' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' : 'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300'}`}>
                {match.status}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{match.teams[0]} vs {match.teams[1]}</h2>
            <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{match.score}</p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{match.time}</p>
            <Link to={`/matches/${match.id}`} className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
              Open Match
            </Link>
          </PublicCard>
        ))}
      </div>
    </PublicPageShell>
  )
}

export default Matches