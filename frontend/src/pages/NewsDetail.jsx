import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const NewsDetail = () => {
  return (
    <PublicPageShell title="Article Detail" subtitle="Deep dive coverage with context, stats, and tactical analysis.">
      <PublicCard>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Messi Scores Hat-trick in Thrilling Match</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6">Published 2 hours ago</p>
        <div className="prose max-w-none dark:prose-invert">
          <p className="mb-4 text-slate-700 dark:text-slate-300">
            Lionel Messi delivered an unforgettable performance as Inter Miami secured a dramatic victory with a hat-trick from the Argentine superstar.
          </p>
          <p className="mb-4 text-slate-700 dark:text-slate-300">
            The match saw Messi at his best, showcasing his incredible skill and vision throughout the game.
          </p>
          <p className="mb-4 text-slate-700 dark:text-slate-300">
            ArenaX analytics highlighted his key passes, shot conversion, and pressure resistance as top percentile indicators.
          </p>
        </div>
      </PublicCard>
    </PublicPageShell>
  )
}

export default NewsDetail