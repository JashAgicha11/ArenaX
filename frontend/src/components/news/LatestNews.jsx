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
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-slate-200 dark:bg-slate-700 rounded mb-4"></div>
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Latest News</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-shadow bg-slate-50 dark:bg-slate-800">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-32 object-cover"
            />
            <div className="p-4">
              <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
              <p className="mb-2 line-clamp-3 text-sm text-slate-600 dark:text-slate-300">{item.summary}</p>
              <span className="text-xs text-slate-500 dark:text-slate-400">{item.publishedAt}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default LatestNews