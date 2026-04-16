import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const PlayerDetail = () => {
  return (
    <PublicPageShell title="Player Profile" subtitle="Performance summary, contribution metrics, and current form.">
      <PublicCard>
        <div className="mb-6 flex flex-col items-center md:flex-row">
          <div className="mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 md:mb-0 md:mr-6" />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Lionel Messi</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2">Football - Forward</p>
            <p className="text-lg text-slate-800 dark:text-slate-200">Inter Miami CF</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">95</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Overall Rating</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">750</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Goals</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">350</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Assists</div>
          </div>
        </div>
      </PublicCard>
    </PublicPageShell>
  )
}

export default PlayerDetail