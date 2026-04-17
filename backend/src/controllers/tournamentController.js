const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const Player = require('../models/Player');
const Team = require('../models/Team');

const buildTournamentQuery = async (req) => {
  const query = {};

  if (req.query.status) query.status = req.query.status;
  if (req.query.sport) query.sport = req.query.sport;

  if (req.query.scope === 'me' && req.user) {
    if (req.user.role === 'organizer') {
      query.organizerId = req.user._id;
    } else if (req.user.role === 'player') {
      const player = await Player.findOne({ userId: req.user._id }).select('_id');
      if (!player) return { _id: null };
      const matches = await Match.find({ 'playersInvolved.playerId': player._id }).select('tournamentId');
      query._id = { $in: [...new Set(matches.map((m) => m.tournamentId.toString()))] };
    }
  }

  return query;
};

const listTournaments = async (req, res) => {
  try {
    const query = await buildTournamentQuery(req);
    const tournaments = await Tournament.find(query)
      .populate('organizerId', 'name email role')
      .populate('teams', 'name sport')
      .populate('matches', 'status homeTeamId awayTeamId scheduledAt')
      .sort({ createdAt: -1 });

    return res.json({ tournaments });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get tournaments' });
  }
};

const getTournamentById = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('organizerId', 'name email role')
      .populate({
        path: 'teams',
        select: 'name sport players',
        populate: { path: 'players', select: 'displayName playerId stats sportPreferences' },
      })
      .populate({
        path: 'matches',
        populate: [
          { path: 'homeTeamId', select: 'name' },
          { path: 'awayTeamId', select: 'name' },
        ],
      })
      .populate('applications.playerId', 'displayName playerId');

    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });
    return res.json({ tournament });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get tournament' });
  }
};

const createTournament = async (req, res) => {
  try {
    const tournament = await Tournament.create({
      ...req.body,
      organizerId: req.user._id,
    });

    return res.status(201).json({ message: 'Tournament created successfully', tournament });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to create tournament' });
  }
};

const updateTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
    if (req.user.role === 'organizer' && !isOwner) {
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
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only manage tournaments you created.' });
    }

    await tournament.deleteOne();
    return res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to delete tournament' });
  }
};

const addTeamToTournament = async (req, res) => {
  try {
    const { id: tournamentId } = req.params;
    const { teamId } = req.body;

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only manage your tournaments.' });
    }

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    if (team.sport !== tournament.sport) {
      return res.status(400).json({ error: 'Team sport must match tournament sport.' });
    }

    team.tournamentId = tournament._id;
    await team.save();

    if (!tournament.teams.some((id) => id.toString() === team._id.toString())) {
      tournament.teams.push(team._id);
      await tournament.save();
    }

    return res.json({ message: 'Team attached to tournament successfully', tournamentId, teamId });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to attach team' });
  }
};

const applyToTournament = async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const player = await Player.findOne({ userId: req.user._id });
    if (!player) return res.status(404).json({ error: 'Player profile not found' });

    const existing = tournament.applications.find((application) => application.playerId.toString() === player._id.toString());
    if (existing) {
      return res.status(400).json({ error: `Application already ${existing.status}` });
    }

    tournament.applications.push({
      playerId: player._id,
      status: 'pending',
      message: req.body.message || '',
    });
    await tournament.save();

    return res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to apply to tournament' });
  }
};

const reviewApplication = async (req, res) => {
  try {
    const { id: tournamentId, applicationId } = req.params;
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use approved/rejected.' });
    }

    const tournament = await Tournament.findById(tournamentId);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only review applications for your tournaments.' });
    }

    const application = tournament.applications.id(applicationId);
    if (!application) return res.status(404).json({ error: 'Application not found' });

    application.status = status;
    application.reviewedAt = new Date();
    application.reviewedBy = req.user._id;
    await tournament.save();

    return res.json({ message: `Application ${status}` });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to review application' });
  }
};

const addPlayerToTournamentTeam = async (req, res) => {
  const session = await Team.startSession();
  session.startTransaction();
  try {
    const { id: tournamentId } = req.params;
    const { teamId, playerId } = req.body;

    const tournament = await Tournament.findById(tournamentId).session(session);
    if (!tournament) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
    if (req.user.role === 'organizer' && !isOwner) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'You can only manage players in your tournaments.' });
    }

    const team = await Team.findById(teamId).session(session);
    if (!team || team.tournamentId.toString() !== tournamentId) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Selected team does not belong to this tournament.' });
    }

    const player = await Player.findOne({ playerId: String(playerId || '').toUpperCase() }).session(session);
    if (!player) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Player not found with this playerId' });
    }

    if (!team.players.some((id) => id.toString() === player._id.toString())) {
      team.players.push(player._id);
      await team.save({ session });
    }

    if (!player.teams.some((id) => id.toString() === team._id.toString())) {
      player.teams.push(team._id);
      await player.save({ session });
    }

    const application = tournament.applications.find((entry) => entry.playerId.toString() === player._id.toString());
    if (application) {
      application.status = 'approved';
      application.reviewedAt = new Date();
      application.reviewedBy = req.user._id;
      await tournament.save({ session });
    }

    await session.commitTransaction();
    return res.json({
      message: 'Player added to tournament team successfully',
      tournamentId,
      teamId: team._id,
      playerId: player.playerId,
    });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ error: error.message || 'Failed to add player to tournament team' });
  } finally {
    session.endSession();
  }
};

const getTournamentLeaderboard = async (req, res) => {
  try {
    const { id: tournamentId } = req.params;
    const tournament = await Tournament.findById(tournamentId).select('_id name teams');
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const teams = await Team.find({ _id: { $in: tournament.teams } }).select('_id name players');
    const playerIds = [...new Set(teams.flatMap((team) => team.players.map((id) => id.toString())))];

    const players = await Player.find({ _id: { $in: playerIds } })
      .select('_id displayName playerId stats')
      .sort({ 'stats.points': -1, 'stats.wins': -1, displayName: 1 });

    const teamNameById = teams.reduce((acc, team) => {
      acc[team._id.toString()] = team.name;
      return acc;
    }, {});

    const leaderboard = players.map((player, index) => ({
      rank: index + 1,
      player: {
        _id: player._id,
        displayName: player.displayName,
        playerId: player.playerId,
      },
      stats: player.stats,
      teams: (player.teams || [])
        .map((teamId) => teamNameById[teamId.toString()])
        .filter(Boolean),
    }));

    return res.json({
      tournament: { _id: tournament._id, name: tournament.name },
      leaderboard,
    });
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
