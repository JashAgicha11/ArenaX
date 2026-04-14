const Players = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Players</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <img src="/api/placeholder/100/100" alt="Player" className="w-24 h-24 rounded-full mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-center mb-2">Lionel Messi</h2>
          <p className="text-gray-600 text-center mb-2">Football - Forward</p>
          <p className="text-center text-sm">Rating: 95</p>
        </div>
      </div>
    </div>
  )
}

export default Players