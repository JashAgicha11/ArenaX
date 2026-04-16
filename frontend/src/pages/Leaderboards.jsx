import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const leaders = [
  { rank: 1, name: 'Lionel Messi', points: 95 },
  { rank: 2, name: 'Cristiano Ronaldo', points: 92 },
  { rank: 3, name: 'Neymar', points: 89 },
  { rank: 4, name: 'Virat Kohli', points: 88 },
]

const Leaderboards = () => {
  return (
    <PublicPageShell title="Leaderboards" subtitle="Transparent rankings by form, contribution, and clutch-impact score.">
      <PublicCard>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Top Players</h2>
        <div className="mt-4 space-y-2">
          {leaders.map((player) => (
            <div key={player.rank} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800">
              <span className="font-medium text-slate-800 dark:text-slate-100">{player.rank}. {player.name}</span>
              <span className="text-sm font-semibold text-primary-600 dark:text-primary-300">{player.points} pts</span>
            </div>
          ))}
        </div>
      </PublicCard>
    </PublicPageShell>
  )
}

export default Leaderboards