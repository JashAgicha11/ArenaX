import { apiClient } from './apiClient'
import { dashboardService } from './dashboardService'

class MatchService {
  async getMatches() {
    const response = await apiClient.get('/matches')
    return response.data
  }

  async getMatchById(matchId) {
    const response = await apiClient.get(`/matches/${matchId}`)
    return response.data
  }

  async getMatchesForCurrentPlayer(user) {
    const data = await this.getMatches()
    const matches = data.matches || []

    if (!user || user.role !== 'player') {
      return matches
    }

    const dashboard = await dashboardService.getPlayerDashboard()
    const playerId = dashboard?.player?._id

    if (!playerId) {
      return []
    }

    return matches.filter((match) =>
      (match.playersInvolved || []).some(
        (playerLink) => String(playerLink?.playerId) === String(playerId)
      )
    )
  }
}

export const matchService = new MatchService()
