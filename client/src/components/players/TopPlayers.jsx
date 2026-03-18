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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Players</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Top Players</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {players.map((player) => (
          <div key={player.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
            <img
              src={player.image}
              alt={player.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{player.name}</h3>
              <p className="text-gray-600">{player.sport} - {player.team}</p>
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-sm text-gray-500">Rating:</span>
                <span className="font-bold text-blue-600">{player.rating}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TopPlayers