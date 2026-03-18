import { useState, useEffect } from 'react'

const TrendingTournaments = () => {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data for now
    const mockTournaments = [
      {
        id: 1,
        name: 'Premier League Championship',
        sport: 'Football',
        participants: 20,
        status: 'ongoing',
        prize: '$50,000'
      },
      {
        id: 2,
        name: 'NBA Finals',
        sport: 'Basketball',
        participants: 2,
        status: 'upcoming',
        prize: '$100,000'
      },
      {
        id: 3,
        name: 'Wimbledon Open',
        sport: 'Tennis',
        participants: 128,
        status: 'ongoing',
        prize: '$200,000'
      }
    ]

    setTimeout(() => {
      setTournaments(mockTournaments)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Trending Tournaments</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="bg-gray-50 rounded-lg p-4 hover:shadow-lg transition-shadow">
            <h3 className="font-semibold text-lg mb-2">{tournament.name}</h3>
            <p className="text-gray-600 mb-1">Sport: {tournament.sport}</p>
            <p className="text-gray-600 mb-1">Participants: {tournament.participants}</p>
            <p className="text-gray-600 mb-3">Prize: {tournament.prize}</p>
            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
              tournament.status === 'ongoing' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {tournament.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TrendingTournaments