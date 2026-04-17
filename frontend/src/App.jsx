import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { AuthProvider } from '@contexts/AuthContext'
import { SocketProvider } from '@contexts/SocketContext'
import ProtectedRoute from '@components/auth/ProtectedRoute'
import Layout from '@components/layout/Layout'
import Home from '@pages/Home'
import SportsHub from '@pages/SportsHub'
import Matches from '@pages/Matches'
import MatchDetail from '@pages/MatchDetail'
import Tournaments from '@pages/Tournaments'
import TournamentDetail from '@pages/TournamentDetail'
import Players from '@pages/Players'
import PlayerDetail from '@pages/PlayerDetail'
import Teams from '@pages/Teams'
import TeamDetail from '@pages/TeamDetail'
import Leaderboards from '@pages/Leaderboards'
import News from '@pages/News'
import NewsDetail from '@pages/NewsDetail'
import Login from '@pages/auth/Login'
import Register from '@pages/auth/Register'
import Dashboard from '@pages/dashboard/Dashboard'
import PlayerDashboard from '@pages/dashboard/PlayerDashboard'
import OrganizerDashboard from '@pages/dashboard/OrganizerDashboard'
import CreateTournament from '@pages/dashboard/CreateTournament'
import CreateTeam from '@pages/dashboard/CreateTeam'
import AddPlayerToTeam from '@pages/dashboard/AddPlayerToTeam'
import CreateMatch from '@pages/dashboard/CreateMatch'
import TournamentApplications from '@pages/dashboard/TournamentApplications'
import AdminPanel from '@pages/admin/AdminPanel'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

function App() {
  useEffect(() => {
    // Initialize GSAP animations
    gsap.set('.animate-on-scroll', { opacity: 0, y: 50 })
    
    ScrollTrigger.batch('.animate-on-scroll', {
      onEnter: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out'
        })
      },
      onLeave: (elements) => {
        gsap.to(elements, {
          opacity: 0,
          y: -50,
          duration: 0.3,
          ease: 'power2.in'
        })
      },
      onEnterBack: (elements) => {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          stagger: 0.1,
          duration: 0.6,
          ease: 'power2.out'
        })
      },
      onLeaveBack: (elements) => {
        gsap.to(elements, {
          opacity: 0,
          y: 50,
          duration: 0.3,
          ease: 'power2.in'
        })
      }
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <AuthProvider>
      <SocketProvider>
        <Layout>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/sports/:sportKey" element={<SportsHub />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/matches/:matchId" element={<MatchDetail />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:tournamentId" element={<TournamentDetail />} />
            <Route path="/players" element={<Players />} />
            <Route path="/players/:playerId" element={<PlayerDetail />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:teamId" element={<TeamDetail />} />
            <Route path="/leaderboards" element={<Leaderboards />} />
            <Route path="/news" element={<News />} />
            <Route path="/news/:slug" element={<NewsDetail />} />
            
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute allowedRoles={['player', 'organizer', 'admin']}>
                <Dashboard />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/player" element={
              <ProtectedRoute allowedRoles={['player', 'admin']}>
                <PlayerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/organizer" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <OrganizerDashboard />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/organizer/create-tournament" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <CreateTournament />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/organizer/create-team" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <CreateTeam />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/organizer/add-player" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <AddPlayerToTeam />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/organizer/create-match" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <CreateMatch />
              </ProtectedRoute>
            } />
            <Route path="/tournaments/:tournamentId/create-match" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <CreateMatch />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/organizer/applications" element={
              <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                <TournamentApplications />
              </ProtectedRoute>
            } />

            <Route path="/dashboard/admin" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPanel />
              </ProtectedRoute>
            } />
          </Routes>
        </Layout>
      </SocketProvider>
    </AuthProvider>
  )
}


export default App 
