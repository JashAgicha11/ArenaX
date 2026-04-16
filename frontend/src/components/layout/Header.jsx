import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Menu, X, User, LogOut, Trophy, Sun, Moon } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'
import toast from 'react-hot-toast'
import { publicNavItems, userMenuItems } from '../../config/navigation'
import { useTheme } from '@contexts/ThemeContext'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const headerRef = useRef(null)

  useEffect(() => {
    // GSAP animations for header
    const ctx = gsap.context(() => {
      // Header entrance animation
      gsap.fromTo(headerRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }
      )

      // Logo animation
      gsap.fromTo('.logo', 
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.6, delay: 0.2, ease: 'back.out(1.7)' }
      )
    }, headerRef)

    return () => ctx.revert()
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      setIsUserMenuOpen(false)
      toast.success('Logged out successfully')
    } catch (error) {
      toast.error('Logout failed')
    }
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    // Animate menu toggle
    if (!isMenuOpen) {
      gsap.fromTo('.mobile-menu', 
        { opacity: 0, x: -300 },
        { opacity: 1, x: 0, duration: 0.3, ease: 'power2.out' }
      )
    } else {
      gsap.to('.mobile-menu', {
        opacity: 0,
        x: -300,
        duration: 0.3,
        ease: 'power2.in'
      })
    }
  }

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen)
    if (!isUserMenuOpen) {
      gsap.fromTo('.user-menu', 
        { opacity: 0, y: -10, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.2, ease: 'power2.out' }
      )
    }
  }

  return (
    <header ref={headerRef} className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/85 shadow-soft backdrop-blur dark:border-slate-800 dark:bg-slate-950/85">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="logo flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-500 to-violet-400 bg-clip-text text-transparent">
              ArenaX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {publicNavItems.slice(1, 5).map((item) => (
              <Link key={item.path} to={item.path} className="text-slate-700 hover:text-primary-600 transition-colors duration-200 dark:text-slate-200 dark:hover:text-primary-300">
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Menu / Auth */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="rounded-xl border border-slate-300 p-2 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-slate-700 hover:text-primary-600 transition-colors duration-200 dark:text-slate-200 dark:hover:text-primary-300"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center dark:bg-primary-500/20">
                    <User className="w-4 h-4 text-primary-600 dark:text-primary-300" />
                  </div>
                  <span className="hidden sm:block font-medium">{user?.name}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="user-menu absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white py-2 shadow-large dark:border-slate-700 dark:bg-slate-900 z-50">
                    {userMenuItems
                      .filter((item) => item.roles.includes(user?.role) || user?.role === 'admin')
                      .map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className="flex items-center px-4 py-2 text-slate-700 hover:bg-slate-100 transition-colors duration-200 dark:text-slate-200 dark:hover:bg-slate-800"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-slate-700 hover:bg-slate-100 transition-colors duration-200 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-slate-700 hover:text-primary-600 transition-colors duration-200 font-medium dark:text-slate-200 dark:hover:text-primary-300"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium dark:bg-primary-500 dark:hover:bg-primary-400"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors duration-200 dark:text-slate-100 dark:hover:bg-slate-800"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu md:hidden bg-white border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800">
          <div className="px-4 py-6 space-y-4">
            {publicNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="block text-slate-700 hover:text-primary-600 transition-colors duration-200 py-2 dark:text-slate-200 dark:hover:text-primary-300"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 