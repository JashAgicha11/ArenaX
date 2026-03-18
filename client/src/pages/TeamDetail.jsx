const TeamDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <img src="/api/placeholder/100/100" alt="Team" className="w-24 h-24 mr-6" />
          <div>
            <h1 className="text-3xl font-bold">Manchester United</h1>
            <p className="text-gray-600">Football Club</p>
            <p className="text-sm">Founded: 1878</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">20</div>
            <div className="text-sm text-gray-600">Titles Won</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">25</div>
            <div className="text-sm text-gray-600">Players</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">3rd</div>
            <div className="text-sm text-gray-600">Current Position</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TeamDetail