import { Link } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const players = [
  { id: 1, name: 'Lionel Messi', sport: 'Football', role: 'Forward', rating: 95 },
  { id: 2, name: 'Novak Djokovic', sport: 'Tennis', role: 'Singles', rating: 96 },
  { id: 3, name: 'Virat Kohli', sport: 'Cricket', role: 'Batter', rating: 93 },
]

const Players = () => {
  return (
    <PublicPageShell title="Players" subtitle="Explore elite player profiles with sport-specific ratings and live performance context.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <PublicCard key={player.id} className="text-center">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-violet-500" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{player.name}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{player.sport} - {player.role}</p>
            <p className="mt-2 text-sm font-semibold text-primary-600 dark:text-primary-300">Rating: {player.rating}</p>
            <Link to={`/players/${player.id}`} className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
              View Profile
            </Link>
          </PublicCard>
        ))}
      </div>
    </PublicPageShell>
  )
}

export default Players