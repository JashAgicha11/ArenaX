const TournamentDetail = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tournament Details</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Premier League 2024</h2>
        <p className="text-gray-600 mb-6">Professional football league in England</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Tournament Info</h3>
            <ul className="space-y-1 text-sm">
              <li><strong>Sport:</strong> Football</li>
              <li><strong>Teams:</strong> 20</li>
              <li><strong>Status:</strong> Ongoing</li>
              <li><strong>Prize Pool:</strong> $100,000</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Current Standings</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>1. Manchester City</span>
                <span>45 pts</span>
              </div>
              <div className="flex justify-between">
                <span>2. Arsenal</span>
                <span>42 pts</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TournamentDetail