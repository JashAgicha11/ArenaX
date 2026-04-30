const {
  Tournament, Match, Player, Team, User, PlayersInMatch, TournamentApplication, Op,
} = require('../models');

const buildTournamentQuery = async (req) => {
  const query = {};
  if (req.query.status) query.status = req.query.status;
  if (req.query.sport) query.sport = req.query.sport;

  if (req.query.scope === 'me' && req.user) {
    if (req.user.role === 'organizer') {
      query.organizerId = req.user.id;
    } else if (req.user.role === 'player') {
      const player = await Player.findOne({ where: { userId: req.user.id }, attributes: ['id'] });
      if (!player) return { id: null };
      const links = await PlayersInMatch.findAll({ where: { playerId: player.id }, attributes: ['matchId'] });
      const matches = await Match.findAll({ where: { id: { [Op.in]: links.map((entry) => entry.matchId) } }, attributes: ['tournamentId'] });
      query.id = { [Op.in]: [...new Set(matches.map((m) => m.tournamentId))] };
    }
  }
  return query;
};

const listTournaments = async (req, res) => {
  try {
    const query = await buildTournamentQuery(req);
    const tournaments = await Tournament.findAll({
      where: query,
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email', 'role'] },
        { model: Team, as: 'teams', attributes: ['id', 'name', 'sport'] },
        { model: Match, as: 'matches', attributes: ['id', 'status', 'homeTeamId', 'awayTeamId', 'scheduledAt'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    return res.json({ tournaments });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get tournaments' });
  }
};

const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id, {
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email', 'role'] },
        { model: Team, as: 'teams', attributes: ['id', 'name', 'sport'], include: [{ model: Player, as: 'players', through: { attributes: [] }, attributes: ['id', 'displayName', 'playerId', 'stats', 'sportPreferences'] }] },
        { model: Match, as: 'matches', include: [{ model: Team, as: 'homeTeam', attributes: ['id', 'name'] }, { model: Team, as: 'awayTeam', attributes: ['id', 'name'] }] },
        { model: TournamentApplication, as: 'applications', include: [{ model: Player, as: 'player', attributes: ['id', 'displayName', 'playerId'] }] },
      ],
    });

    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    return res.json({ tournament });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get tournament' });
  }
};

const createTournament = async (req, res) => {
  try {
    const tournament = await Tournament.create({ ...req.body, organizerId: req.user.id });
    return res.status(201).json({ message: 'Tournament created successfully', tournament });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to create tournament' });
  }
};

const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (req.user.role === 'organizer' && String(tournament.organizerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'You can only manage tournaments you created.' });
    }
    Object.assign(tournament, req.body);
    await tournament.save();
    return res.json({ message: 'Tournament updated successfully', tournament });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to update tournament' });
  }
};

const deleteTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (req.user.role === 'organizer' && String(tournament.organizerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'You can only manage tournaments you created.' });
    }
    await tournament.destroy();
    return res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to delete tournament' });
  }
};

const addTeamToTournament = async (req, res) => {
  try {
    const { id: tournamentId } = req.params;
    const { teamId } = req.body;
    const tournament = await Tournament.findByPk(tournamentId);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (req.user.role === 'organizer' && String(tournament.organizerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'You can only manage your tournaments.' });
    }
    const team = await Team.findByPk(teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    if (team.sport !== tournament.sport) return res.status(400).json({ error: 'Team sport must match tournament sport.' });
    team.tournamentId = tournament.id;
    await team.save();
    return res.json({ message: 'Team attached to tournament successfully', tournamentId, teamId });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to attach team' });
  }
};

const applyToTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findByPk(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    const player = await Player.findOne({ where: { userId: req.user.id } });
    if (!player) return res.status(404).json({ error: 'Player profile not found' });

    const existing = await TournamentApplication.findOne({ where: { tournamentId: tournament.id, playerId: player.id } });
    if (existing) return res.status(400).json({ error: `Application already ${existing.status}` });

    await TournamentApplication.create({
      tournamentId: tournament.id,
      playerId: player.id,
      status: 'pending',
      message: req.body.message || '',
    });
    return res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to apply to tournament' });
  }
};

const reviewApplication = async (req, res) => {
  try {
    const { id: tournamentId, applicationId } = req.params;
    const { status } = req.body;
    if (!['approved', 'rejected'].includes(status)) return res.status(400).json({ error: 'Invalid status. Use approved/rejected.' });
    const tournament = await Tournament.findByPk(tournamentId);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (req.user.role === 'organizer' && String(tournament.organizerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'You can only review applications for your tournaments.' });
    }
    const application = await TournamentApplication.findOne({ where: { id: applicationId, tournamentId } });
    if (!application) return res.status(404).json({ error: 'Application not found' });
    application.status = status;
    application.reviewedAt = new Date();
    application.reviewedBy = req.user.id;
    await application.save();
    return res.json({ message: `Application ${status}` });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to review application' });
  }
};

const addPlayerToTournamentTeam = async (req, res) => {
  try {
    const { id: tournamentId } = req.params;
    const { teamId, playerId } = req.body;
    const tournament = await Tournament.findByPk(tournamentId);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    if (req.user.role === 'organizer' && String(tournament.organizerId) !== String(req.user.id)) {
      return res.status(403).json({ error: 'You can only manage players in your tournaments.' });
    }
    const team = await Team.findByPk(teamId);
    if (!team || String(team.tournamentId) !== String(tournamentId)) {
      return res.status(400).json({ error: 'Selected team does not belong to this tournament.' });
    }
    const player = await Player.findOne({ where: { playerId: String(playerId || '').toUpperCase() } });
    if (!player) return res.status(404).json({ error: 'Player not found with this playerId' });
    await team.addPlayer(player);

    const application = await TournamentApplication.findOne({ where: { tournamentId, playerId: player.id } });
    if (application) {
      application.status = 'approved';
      application.reviewedAt = new Date();
      application.reviewedBy = req.user.id;
      await application.save();
    }
    return res.json({ message: 'Player added to tournament team successfully', tournamentId, teamId: team.id, playerId: player.playerId });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to add player to tournament team' });
  }
};

const getTournamentLeaderboard = async (req, res) => {
  try {
    const { id: tournamentId } = req.params;
    const tournament = await Tournament.findByPk(tournamentId, { attributes: ['id', 'name'] });
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const teams = await Team.findAll({ where: { tournamentId }, attributes: ['id', 'name'], include: [{ model: Player, as: 'players', through: { attributes: [] }, attributes: ['id'] }] });
    const playerIds = [...new Set(teams.flatMap((team) => team.players.map((player) => player.id)))];
    const players = await Player.findAll({ where: { id: { [Op.in]: playerIds } }, attributes: ['id', 'displayName', 'playerId', 'stats'], order: [['displayName', 'ASC']] });
    const teamNameById = Object.fromEntries(teams.map((team) => [String(team.id), team.name]));

    const leaderboard = players
      .sort((a, b) => (b.stats?.points || 0) - (a.stats?.points || 0) || (b.stats?.wins || 0) - (a.stats?.wins || 0) || a.displayName.localeCompare(b.displayName))
      .map((player, index) => ({
        rank: index + 1,
        player: { _id: player.id, displayName: player.displayName, playerId: player.playerId },
        stats: player.stats,
        teams: teams.filter((team) => team.players.some((tp) => tp.id === player.id)).map((team) => teamNameById[String(team.id)]),
      }));

    return res.json({ tournament: { _id: tournament.id, name: tournament.name }, leaderboard });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to build tournament leaderboard' });
  }
};

module.exports = {
  listTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
  addTeamToTournament,
  applyToTournament,
  reviewApplication,
  addPlayerToTournamentTeam,
  getTournamentLeaderboard,
};
