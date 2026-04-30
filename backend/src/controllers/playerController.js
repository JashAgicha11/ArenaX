const { Player, User, Team, Tournament } = require('../models');

const listPlayers = async (req, res) => {
  try {
    const query = {};
    if (req.query.playerId) query.playerId = req.query.playerId.toUpperCase();
    const include = [{ model: User, as: 'user', attributes: ['id', 'name', 'email', 'role', 'playerId'] }];
    if (req.query.teamId) {
      include.push({ model: Team, as: 'teams', where: { id: req.query.teamId }, through: { attributes: [] }, required: true });
    }

    const players = await Player.findAll({ where: query, include });
    return res.json({ players });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get players' });
  }
};

const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'role', 'playerId'] },
        {
          model: Team,
          as: 'teams',
          through: { attributes: [] },
          attributes: ['id', 'name', 'sport', 'tournamentId'],
          include: [{ model: Tournament, as: 'tournament', attributes: ['id', 'name', 'status', 'sport'] }],
        },
      ],
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
