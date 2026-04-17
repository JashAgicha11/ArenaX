import { apiClient } from './apiClient'

class TournamentService {
  async getTournaments(params = {}) {
    const response = await apiClient.get('/tournaments', { params })
    return response.data
  }

  async getTournamentById(tournamentId) {
    const response = await apiClient.get(`/tournaments/${tournamentId}`)
    return response.data
  }

  async getMyTournaments() {
    const response = await apiClient.get('/tournaments', { params: { scope: 'me' } })
    return response.data
  }
}

export const tournamentService = new TournamentService()
