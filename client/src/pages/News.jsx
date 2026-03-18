const News = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Sports News</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Messi Scores Hat-trick</h2>
          <p className="text-gray-600 mb-4">Lionel Messi led Inter Miami to victory with an incredible hat-trick performance.</p>
          <span className="text-sm text-gray-500">2 hours ago</span>
        </div>
      </div>
    </div>
  )
}

export default News