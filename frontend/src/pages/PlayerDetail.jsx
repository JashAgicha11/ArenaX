import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PublicCard, PublicPageShell } from '@components/ui/PublicPageShell'
import { playerService } from '@services/playerService'

const PlayerDetail = () => {
  const { playerId } = useParams()
  const [player, setPlayer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPlayer = async () => {
      try {
        setLoading(true)
        const data = await playerService.getPlayerById(playerId)
        setPlayer(data.player)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load player details')
      } finally {
        setLoading(false)
      }
    }
    if (playerId) loadPlayer()
  }, [playerId])

  return (
    <PublicPageShell title="Player Profile" subtitle="Performance summary, contribution metrics, and current form.">
      <PublicCard>
        {loading ? <p className="text-slate-600 dark:text-slate-300">Loading player profile...</p> : null}
        {error ? <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p> : null}
        {!loading && !error && !player ? <p className="text-slate-600 dark:text-slate-300">Player not found.</p> : null}
        {player ? (
          <>
        <div className="mb-6 flex flex-col items-center md:flex-row">
          <div className="mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-primary-500 to-violet-500 md:mb-0 md:mr-6" />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{player.displayName}</h1>
            <p className="text-slate-600 dark:text-slate-400 mb-2">Player ID: {player.playerId}</p>
            <p className="text-lg text-slate-800 dark:text-slate-200">{player.userId?.email || 'Player account'}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{player.stats?.matches || 0}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Matches</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{player.stats?.wins || 0}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Wins</div>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-800 dark:bg-slate-800">
            <div className="text-2xl font-bold text-slate-900 dark:text-white">{(player.teams || []).length}</div>
            <div className="text-sm text-slate-600 dark:text-slate-400">Teams</div>
          </div>
        </div>
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Teams</h3>
          <div className="space-y-2">
            {(player.teams || []).map((team) => (
              <div key={team._id} className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-200">
                {team.name} - {team.sport} ({team.tournamentId?.name || 'No tournament'})
              </div>
            ))}
            {!(player.teams || []).length ? <p className="text-sm text-slate-600 dark:text-slate-300">No teams assigned.</p> : null}
          </div>
        </div>
          </>
        ) : null}
      </PublicCard>
    </PublicPageShell>
  )
}

export default PlayerDetail