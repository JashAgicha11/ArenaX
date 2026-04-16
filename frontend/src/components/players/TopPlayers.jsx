import { useState, useEffect } from 'react'

const TopPlayers = () => {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for top players
    const mockPlayers = [
      {
        id: 1,
        name: 'Lionel Messi',
        sport: 'Football',
        team: 'Inter Miami',
        rating: 95,
        image: '/api/placeholder/80/80'
      },
      {
        id: 2,
        name: 'Cristiano Ronaldo',
        sport: 'Football',
        team: 'Al Nassr',
        rating: 92,
        image: '/api/placeholder/80/80'
      },
      {
        id: 3,
        name: 'Stephen Curry',
        sport: 'Basketball',
        team: 'Golden State Warriors',
        rating: 98,
        image: '/api/placeholder/80/80'
      }
    ]

    setTimeout(() => {
      setPlayers(mockPlayers)
      setLoading(false)
    }, 1000)
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player.id} className="flex items-center space-x-4 p-4 border border-slate-200 dark:border-slate-800 rounded-lg hover:shadow-md transition-shadow bg-slate-50 dark:bg-slate-800">
            <img
              src={player.image}
              alt={player.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-slate-900 dark:text-white">{player.name}</h3>
              <p className="text-slate-600 dark:text-slate-300">{player.sport} - {player.team}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-slate-500 dark:text-slate-400">Rating:</span>
                <span className="font-bold text-primary-600 dark:text-primary-300">{player.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopPlayers