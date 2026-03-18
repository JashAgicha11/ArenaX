const MatchDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Match Details</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="text-center">
              <img src="/api/placeholder/80/80" alt="Team A" className="w-20 h-20 mx-auto mb-2" />
              <p className="font-bold text-xl">Manchester United</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">2 - 1</div>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">LIVE</span>
            </div>
            <div className="text-center">
              <img src="/api/placeholder/80/80" alt="Team B" className="w-20 h-20 mx-auto mb-2" />
              <p className="font-bold text-xl">Liverpool</p>
            </div>
          </div>
          <p className="text-gray-600">Premier League - Round 15</p>
          <p className="text-sm text-gray-500">67' - Second Half</p>
        </div>
        
        <div className="border-t pt-6">
          <h2 className="text-xl font-semibold mb-4">Match Events</h2>
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">23'</span>
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">GOAL</span>
              <span>Ronaldo scores for Manchester United</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">45'</span>
              <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">YELLOW</span>
              <span>Foul by Salah</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MatchDetail