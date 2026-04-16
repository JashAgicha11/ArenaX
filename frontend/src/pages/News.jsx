import { Link } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const updates = [
  { id: 1, title: 'Messi Scores Hat-trick', summary: 'Lionel Messi led Inter Miami to victory with an incredible performance.', published: '2 hours ago' },
  { id: 2, title: 'NBA Finals Schedule Released', summary: 'A high-stakes finals matchup is now officially confirmed for next month.', published: '4 hours ago' },
  { id: 3, title: 'Wimbledon Announces Rule Updates', summary: 'Organizers introduced timing and format adjustments for this season.', published: '6 hours ago' },
]

const News = () => {
  return (
    <PublicPageShell title="Sports News" subtitle="Curated headlines, tactical stories, and ecosystem updates in one stream.">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {updates.map((news) => (
          <PublicCard key={news.id}>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{news.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{news.summary}</p>
            <p className="mt-3 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{news.published}</p>
            <Link to={`/news/${news.id}`} className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
              Read Story
            </Link>
          </PublicCard>
        ))}
      </div>
    </PublicPageShell>
  )
}

export default News