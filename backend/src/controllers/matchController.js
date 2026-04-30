const { Match, Team, Tournament, Player, PlayersInMatch, ScoringFeed, Op } = require('../models');

const buildMatchQuery = async (req) => {
  const query = {};
  const { sport, status, tournament, team } = req.query;

  if (status) query.status = status;
  if (tournament) query.tournamentId = tournament;
  if (team) query[Op.or] = [{ homeTeamId: team }, { awayTeamId: team }];

  if (sport) {
    const tournaments = await Tournament.findAll({ where: { sport }, attributes: ['id'] });
    query.tournamentId = { [Op.in]: tournaments.map((t) => t.id) };
  }

  if (req.query.scope === 'me' && req.user?.role === 'player') {
    const player = await Player.findOne({ where: { userId: req.user.id }, attributes: ['id'] });
    if (!player) return { id: null };
    const links = await PlayersInMatch.findAll({ where: { playerId: player.id }, attributes: ['matchId'] });
    query.id = { [Op.in]: links.map((entry) => entry.matchId) };
  }

  if (req.query.scope === 'me' && req.user?.role === 'organizer') {
    const tournaments = await Tournament.findAll({ where: { organizerId: req.user.id }, attributes: ['id'] });
    query.tournamentId = { [Op.in]: tournaments.map((t) => t.id) };
  }

  return query;
};

const listMatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const query = await buildMatchQuery(req);

    const matches = await Match.findAll({
      where: query,
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
        { model: Team, as: 'awayTeam', attributes: ['id', 'name'] },
        { model: Tournament, as: 'tournament', attributes: ['id', 'name', 'sport'] },
        { model: PlayersInMatch, as: 'playersInvolved' },
        { model: ScoringFeed, as: 'scoringFeed' },
      ],
      order: [['scheduledAt', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    const total = await Match.count({ where: query });
    return res.json({
      matches,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get matches' });
  }
};

const getMatchById = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id, {
      include: [
        { model: Team, as: 'homeTeam', attributes: ['id', 'name'] },
        { model: Team, as: 'awayTeam', attributes: ['id', 'name'] },
        { model: Tournament, as: 'tournament', attributes: ['id', 'name', 'sport'] },
        {
          model: PlayersInMatch,
          as: 'playersInvolved',
          include: [{ model: Player, as: 'player', attributes: ['id', 'displayName', 'playerId'] }],
        },
        { model: ScoringFeed, as: 'scoringFeed' },
      ],
    });

    if (!match) return res.status(404).json({ error: 'Match not found' });
    return res.json({ match });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get match' });
  }
};

const createMatch = async (req, res) => {
  try {
    const { tournamentId, homeTeamId, awayTeamId, playersInvolved = [], scheduledAt, status = 'upcoming' } = req.body;
    const tournament = await Tournament.findByPk(tournamentId);

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const isOwner = String(tournament.organizerId) === String(req.user.id);
    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only create matches in your tournaments.' });
    }

    const [homeTeam, awayTeam] = await Promise.all([
      Team.findByPk(homeTeamId),
      Team.findByPk(awayTeamId),
    ]);

    if (!homeTeam || !awayTeam) {
      return res.status(404).json({ error: 'One or both teams not found' });
    }

    if (homeTeam.tournamentId.toString() !== tournamentId || awayTeam.tournamentId.toString() !== tournamentId) {
      return res.status(400).json({ error: 'Both teams must belong to the selected tournament' });
    }

    if (homeTeam.sport !== awayTeam.sport || homeTeam.sport !== tournament.sport) {
      return res.status(400).json({ error: 'Tournament and teams must share same sport' });
    }

    const homeTeamPlayers = await homeTeam.getPlayers({ attributes: ['id'] });
    const awayTeamPlayers = await awayTeam.getPlayers({ attributes: ['id'] });
    const teamPlayerIds = new Set([...homeTeamPlayers, ...awayTeamPlayers].map((player) => String(player.id)));
    const invalidInvolved = playersInvolved.some(
      ({ playerId, teamId }) => !teamPlayerIds.has(String(playerId)) || ![homeTeamId, awayTeamId].includes(String(teamId))
    );
    if (invalidInvolved) {
      return res.status(400).json({ error: 'playersInvolved must belong to selected teams' });
    }

    const match = await Match.create({
      tournamentId,
      homeTeamId,
      awayTeamId,
      result: {},
      scheduledAt,
      status,
      sportKey: tournament.sport,
    });

    if (playersInvolved.length) {
      await PlayersInMatch.bulkCreate(
        playersInvolved.map((entry) => ({ ...entry, matchId: match.id }))
      );
    }

    return res.status(201).json({ message: 'Match created successfully', match });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to create match' });
  }
};

const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const tournament = await Tournament.findByPk(match.tournamentId);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const isOwner = String(tournament.organizerId) === String(req.user.id);
    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only update matches in your tournaments.' });
    }

    Object.assign(match, req.body);
    await match.save();
    return res.json({ message: 'Match updated successfully', match });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to update match' });
  }
};

const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByPk(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const tournament = await Tournament.findByPk(match.tournamentId);
    const isOwner = tournament && String(tournament.organizerId) === String(req.user.id);

    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only delete matches in your tournaments.' });
    }

    await PlayersInMatch.destroy({ where: { matchId: match.id } });
    await ScoringFeed.destroy({ where: { matchId: match.id } });
    await match.destroy();
    return res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to delete match' });
  }
};

module.exports = {
  listMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch,
};
