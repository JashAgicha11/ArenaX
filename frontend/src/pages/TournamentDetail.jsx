import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const TournamentDetail = () => {
  return (
    <PublicPageShell title="Tournament Details" subtitle="Track standings, prize pool progress, and matchday outcomes.">
      <PublicCard>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Premier League 2026</h2>
        <p className="mt-1 text-slate-600 dark:text-slate-400">Professional football league in England</p>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Tournament Info</h3>
            <ul className="mt-3 space-y-1 text-sm text-slate-700 dark:text-slate-300">
              <li><strong>Sport:</strong> Football</li>
              <li><strong>Teams:</strong> 20</li>
              <li><strong>Status:</strong> Ongoing</li>
              <li><strong>Prize Pool:</strong> $100,000</li>
            </ul>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-white">Current Standings</h3>
            <div className="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <div className="flex justify-between rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                <span>1. Manchester City</span>
                <span>45 pts</span>
              </div>
              <div className="flex justify-between rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                <span>2. Arsenal</span>
                <span>42 pts</span>
              </div>
              <div className="flex justify-between rounded-lg bg-white px-3 py-2 dark:bg-slate-900">
                <span>3. Liverpool</span>
                <span>40 pts</span>
              </div>
            </div>
          </div>
        </div>
      </PublicCard>
    </PublicPageShell>
  )
}

export default TournamentDetail