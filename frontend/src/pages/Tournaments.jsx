import { Link } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const tournaments = [
  { id: 1, name: 'Premier League', sport: 'Football', teams: 20, status: 'Ongoing' },
  { id: 2, name: 'Wimbledon Open', sport: 'Tennis', teams: 128, status: 'Upcoming' },
  { id: 3, name: 'Champions Trophy', sport: 'Cricket', teams: 8, status: 'Registrations Open' },
]

const Tournaments = () => {
  return (
    <PublicPageShell title="Tournaments" subtitle="Compete in pro-grade events with bracket intelligence and live progression insights.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tournaments.map((tournament) => (
          <PublicCard key={tournament.id}>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{tournament.name}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{tournament.sport} - {tournament.teams} teams</p>
            <p className="mt-3 text-sm text-primary-600 dark:text-primary-300">Status: {tournament.status}</p>
            <Link to={`/tournaments/${tournament.id}`} className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
              View Details
            </Link>
          </PublicCard>
        ))}
      </div>
    </PublicPageShell>
  )
}

export default Tournaments