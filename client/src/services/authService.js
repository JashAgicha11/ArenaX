import { apiClient } from './apiClient'

class AuthService {
  // Login user
  async login(email, password) {
    try {
      const response = await apiClient.post('/auth/login', { email, password })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Register user
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', userData)
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Logout user
  async logout() {
    try {
      const response = await apiClient.post('/auth/logout')
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Refresh access token
  async refreshToken(refreshToken) {
    try {
      const response = await apiClient.post('/auth/refresh', { refreshToken })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/auth/me')
      return response.data.user
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      const response = await apiClient.patch('/auth/me', updates)
      return response.data.user
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword
      })
      return response.data
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.error || error.response.data?.message || 'An error occurred'
      return new Error(message)
    } else if (error.request) {
      // Request made but no response received
      return new Error('No response from server. Please check your connection.')
    } else {
      // Something else happened
      return new Error(error.message || 'An unexpected error occurred')
    }
  }
}

export const authService = new AuthService() 