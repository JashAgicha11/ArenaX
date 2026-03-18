const SportsHub = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sports Hub</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Football</h2>
          <p className="text-gray-600 mb-4">Premier League, Champions League, and more</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Explore Football
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Basketball</h2>
          <p className="text-gray-600 mb-4">NBA, College Basketball, and international leagues</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Explore Basketball
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Tennis</h2>
          <p className="text-gray-600 mb-4">Grand Slams, ATP, WTA tournaments</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Explore Tennis
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Cricket</h2>
          <p className="text-gray-600 mb-4">IPL, World Cup, and international cricket</p>
          <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Explore Cricket
          </button>
        </div>
      </div>
    </div>
  )
}

export default SportsHub
