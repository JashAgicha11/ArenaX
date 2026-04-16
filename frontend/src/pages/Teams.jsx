import { Link } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const teams = [
  { id: 1, name: 'Manchester United', sport: 'Football', founded: 1878 },
  { id: 2, name: 'Golden State Warriors', sport: 'Basketball', founded: 1946 },
  { id: 3, name: 'Mumbai Indians', sport: 'Cricket', founded: 2008 },
]

const Teams = () => {
  return (
    <PublicPageShell title="Teams" subtitle="Analyze roster power, league position, and title momentum by club.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <PublicCard key={team.id} className="text-center">
            <div className="mx-auto mb-4 h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{team.name}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{team.sport}</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Founded: {team.founded}</p>
            <Link to={`/teams/${team.id}`} className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
              Team Details
            </Link>
          </PublicCard>
        ))}
      </div>
    </PublicPageShell>
  )
}

export default Teams