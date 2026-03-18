const Leaderboards = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Leaderboards</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Top Players</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 border-b">
            <span>1. Lionel Messi</span>
            <span>95 pts</span>
          </div>
          <div className="flex justify-between items-center p-2 border-b">
            <span>2. Cristiano Ronaldo</span>
            <span>92 pts</span>
          </div>
          <div className="flex justify-between items-center p-2 border-b">
            <span>3. Neymar</span>
            <span>89 pts</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Leaderboards