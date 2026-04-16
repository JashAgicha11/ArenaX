import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const TeamDetail = () => {
  return (
    <PublicPageShell title="Team Profile" subtitle="Season trajectory, roster depth, and competitive achievements.">
      <PublicCard>
        <div className="mb-6 flex items-center">
          <div className="mr-6 h-24 w-24 rounded-2xl bg-gradient-to-br from-primary-500 to-violet-500" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Manchester United</h1>
            <p className="text-slate-600 dark:text-slate-400">Football Club</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">Founded: 1878</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">20</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Titles Won</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">25</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Players</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">3rd</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Current Position</div>
          </div>
        </div>
      </PublicCard>
    </PublicPageShell>
  )
}

export default TeamDetail