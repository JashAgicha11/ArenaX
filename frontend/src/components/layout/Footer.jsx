import { Link } from 'react-router-dom'

const quickLinks = [
  { path: '/', label: 'Home' },
  { path: '/matches', label: 'Matches' },
  { path: '/tournaments', label: 'Tournaments' },
  { path: '/leaderboards', label: 'Leaderboards' },
]

const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 bg-white/90 py-10 dark:border-slate-800 dark:bg-slate-950/90">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">ArenaX</h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              Premium multi-sport platform for matches, tournaments, rankings, and real-time insights.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map((item) => (
                <li key={item.path}>
                  <Link to={item.path} className="text-slate-600 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-4">Sports</h4>
            <ul className="space-y-2">
              <li className="text-slate-600 dark:text-slate-400">Football</li>
              <li className="text-slate-600 dark:text-slate-400">Basketball</li>
              <li className="text-slate-600 dark:text-slate-400">Tennis</li>
              <li className="text-slate-600 dark:text-slate-400">Cricket</li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold text-slate-900 dark:text-white mb-4">Contact</h4>
            <ul className="space-y-2">
              <li className="text-slate-600 dark:text-slate-400">Email: hello@arenax.app</li>
              <li className="text-slate-600 dark:text-slate-400">Phone: +1 (555) 123-4567</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-slate-200 pt-8 text-center dark:border-slate-800">
          <p className="text-slate-500 dark:text-slate-400">
            &copy; 2026 ArenaX. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer