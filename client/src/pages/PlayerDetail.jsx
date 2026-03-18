const PlayerDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row items-center mb-6">
          <img src="/api/placeholder/150/150" alt="Player" className="w-32 h-32 rounded-full mb-4 md:mb-0 md:mr-6" />
          <div className="text-center md:text-left">
            <h1 className="text-3xl font-bold mb-2">Lionel Messi</h1>
            <p className="text-gray-600 mb-2">Football - Forward</p>
            <p className="text-lg">Inter Miami CF</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold">95</div>
            <div className="text-sm text-gray-600">Overall Rating</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">750</div>
            <div className="text-sm text-gray-600">Goals</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">350</div>
            <div className="text-sm text-gray-600">Assists</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlayerDetail