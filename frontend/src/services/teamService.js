import { apiClient } from './apiClient'

class TeamService {
  async getTeams(params = {}) {
    const response = await apiClient.get('/teams', { params })
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
}

export const teamService = new TeamService()
