const Player = require('../models/Player');

const listPlayers = async (req, res) => {
  try {
    const query = {};
    if (req.query.playerId) query.playerId = req.query.playerId.toUpperCase();
    if (req.query.teamId) query.teams = req.query.teamId;

    const players = await Player.find(query).populate('userId', 'name email role playerId');
    return res.json({ players });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get players' });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id)
      .populate('userId', 'name email role playerId')
      .populate({
        path: 'teams',
        select: 'name sport tournamentId',
        populate: { path: 'tournamentId', select: 'name status sport' },
      });
    if (!player) return res.status(404).json({ error: 'Player not found' });
    return res.json({ player });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get player' });
  }
};

module.exports = {
  listPlayers,
  getPlayerById,
};
