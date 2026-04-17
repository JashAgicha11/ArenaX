const mongoose = require('mongoose');
const Match = require('../models/Match');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const Player = require('../models/Player');

const buildMatchQuery = async (req) => {
  const query = {};
  const { sport, status, tournament, team } = req.query;

  if (status) query.status = status;
  if (tournament) query.tournamentId = tournament;
  if (team) query.$or = [{ homeTeamId: team }, { awayTeamId: team }];

  if (sport) {
    const tournaments = await Tournament.find({ sport }).select('_id');
    query.tournamentId = { $in: tournaments.map((t) => t._id) };
  }

  if (req.query.scope === 'me' && req.user?.role === 'player') {
    const player = await Player.findOne({ userId: req.user._id }).select('_id');
    if (!player) return { _id: null };
    query['playersInvolved.playerId'] = player._id;
  }

  if (req.query.scope === 'me' && req.user?.role === 'organizer') {
    const tournaments = await Tournament.find({ organizerId: req.user._id }).select('_id');
    query.tournamentId = { $in: tournaments.map((t) => t._id) };
  }

  return query;
};

const listMatches = async (req, res) => {
  try {
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);
    const query = await buildMatchQuery(req);

    const matches = await Match.find(query)
      .populate('homeTeamId', 'name')
      .populate('awayTeamId', 'name')
      .populate('tournamentId', 'name sport')
      .sort({ scheduledAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Match.countDocuments(query);
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
    const match = await Match.findById(req.params.id)
      .populate('homeTeamId', 'name players')
      .populate('awayTeamId', 'name players')
      .populate('tournamentId', 'name sport');

    if (!match) return res.status(404).json({ error: 'Match not found' });
    return res.json({ match });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get match' });
  }
};

const createMatch = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { tournamentId, homeTeamId, awayTeamId, playersInvolved = [], scheduledAt, status = 'upcoming' } = req.body;
    const tournament = await Tournament.findById(tournamentId).session(session);

    if (!tournament) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
    if (req.user.role === 'organizer' && !isOwner) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'You can only create matches in your tournaments.' });
    }

    const [homeTeam, awayTeam] = await Promise.all([
      Team.findById(homeTeamId).session(session),
      Team.findById(awayTeamId).session(session),
    ]);

    if (!homeTeam || !awayTeam) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'One or both teams not found' });
    }

    if (homeTeam.tournamentId.toString() !== tournamentId || awayTeam.tournamentId.toString() !== tournamentId) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Both teams must belong to the selected tournament' });
    }

    if (homeTeam.sport !== awayTeam.sport || homeTeam.sport !== tournament.sport) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Tournament and teams must share same sport' });
    }

    const teamPlayerIds = new Set([...homeTeam.players, ...awayTeam.players].map((id) => id.toString()));
    const invalidInvolved = playersInvolved.some(
      ({ playerId, teamId }) => !teamPlayerIds.has(String(playerId)) || ![homeTeamId, awayTeamId].includes(String(teamId))
    );
    if (invalidInvolved) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'playersInvolved must belong to selected teams' });
    }

    const [match] = await Match.create([{
      tournamentId,
      homeTeamId,
      awayTeamId,
      playersInvolved,
      scoringFeed: [],
      result: {},
      scheduledAt,
      status,
    }], { session });

    tournament.matches.push(match._id);
    await tournament.save({ session });
    await session.commitTransaction();

    return res.status(201).json({ message: 'Match created successfully', match });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ error: error.message || 'Failed to create match' });
  } finally {
    session.endSession();
  }
};

const updateMatch = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const tournament = await Tournament.findById(match.tournamentId);
    if (!tournament) return res.status(404).json({ error: 'Tournament not found' });

    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
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
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ error: 'Match not found' });

    const tournament = await Tournament.findById(match.tournamentId);
    const isOwner = tournament && tournament.organizerId.toString() === req.user._id.toString();

    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only delete matches in your tournaments.' });
    }

    await Match.deleteOne({ _id: req.params.id });
    await Tournament.updateOne({ _id: match.tournamentId }, { $pull: { matches: match._id } });
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
