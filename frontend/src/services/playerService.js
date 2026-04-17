import { apiClient } from './apiClient'

class PlayerService {
  async getPlayers(params = {}) {
    const response = await apiClient.get('/players', { params })
    return response.data
  }

  async getPlayerById(playerId) {
    const response = await apiClient.get(`/players/${playerId}`)
    return response.data
  }
}

export const playerService = new PlayerService()
