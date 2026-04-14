import { createContext, useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authService } from '@services/authService'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('accessToken'))
  const navigate = useNavigate()

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (token) {
          const userData = await authService.getCurrentUser()
          setUser(userData)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [token])

  // Login function
  const login = async (email, password) => {
    try {
      setLoading(true)
      const response = await authService.login(email, password)
      
      const { user: userData, accessToken, refreshToken } = response
      
      setUser(userData)
      setToken(accessToken)
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      toast.success('Login successful!')
      navigate('/dashboard')
      
      return response
    } catch (error) {
      toast.error(error.message || 'Login failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.register(userData)
      
      const { user: newUser, accessToken, refreshToken } = response
      
      setUser(newUser)
      setToken(accessToken)
      
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      
      toast.success('Registration successful!')
      navigate('/dashboard')
      
      return response
    } catch (error) {
      toast.error(error.message || 'Registration failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      if (token) {
        await authService.logout()
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setToken(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      navigate('/')
      toast.success('Logged out successfully')
    }
  }

  // Refresh token function
  const refreshToken = async () => {
    try {
      const refreshTokenValue = localStorage.getItem('refreshToken')
      if (!refreshTokenValue) {
        throw new Error('No refresh token')
      }

      const response = await authService.refreshToken(refreshTokenValue)
      const { accessToken, refreshToken: newRefreshToken } = response
      
      setToken(accessToken)
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', newRefreshToken)
      
      return accessToken
    } catch (error) {
      console.error('Token refresh failed:', error)
      logout()
      throw error
    }
  }

  // Update user profile
  const updateProfile = async (updates) => {
    try {
      const updatedUser = await authService.updateProfile(updates)
      setUser(updatedUser)
      toast.success('Profile updated successfully')
      return updatedUser
    } catch (error) {
      toast.error(error.message || 'Profile update failed')
      throw error
    }
  }

  // Check if user has specific role
  const hasRole = (role) => {
    return user?.role === role || user?.role === 'admin'
  }

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role) || user?.role === 'admin'
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!token
  }

  const value = {
    user,
    loading,
    token,
    login,
    register,
    logout,
    refreshToken,
    updateProfile,
    hasRole,
    hasAnyRole,
    isAuthenticated
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
} 