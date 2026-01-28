import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { Menu, X, User, LogOut, Settings, Trophy, Users, Calendar } from 'lucide-react'
import { useAuth } from '@contexts/AuthContext'
import toast from 'react-hot-toast'

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const headerRef = useRef(null)
  const navigate = useNavigate()

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
    <header ref={headerRef} className="bg-white shadow-soft border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="logo flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              MultiSport
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/matches" className="text-neutral-700 hover:text-primary-600 transition-colors duration-200">
              Matches
            </Link>
            <Link to="/tournaments" className="text-neutral-700 hover:text-primary-600 transition-colors duration-200">
              Tournaments
            </Link>
            <Link to="/leaderboards" className="text-neutral-700 hover:text-primary-600 transition-colors duration-200">
              Leaderboards
            </Link>
            <Link to="/news" className="text-neutral-700 hover:text-primary-600 transition-colors duration-200">
              News
            </Link>
          </nav>

          {/* User Menu / Auth */}
          <div className="flex items-center space-x-4">
            {isAuthenticated() ? (
              <div className="relative">
                <button
                  onClick={toggleUserMenu}
                  className="flex items-center space-x-2 text-neutral-700 hover:text-primary-600 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="hidden sm:block font-medium">{user?.name}</span>
                </button>

                {/* User Dropdown Menu */}
                {isUserMenuOpen && (
                  <div className="user-menu absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-large border border-neutral-200 py-2 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Dashboard
                    </Link>
                    
                    {user?.role === 'scorer' && (
                      <Link
                        to="/scorer"
                        className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Users className="w-4 h-4 mr-3" />
                        Scorer Console
                      </Link>
                    )}
                    
                    {user?.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Trophy className="w-4 h-4 mr-3" />
                        Admin Panel
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
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
                  className="text-neutral-700 hover:text-primary-600 transition-colors duration-200 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors duration-200 font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg text-neutral-700 hover:bg-neutral-100 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu md:hidden bg-white border-t border-neutral-200">
          <div className="px-4 py-6 space-y-4">
            <Link
              to="/matches"
              className="block text-neutral-700 hover:text-primary-600 transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Matches
            </Link>
            <Link
              to="/tournaments"
              className="block text-neutral-700 hover:text-primary-600 transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Tournaments
            </Link>
            <Link
              to="/leaderboards"
              className="block text-neutral-700 hover:text-primary-600 transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Leaderboards
            </Link>
            <Link
              to="/news"
              className="block text-neutral-700 hover:text-primary-600 transition-colors duration-200 py-2"
              onClick={() => setIsMenuOpen(false)}
            />
          </div>
        </div>
      )}
    </header>
  )
}

export default Header 