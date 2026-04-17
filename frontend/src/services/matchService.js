import { apiClient } from './apiClient'

class MatchService {
  async getMatches(params = {}) {
    const response = await apiClient.get('/matches', { params })
    return response.data
  }

  async getMatchById(matchId) {
    const response = await apiClient.get(`/matches/${matchId}`)
    return response.data
  }

  async getMyMatches() {
    const response = await apiClient.get('/matches', { params: { scope: 'me' } })
    return response.data
  }

  async createMatch(payload) {
    const response = await apiClient.post('/matches', payload)
    return response.data
  }
}

export const matchService = new MatchService()
