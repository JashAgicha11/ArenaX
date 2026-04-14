import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, Trophy, Users, TrendingUp, ArrowRight, Calendar, MapPin } from 'lucide-react'
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
      <section ref={heroRef} className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-20 lg:py-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="hero-element text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-900 mb-6">
              Multi-Sport
              <span className="block bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                Excellence
              </span>
            </h1>
            
            <p className="hero-element text-xl md:text-2xl text-neutral-600 mb-8 max-w-3xl mx-auto">
              The ultimate platform for live scoring, tournaments, and rankings across multiple sports. 
              Experience real-time updates and comprehensive statistics.
            </p>
            
            <div className="hero-element flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/matches"
                className="bg-primary-600 text-white px-8 py-4 rounded-2xl hover:bg-primary-700 transition-all duration-200 transform hover:scale-105 shadow-large font-semibold text-lg flex items-center space-x-2"
              >
                <Play className="w-5 h-5" />
                <span>Watch Live Matches</span>
              </Link>
              
              <Link
                to="/tournaments"
                className="bg-white text-primary-600 px-8 py-4 rounded-2xl hover:bg-primary-50 transition-all duration-200 transform hover:scale-105 shadow-soft border border-primary-200 font-semibold text-lg flex items-center space-x-2"
              >
                <Trophy className="w-5 h-5" />
                <span>Join Tournaments</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Background Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-cricket-200 rounded-full opacity-20 animate-bounce-soft"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-football-200 rounded-full opacity-20 animate-bounce-soft" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-20 w-16 h-16 bg-basketball-200 rounded-full opacity-20 animate-bounce-soft" style={{ animationDelay: '2s' }}></div>
      </section>

      {/* Live Matches Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Live Matches
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Watch real-time scoring and updates from matches happening right now
            </p>
          </div>
          
          <LiveMatchesCarousel />
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-neutral-900 mb-2">{stat.value}</div>
                <div className="text-neutral-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose MultiSport?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Comprehensive features designed for players, organizers, and fans
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="feature-card bg-white rounded-2xl p-6 shadow-soft border border-neutral-200 hover:shadow-medium transition-all duration-200 transform hover:-translate-y-2">
                <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-neutral-900 mb-3">{feature.title}</h3>
                <p className="text-neutral-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Tournaments */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Trending Tournaments
              </h2>
              <p className="text-neutral-600">
                Join the most popular competitions across all sports
              </p>
            </div>
            <Link
              to="/tournaments"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              <span>View All</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <TrendingTournaments />
        </div>
      </section>

      {/* Top Players */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Top Players
              </h2>
              <p className="text-neutral-600">
                Leading athletes across all sports and categories
              </p>
            </div>
            <Link
              to="/leaderboards"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
            >
              <span>View Rankings</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <TopPlayers />
        </div>
      </section>

      {/* Latest News */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-neutral-900 mb-2">
                Latest News
              </h2>
              <p className="text-neutral-600">
                Stay updated with the latest sports news and updates
              </p>
            </div>
            <Link
              to="/news"
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
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