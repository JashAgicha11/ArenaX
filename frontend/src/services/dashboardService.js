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

  async createTeam(payload) {
    const response = await apiClient.post('/teams', payload)
    return response.data
  }

  async addPlayerToTeam(teamId, playerId) {
    const response = await apiClient.post(`/teams/${teamId}/players`, { playerId })
    return response.data
  }

  async createMatch(payload) {
    const response = await apiClient.post('/matches', payload)
    return response.data
  }

  async getTeams(params = {}) {
    const response = await apiClient.get('/teams', { params })
    return response.data
  }

  async getPlayers(params = {}) {
    const response = await apiClient.get('/players', { params })
    return response.data
  }

  async getTournaments() {
    const response = await apiClient.get('/tournaments')
    return response.data
  }
}

export const dashboardService = new DashboardService()
