const ScorerConsole = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Scorer Console</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Match</h2>
            <div className="text-center">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="font-semibold">Team A</p>
                  <p className="text-2xl font-bold">2</p>
                </div>
                <div className="text-sm text-gray-500">vs</div>
                <div>
                  <p className="font-semibold">Team B</p>
                  <p className="text-2xl font-bold">1</p>
                </div>
              </div>
              <div className="space-x-2">
                <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Goal Team A
                </button>
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Goal Team B
                </button>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-4">Match Events</h2>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">23'</span>
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">GOAL</span>
                <span>Player scored for Team A</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ScorerConsole