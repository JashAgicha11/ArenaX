const Tournaments = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tournaments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Premier League</h2>
          <p className="text-gray-600 mb-4">Football tournament with 20 teams</p>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Status: Ongoing</span>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tournaments