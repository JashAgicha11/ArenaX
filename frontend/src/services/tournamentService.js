import { apiClient } from './apiClient'
import { dashboardService } from './dashboardService'

class TournamentService {
  async getTournaments() {
    const response = await apiClient.get('/tournaments')
    return response.data
  }

  async getTournamentById(tournamentId) {
    const response = await apiClient.get(`/tournaments/${tournamentId}`)
    return response.data
  }

  async getTournamentsForCurrentPlayer(user) {
    const data = await this.getTournaments()
    const tournaments = data.tournaments || []

    if (!user || user.role !== 'player') {
      return tournaments
    }

    const dashboard = await dashboardService.getPlayerDashboard()
    const playerId = dashboard?.player?._id

    if (!playerId) {
      return []
    }

    return tournaments.filter((tournament) =>
      (tournament.players || []).some((id) => String(id) === String(playerId))
    )
  }
}

export const tournamentService = new TournamentService()
