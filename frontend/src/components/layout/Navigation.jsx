import { Link, useLocation } from 'react-router-dom'
import { publicNavItems } from '../../config/navigation'

const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`rounded-md px-3 py-3 text-sm font-medium transition-colors ${
                  location.pathname === item.path || location.pathname.startsWith(`${item.path}/`)
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-500/15 dark:text-primary-300'
                    : 'text-slate-600 hover:text-primary-700 dark:text-slate-300 dark:hover:text-primary-300'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navigation