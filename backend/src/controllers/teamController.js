const { Team, Tournament, Player } = require('../models');

const listTeams = async (req, res) => {
  try {
    const query = {};
    if (req.query.tournamentId) query.tournamentId = req.query.tournamentId;
    if (req.query.sport) query.sport = req.query.sport;

    const teams = await Team.findAll({
      where: query,
      include: [
        { model: Player, as: 'players', attributes: ['id', 'displayName', 'playerId'] },
      ],
    });

    return res.json({ teams });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get teams' });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findByPk(req.params.teamId, {
      include: [
        { model: Player, as: 'players', attributes: ['id', 'displayName', 'playerId', 'stats'] },
        { model: Tournament, as: 'tournament', attributes: ['id', 'name', 'sport', 'organizerId'] },
      ],
    });

    if (!team) return res.status(404).json({ error: 'Team not found' });
    return res.json({ team });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get team details' });
  }
};

const createTeam = async (req, res) => {
  try {
    const { tournamentId, name, sport } = req.body;
    const tournament = await Tournament.findByPk(tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const isOwner = String(tournament.organizerId) === String(req.user.id);
    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only create teams in your tournaments.' });
    }

    if (sport !== tournament.sport) {
      return res.status(400).json({ error: 'Team sport must match tournament sport.' });
    }

    const team = await Team.create({
      name,
      sport,
      tournamentId,
      createdBy: req.user.id,
    });

    return res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to create team' });
  }
};

const addPlayerByPlayerId = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { playerId } = req.body;

    const team = await Team.findByPk(teamId);
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }

    const tournament = await Tournament.findByPk(team.tournamentId);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found for this team' });
    }

    const isOwner = String(tournament.organizerId) === String(req.user.id);
    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only manage teams in your tournaments.' });
    }

    const player = await Player.findOne({ where: { playerId: playerId.toUpperCase() } });
    if (!player) {
      return res.status(404).json({ error: 'Player not found with this playerId' });
    }

    await team.addPlayer(player);
    return res.json({ message: 'Player added to team successfully', teamId: team.id, playerId: player.playerId });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to add player to team' });
  }
};

module.exports = {
  listTeams,
  getTeamById,
  createTeam,
  addPlayerByPlayerId,
};
