const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const Player = require('../models/Player');

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
      .populate('teams', 'name sport players')
      .populate('matches');

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

module.exports = {
  listTournaments,
  getTournamentById,
  createTournament,
  updateTournament,
  deleteTournament,
};
