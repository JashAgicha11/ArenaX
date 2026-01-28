import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'
import toast from 'react-hot-toast'

const SocketContext = createContext()

export const useSocket = () => {
  const context = useContext(SocketContext)
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider')
  }
  return context
}

export const SocketProvider = ({ children }) => {
  const { user, token, isAuthenticated } = useAuth()
  const socketRef = useRef(null)
  const [isConnected, setIsConnected] = useState(false)
  const [currentMatch, setCurrentMatch] = useState(null)

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated() && token && !socketRef.current) {
      socketRef.current = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
        auth: {
          token: token
        },
        transports: ['websocket', 'polling']
      })

      // Connection events
      socketRef.current.on('connect', () => {
        setIsConnected(true)
        console.log('Socket connected')
      })

      socketRef.current.on('disconnect', () => {
        setIsConnected(false)
        console.log('Socket disconnected')
      })

      socketRef.current.on('connect_error', (error) => {
        console.error('Socket connection error:', error)
        toast.error('Connection error. Please refresh the page.')
      })

      // Match events
      socketRef.current.on('match_joined', (data) => {
        console.log('Joined match:', data)
        setCurrentMatch(data.matchId)
      })

      socketRef.current.on('match_left', (data) => {
        console.log('Left match:', data)
        if (currentMatch === data.matchId) {
          setCurrentMatch(null)
        }
      })

      socketRef.current.on('score_updated', (data) => {
        console.log('Score updated:', data)
        // This will trigger a refetch of match data in components
        // Components can listen to this event to update their state
      })

      socketRef.current.on('commentary_updated', (data) => {
        console.log('Commentary updated:', data)
        // Handle commentary updates
      })

      socketRef.current.on('match_status_changed', (data) => {
        console.log('Match status changed:', data)
        toast.success(`Match status changed to ${data.newStatus}`)
        // This will trigger a refetch of matches data
      })

      socketRef.current.on('period_changed', (data) => {
        console.log('Period changed:', data)
        // Handle period/over changes
      })

      socketRef.current.on('live_matches_updated', (data) => {
        console.log('Live matches updated:', data)
        // This will trigger a refetch of live matches
      })

      socketRef.current.on('error', (error) => {
        console.error('Socket error:', error)
        toast.error(error.message || 'Socket error occurred')
      })
    }

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }
  }, [isAuthenticated, token])

  // Join match room
  const joinMatch = (matchId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('join_match', { matchId })
    }
  }

  // Leave match room
  const leaveMatch = (matchId) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('leave_match', { matchId })
    }
  }

  // Update score (for scorers)
  const updateScore = (matchId, scoringEvent) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('score_update', { matchId, scoringEvent })
    }
  }

  // Update commentary
  const updateCommentary = (matchId, commentary) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('commentary_update', { matchId, commentary })
    }
  }

  // Change match status
  const changeMatchStatus = (matchId, newStatus) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('match_status_change', { matchId, newStatus })
    }
  }

  // Change period/over
  const changePeriod = (matchId, period, time) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit('period_change', { matchId, period, time })
    }
  }

  // Listen to specific events
  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback)
    }
  }

  // Remove event listener
  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback)
    }
  }

  const value = {
    socket: socketRef.current,
    isConnected,
    currentMatch,
    joinMatch,
    leaveMatch,
    updateScore,
    updateCommentary,
    changeMatchStatus,
    changePeriod,
    on,
    off
  }

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  )
} 