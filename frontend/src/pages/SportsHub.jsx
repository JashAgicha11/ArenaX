import { Link, useParams } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'

const sportData = [
  { key: 'football', title: 'Football', desc: 'Premier League, Champions League, and global club competition.', color: 'from-sky-500 to-blue-600' },
  { key: 'basketball', title: 'Basketball', desc: 'NBA, college tournaments, and international circuits.', color: 'from-fuchsia-500 to-violet-600' },
  { key: 'tennis', title: 'Tennis', desc: 'Grand Slams, ATP/WTA tours, and player analytics.', color: 'from-amber-400 to-orange-500' },
  { key: 'cricket', title: 'Cricket', desc: 'IPL, ICC events, and domestic league scoreboards.', color: 'from-orange-500 to-red-500' },
  { key: 'badminton', title: 'Badminton', desc: 'BWF tours and regional competition tracking.', color: 'from-emerald-500 to-green-600' },
  { key: 'volleyball', title: 'Volleyball', desc: 'Indoor and beach tournament management suite.', color: 'from-rose-500 to-red-600' },
]

const SportsHub = () => {
  const { sportKey } = useParams()
  const activeSport = sportData.find((sport) => sport.key === sportKey)

  return (
    <PublicPageShell
      title={activeSport ? `${activeSport.title} Hub` : 'Sports Hub'}
      subtitle="Discover live scores, top players, and upcoming tournaments across every sport ecosystem."
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {sportData.map((sport) => (
          <PublicCard key={sport.key}>
            <div className={`mb-4 h-2 w-16 rounded-full bg-gradient-to-r ${sport.color}`} />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{sport.title}</h2>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{sport.desc}</p>
            <Link to={`/sports/${sport.key}`} className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
              Explore {sport.title}
            </Link>
          </PublicCard>
        ))}
      </div>
    </PublicPageShell>
  )
}

export default SportsHub
