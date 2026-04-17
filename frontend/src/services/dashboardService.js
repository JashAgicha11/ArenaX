import { apiClient } from './apiClient'

class DashboardService {
  async getPlayerDashboard() {
    const response = await apiClient.get('/users/me/player-dashboard')
    return response.data
  }

  async createTournament(payload) {
    const response = await apiClient.post('/tournaments', payload)
    return response.data
  }

  async getTournaments() {
    const response = await apiClient.get('/tournaments')
    return response.data
  }
}

export const dashboardService = new DashboardService()
