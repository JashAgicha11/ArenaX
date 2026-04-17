import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'
import { playerService } from '@services/playerService'

const Players = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true)
        const data = await playerService.getPlayers()
        setPlayers(data.players || [])
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load players.')
        setPlayers([])
      } finally {
        setLoading(false)
      }
    }

    loadPlayers()
  }, [])

  return (
    <PublicPageShell title="Players" subtitle="Explore elite player profiles with sport-specific ratings and live performance context.">
      {loading ? <p className="text-slate-600 dark:text-slate-300">Loading players...</p> : null}
      {error ? <p className="mb-4 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {players.map((player) => (
          <PublicCard key={player._id} className="text-center">
            <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-primary-500 to-violet-500" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{player.displayName}</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Player ID: {player.playerId}</p>
            <p className="mt-2 text-sm font-semibold text-primary-600 dark:text-primary-300">Teams: {(player.teams || []).length}</p>
            <Link to={`/players/${player._id}`} className="mt-4 inline-flex rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700 dark:bg-primary-500 dark:hover:bg-primary-400">
              View Profile
            </Link>
          </PublicCard>
        ))}
      </div>
      {!loading && !players.length && !error ? <p className="mt-6 text-slate-600 dark:text-slate-300">No players found.</p> : null}
    </PublicPageShell>
  )
}

export default Players