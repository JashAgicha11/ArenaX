const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">My Stats</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Matches Watched:</span>
              <span className="font-bold">42</span>
            </div>
            <div className="flex justify-between">
              <span>Favorite Sport:</span>
              <span className="font-bold">Football</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-2 text-sm">
            <p>Watched Manchester United vs Liverpool</p>
            <p>Followed Barcelona FC</p>
            <p>Joined Premier League predictions</p>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Notifications</h2>
          <div className="space-y-2 text-sm">
            <p>New match starting in 30 minutes</p>
            <p>Tournament bracket updated</p>
            <p>Player transfer news</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard