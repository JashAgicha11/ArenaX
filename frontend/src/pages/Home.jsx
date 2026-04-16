import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, Trophy, Users, TrendingUp, ArrowRight, Calendar } from 'lucide-react'
import LiveMatchesCarousel from '@components/matches/LiveMatchesCarousel'
import TrendingTournaments from '@components/tournaments/TrendingTournaments'
import TopPlayers from '@components/players/TopPlayers'
import LatestNews from '@components/news/LatestNews'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const Home = () => {
  const heroRef = useRef(null)
  const statsRef = useRef(null)
  const featuresRef = useRef(null)

  useEffect(() => {
    // GSAP animations
    const ctx = gsap.context(() => {
      // Hero section animations
      gsap.fromTo(heroRef.current, 
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out' }
      )

      // Animate hero elements with stagger
      gsap.fromTo('.hero-element', 
        { opacity: 0, y: 30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          stagger: 0.2, 
          ease: 'power2.out',
          delay: 0.3
        }
      )

      // Stats section animation
      ScrollTrigger.create({
        trigger: statsRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.stat-item', 
            { opacity: 0, y: 50, scale: 0.8 },
            { 
              opacity: 1, 
              y: 0, 
              scale: 1, 
              duration: 0.6, 
              stagger: 0.1, 
              ease: 'back.out(1.7)' 
            }
          )
        }
      })

      // Features section animation
      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: 'top 80%',
        onEnter: () => {
          gsap.fromTo('.feature-card', 
            { opacity: 0, y: 60 },
            { 
              opacity: 1, 
              y: 0, 
              duration: 0.8, 
              stagger: 0.15, 
              ease: 'power2.out' 
            }
          )
        }
      })
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const stats = [
    { icon: Trophy, value: '500+', label: 'Tournaments' },
    { icon: Users, value: '10K+', label: 'Players' },
    { icon: TrendingUp, value: '50+', label: 'Sports' },
    { icon: Calendar, value: '24/7', label: 'Live Updates' }
  ]

  const features = [
    {
      icon: Play,
      title: 'Live Scoring',
      description: 'Real-time updates with instant statistics and commentary',
      color: 'from-cricket-500 to-cricket-600'
    },
    {
      icon: Trophy,
      title: 'Tournaments',
      description: 'Organize and participate in various competition formats',
      color: 'from-football-500 to-football-600'
    },
    {
      icon: TrendingUp,
      title: 'Rankings',
      description: 'Dynamic leaderboards with transparent scoring algorithms',
      color: 'from-basketball-500 to-basketball-600'
    },
    {
      icon: Users,
      title: 'Team Management',
      description: 'Build teams, manage rosters, and track performance',
      color: 'from-badminton-500 to-badminton-600'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden bg-gradient-to-br from-slate-100 via-white to-indigo-50 py-20 lg:py-28 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-element text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
              ArenaX
              <span className="block bg-gradient-to-r from-primary-500 to-violet-500 bg-clip-text text-transparent">
                Neon Sports Intelligence
              </span>
            </h1>
            
            <p className="hero-element text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
              A premium, role-aware platform for live scoring, tournament orchestration, and multi-sport analytics at scale.
            </p>
            
            <div className="hero-element flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/matches"
                className="bg-primary-600 text-white px-8 py-4 rounded-2xl hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 shadow-large font-semibold text-lg flex items-center space-x-2 dark:bg-primary-500 dark:hover:bg-primary-400"
              >
                <Play className="w-5 h-5" />
                <span>Watch Live Matches</span>
              </Link>
              
              <Link
                to="/tournaments"
                className="bg-white/90 text-primary-700 px-8 py-4 rounded-2xl hover:bg-white transition-all duration-200 transform hover:scale-105 shadow-soft border border-primary-200 font-semibold text-lg flex items-center space-x-2 dark:bg-slate-900/90 dark:border-slate-700 dark:text-primary-300 dark:hover:bg-slate-800"
              >
                <Trophy className="w-5 h-5" />
                <span>Join Tournaments</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 h-36 w-36 rounded-full bg-primary-400/20 blur-3xl animate-bounce-soft" />
        <div className="absolute bottom-20 right-10 h-28 w-28 rounded-full bg-violet-400/20 blur-3xl animate-bounce-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-20 h-20 w-20 rounded-full bg-cyan-400/20 blur-3xl animate-bounce-soft" style={{ animationDelay: '2s' }} />
      </section>

      {/* Live Matches Section */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
              Live Matches
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Watch real-time scoring and updates from matches happening right now
            </p>
          </div>
          
          <LiveMatchesCarousel />
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-slate-100 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-100 dark:bg-primary-500/20">
                  <stat.icon className="w-8 h-8 text-primary-600 dark:text-primary-300" />
                </div>
                <div className="mb-2 text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-slate-600 dark:text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                Why Choose ArenaX?
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Comprehensive features designed for players, organizers, and fans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="feature-card rounded-2xl border border-slate-200 bg-white p-6 shadow-soft transition-all duration-200 transform hover:-translate-y-2 hover:shadow-medium dark:border-slate-800 dark:bg-slate-900">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Tournaments */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Trending Tournaments
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Join the most popular competitions across all sports
              </p>
            </div>
            <Link
              to="/tournaments"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200 font-medium transition-colors duration-200"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <TrendingTournaments />
        </div>
      </section>

      {/* Top Players */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Top Players
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Leading athletes across all sports and categories
              </p>
            </div>
            <Link
              to="/leaderboards"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200 font-medium transition-colors duration-200"
            >
              <span>View Rankings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <TopPlayers />
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-slate-100 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
                Latest News
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Stay updated with the latest sports news and updates
              </p>
            </div>
            <Link
              to="/news"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 dark:text-primary-300 dark:hover:text-primary-200 font-medium transition-colors duration-200"
            >
              <span>Read More</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <LatestNews />
        </div>
      </section>
    </div>
  )
}

export default Home 