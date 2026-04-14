import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { gsap } from 'gsap'
import { Play, Users, MapPin, Clock, ArrowRight, ArrowLeft } from 'lucide-react'

const LiveMatchesCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const carouselRef = useRef(null)
  const intervalRef = useRef(null)

  // Mock live matches data - in real app this would come from API
  const liveMatches = [
    {
      id: 1,
      sport: 'cricket',
      homeTeam: 'Mumbai Indians',
      awayTeam: 'Chennai Super Kings',
      homeScore: '156/4',
      awayScore: '142/6',
      overs: '18.2',
      status: 'Live',
      venue: 'Wankhede Stadium, Mumbai',
      viewers: '2.4K'
    },
    {
      id: 2,
      sport: 'football',
      homeTeam: 'Manchester United',
      awayTeam: 'Liverpool',
      homeScore: '2',
      awayScore: '1',
      time: '67\'',
      status: 'Live',
      venue: 'Old Trafford, Manchester',
      viewers: '5.1K'
    },
    {
      id: 3,
      sport: 'basketball',
      homeTeam: 'Lakers',
      awayTeam: 'Warriors',
      homeScore: '89',
      awayScore: '82',
      quarter: 'Q3',
      status: 'Live',
      venue: 'Crypto.com Arena, LA',
      viewers: '3.2K'
    },
    {
      id: 4,
      sport: 'tennis',
      homeTeam: 'Djokovic',
      awayTeam: 'Nadal',
      homeScore: '6-4, 3-2',
      awayScore: '4-6, 2-3',
      set: 'Set 2',
      status: 'Live',
      venue: 'Wimbledon, London',
      viewers: '1.8K'
    }
  ]

  useEffect(() => {
    // GSAP animations for carousel
    const ctx = gsap.context(() => {
      // Initial animation for carousel items
      gsap.fromTo('.carousel-item', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
      )

      // Auto-scroll animation
      if (!isPaused) {
        gsap.to('.carousel-track', {
          x: `-${currentIndex * 100}%`,
          duration: 0.8,
          ease: 'power2.out'
        })
      }
    }, carouselRef)

    return () => ctx.revert()
  }, [currentIndex, isPaused])

  // Auto-scroll functionality
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % liveMatches.length)
      }, 5000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isPaused, liveMatches.length])

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % liveMatches.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + liveMatches.length) % liveMatches.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  const getSportColor = (sport) => {
    const colors = {
      cricket: 'cricket',
      football: 'football',
      basketball: 'basketball',
      tennis: 'tennis',
      badminton: 'badminton',
      volleyball: 'volleyball'
    }
    return colors[sport] || 'primary'
  }

  const getSportIcon = (sport) => {
    // You can add sport-specific icons here
    return '🏆'
  }

  const formatScore = (match) => {
    if (match.sport === 'cricket') {
      return `${match.homeScore} vs ${match.awayScore} (${match.overs} overs)`
    } else if (match.sport === 'football') {
      return `${match.homeScore} - ${match.awayScore} (${match.time})`
    } else if (match.sport === 'basketball') {
      return `${match.homeScore} - ${match.awayScore} (${match.quarter})`
    } else if (match.sport === 'tennis') {
      return `${match.homeScore} vs ${match.awayScore} (${match.set})`
    }
    return `${match.homeScore} vs ${match.awayScore}`
  }

  return (
    <div 
      ref={carouselRef}
      className="relative overflow-hidden rounded-2xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Track */}
      <div className="flex transition-transform duration-800 ease-out">
        {liveMatches.map((match, index) => (
          <div
            key={match.id}
            className="carousel-item w-full flex-shrink-0"
            style={{ minWidth: '100%' }}
          >
            <div className="bg-white rounded-2xl shadow-soft border border-neutral-200 p-6 mx-4">
              {/* Match Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 bg-${getSportColor(match.sport)}-500 rounded-full animate-pulse`}></div>
                  <span className="text-sm font-medium text-neutral-600 uppercase tracking-wide">
                    {match.sport}
                  </span>
                  <span className="text-sm font-medium text-green-600">
                    {match.status}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-neutral-500">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">{match.viewers}</span>
                </div>
              </div>

              {/* Teams and Score */}
              <div className="text-center mb-6">
                <div className="grid grid-cols-3 items-center gap-4">
                  {/* Home Team */}
                  <div className="text-right">
                    <div className="font-bold text-lg text-neutral-900 mb-1">
                      {match.homeTeam}
                    </div>
                    <div className="text-2xl font-bold text-neutral-800">
                      {match.sport === 'cricket' ? match.homeScore.split('/')[0] : match.homeScore}
                    </div>
                  </div>

                  {/* VS */}
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neutral-400 mb-2">VS</div>
                    <div className="text-sm text-neutral-500">
                      {match.sport === 'cricket' && match.overs}
                      {match.sport === 'football' && match.time}
                      {match.sport === 'basketball' && match.quarter}
                      {match.sport === 'tennis' && match.set}
                    </div>
                  </div>

                  {/* Away Team */}
                  <div className="text-left">
                    <div className="font-bold text-lg text-neutral-900 mb-1">
                      {match.awayTeam}
                    </div>
                    <div className="text-2xl font-bold text-neutral-800">
                      {match.sport === 'cricket' ? match.awayScore.split('/')[0] : match.awayScore}
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Details */}
              <div className="flex items-center justify-between text-sm text-neutral-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate max-w-32">{match.venue}</span>
                </div>
                <Link
                  to={`/matches/${match.id}`}
                  className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-xl hover:bg-primary-700 transition-colors duration-200"
                >
                  <Play className="w-4 h-4" />
                  <span>Watch</span>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-700 hover:text-primary-600 p-2 rounded-full shadow-medium transition-all duration-200 hover:scale-110"
      >
        <ArrowLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-neutral-700 hover:text-primary-600 p-2 rounded-full shadow-medium transition-all duration-200 hover:scale-110"
      >
        <ArrowRight className="w-5 h-5" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {liveMatches.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex 
                ? 'bg-primary-600 w-6' 
                : 'bg-neutral-300 hover:bg-neutral-400'
            }`}
          />
        ))}
      </div>

      {/* View All Matches Button */}
      <div className="absolute top-4 right-4">
        <Link
          to="/matches"
          className="bg-white/90 hover:bg-white text-neutral-700 hover:text-primary-600 px-4 py-2 rounded-xl shadow-medium transition-all duration-200 hover:scale-105"
        >
          View All
        </Link>
      </div>
    </div>
  )
}

export default LiveMatchesCarousel 