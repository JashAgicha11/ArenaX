import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const MatchDetail = () => {
  return (
    <PublicPageShell title="Match Details" subtitle="Full event timeline, game state, and momentum snapshot.">
      <PublicCard>
        <div className="text-center">
          <p className="text-sm text-primary-600 dark:text-primary-300">Premier League - Round 15</p>
          <h2 className="mt-1 text-3xl font-bold text-slate-900 dark:text-white">Manchester United 2 - 1 Liverpool</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">67' - Second Half</p>
        </div>
        <div className="mt-6 grid gap-3">
          {[
            "23' GOAL - Ronaldo scores for Manchester United",
            "45' YELLOW - Foul by Salah",
            "58' SUB - Rashford replaces Antony",
            "64' GOAL - Nunez scores for Liverpool",
          ].map((event) => (
            <div key={event} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
              {event}
            </div>
          ))}
        </div>
      </PublicCard>
    </PublicPageShell>
  )
}

export default MatchDetail