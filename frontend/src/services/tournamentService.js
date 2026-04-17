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

  async applyToTournament(tournamentId, message = '') {
    const response = await apiClient.post(`/tournaments/${tournamentId}/apply`, { message })
    return response.data
  }

  async reviewApplication(tournamentId, applicationId, status) {
    const response = await apiClient.patch(`/tournaments/${tournamentId}/applications/${applicationId}`, { status })
    return response.data
  }

  async addTeamToTournament(tournamentId, teamId) {
    const response = await apiClient.post(`/tournaments/${tournamentId}/teams`, { teamId })
    return response.data
  }
}

export const tournamentService = new TournamentService()
