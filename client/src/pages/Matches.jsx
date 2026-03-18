const Matches = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Live Matches</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">Football</span>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">LIVE</span>
          </div>
          <div className="text-center">
            <div className="flex justify-between items-center mb-4">
              <div className="text-center">
                <img src="/api/placeholder/50/50" alt="Team A" className="w-12 h-12 mx-auto mb-2" />
                <p className="font-semibold">Team A</p>
              </div>
              <div className="text-2xl font-bold">2 - 1</div>
              <div className="text-center">
                <img src="/api/placeholder/50/50" alt="Team B" className="w-12 h-12 mx-auto mb-2" />
                <p className="font-semibold">Team B</p>
              </div>
            </div>
            <p className="text-sm text-gray-600">45' - Second Half</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Matches