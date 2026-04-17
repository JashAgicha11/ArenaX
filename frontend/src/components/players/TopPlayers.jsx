import { useState, useEffect } from 'react'
import { playerService } from '@services/playerService'

const TopPlayers = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true)
        const data = await playerService.getPlayers()
        setPlayers((data.players || []).slice(0, 3))
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load players.')
      } finally {
        setLoading(false)
      }
    }

    loadPlayers()
  }, [])

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Top Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Top Players</h2>
      {error ? <p className="mb-4 text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player._id} className="flex items-center space-x-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-800">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary-500 to-violet-500" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{player.displayName}</h3>
              <p className="text-slate-600 dark:text-slate-300">Player ID: {player.playerId}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-slate-500 dark:text-slate-400">Matches:</span>
                <span className="font-bold text-primary-600 dark:text-primary-300">{player.stats?.matches || 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopPlayers