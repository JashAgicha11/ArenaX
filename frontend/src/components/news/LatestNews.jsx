import { useState, useEffect } from 'react'

const LatestNews = () => {
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock news data
    const mockNews = [
      {
        id: 1,
        title: 'Messi Leads Inter Miami to Victory',
        summary: 'Lionel Messi scored a hat-trick as Inter Miami defeated their rivals 3-1.',
        publishedAt: '2 hours ago',
        image: '/api/placeholder/200/150'
      },
      {
        id: 2,
        title: 'NBA Finals Date Announced',
        summary: 'The NBA Finals will begin on June 1st with a blockbuster matchup.',
        publishedAt: '4 hours ago',
        image: '/api/placeholder/200/150'
      },
      {
        id: 3,
        title: 'Tennis Grand Slam Update',
        summary: 'Wimbledon organizers announce new safety measures for this year\'s tournament.',
        publishedAt: '6 hours ago',
        image: '/api/placeholder/200/150'
      }
    ]

    setTimeout(() => {
      setNews(mockNews)
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-2 line-clamp-3">{item.summary}</p>
              <span className="text-xs text-gray-500">{item.publishedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LatestNews