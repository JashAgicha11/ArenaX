const mongoose = require('mongoose');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const Player = require('../models/Player');

const listTeams = async (req, res) => {
  try {
    const query = {};
    if (req.query.tournamentId) query.tournamentId = req.query.tournamentId;
    if (req.query.sport) query.sport = req.query.sport;

    const teams = await Team.find(query)
      .populate('players', 'displayName playerId')
      .populate('createdBy', 'name email');

    return res.json({ teams });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get teams' });
  }
};

const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('players', 'displayName playerId stats')
      .populate('createdBy', 'name email')
      .populate('tournamentId', 'name sport organizerId');

    if (!team) return res.status(404).json({ error: 'Team not found' });
    return res.json({ team });
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Failed to get team details' });
  }
};

const createTeam = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { tournamentId, name, sport } = req.body;
    const tournament = await Tournament.findById(tournamentId).session(session);
    if (!tournament) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Tournament not found' });
    }

    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
    if (req.user.role === 'organizer' && !isOwner) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'You can only create teams in your tournaments.' });
    }

    if (sport !== tournament.sport) {
      await session.abortTransaction();
      return res.status(400).json({ error: 'Team sport must match tournament sport.' });
    }

    const [team] = await Team.create([{
      name,
      sport,
      tournamentId,
      createdBy: req.user._id,
      players: [],
    }], { session });

    tournament.teams.push(team._id);
    await tournament.save({ session });
    await session.commitTransaction();

    return res.status(201).json({ message: 'Team created successfully', team });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ error: error.message || 'Failed to create team' });
  } finally {
    session.endSession();
  }
};

const addPlayerByPlayerId = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const { teamId } = req.params;
    const { playerId } = req.body;

    const team = await Team.findById(teamId).session(session);
    if (!team) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Team not found' });
    }

    const tournament = await Tournament.findById(team.tournamentId).session(session);
    if (!tournament) {
      await session.abortTransaction();
      return res.status(404).json({ error: 'Tournament not found for this team' });
    }

    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
    if (req.user.role === 'organizer' && !isOwner) {
      await session.abortTransaction();
      return res.status(403).json({ error: 'You can only manage teams in your tournaments.' });
    }

    const player = await Player.findOne({ playerId: playerId.toUpperCase() }).session(session);
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

    await session.commitTransaction();
    return res.json({ message: 'Player added to team successfully', teamId: team._id, playerId: player.playerId });
  } catch (error) {
    await session.abortTransaction();
    return res.status(500).json({ error: error.message || 'Failed to add player to team' });
  } finally {
    session.endSession();
  }
};

module.exports = {
  listTeams,
  getTeamById,
  createTeam,
  addPlayerByPlayerId,
};
