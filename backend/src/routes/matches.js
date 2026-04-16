// Matches Routes
// Handles CRUD operations for matches
// Includes live match management and scoring

const express = require('express');
const Match = require('../models/Match');
const { verifyToken } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/v1/matches
// @desc    Get all matches with filtering
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      sport,
      status,
      tournament,
      team,
      page = 1,
      limit = 10
    } = req.query;

    let query = {};

    if (sport) query.sportKey = sport;
    if (status) query.status = status;
    if (tournament) query.tournamentId = tournament;
    if (team) {
      query.$or = [
        { homeTeamId: team },
        { awayTeamId: team }
      ];
    }

    const matches = await Match.find(query)
      .populate('homeTeamId', 'name logoUrl')
      .populate('awayTeamId', 'name logoUrl')
      .populate('tournamentId', 'name')
      .sort({ scheduledAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Match.countDocuments(query);

    res.json({
      matches,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    logger.error('Get matches error:', error);
    res.status(500).json({ error: 'Failed to get matches' });
  }
});

// @route   GET /api/v1/matches/live
// @desc    Get live matches
// @access  Public
router.get('/live', async (req, res) => {
  try {
    const liveMatches = await Match.find({ status: 'live' })
      .populate('homeTeamId', 'name logoUrl')
      .populate('awayTeamId', 'name logoUrl')
      .populate('tournamentId', 'name')
      .sort({ scheduledAt: 1 });

    res.json({ liveMatches });

  } catch (error) {
    logger.error('Get live matches error:', error);
    res.status(500).json({ error: 'Failed to get live matches' });
  }
});

// @route   GET /api/v1/matches/:id
// @desc    Get match by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('homeTeamId')
      .populate('awayTeamId')
      .populate('tournamentId')
      .populate('players.homeTeam')
      .populate('players.awayTeam');

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    res.json({ match });

  } catch (error) {
    logger.error('Get match error:', error);
    res.status(500).json({ error: 'Failed to get match' });
  }
});

// @route   POST /api/v1/matches
// @desc    Create a new match
// @access  Private (Admin/Organizer)
router.post('/', verifyToken, async (req, res) => {
  try {
    if (!req.user.hasAnyRole(['admin', 'organizer'])) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const matchData = { ...req.body };
    const match = new Match(matchData);
    await match.save();

    await match.populate('homeTeamId');
    await match.populate('awayTeamId');
    await match.populate('tournamentId');

    logger.info(`Match created: ${match._id} by ${req.user.email}`);

    res.status(201).json({
      message: 'Match created successfully',
      match
    });

  } catch (error) {
    logger.error('Create match error:', error);
    res.status(500).json({ error: 'Failed to create match' });
  }
});

// @route   PUT /api/v1/matches/:id
// @desc    Update match
// @access  Private (Admin/Organizer)
router.put('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.user.hasAnyRole(['admin', 'organizer'])) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const match = await Match.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('homeTeamId')
      .populate('awayTeamId')
      .populate('tournamentId');

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    logger.info(`Match updated: ${match._id} by ${req.user.email}`);

    res.json({
      message: 'Match updated successfully',
      match
    });

  } catch (error) {
    logger.error('Update match error:', error);
    res.status(500).json({ error: 'Failed to update match' });
  }
});

// @route   DELETE /api/v1/matches/:id
// @desc    Delete match
// @access  Private (Admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (!req.user.hasRole('admin')) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    const match = await Match.findByIdAndDelete(req.params.id);

    if (!match) {
      return res.status(404).json({ error: 'Match not found' });
    }

    logger.info(`Match deleted: ${req.params.id} by ${req.user.email}`);

    res.json({ message: 'Match deleted successfully' });

  } catch (error) {
    logger.error('Delete match error:', error);
    res.status(500).json({ error: 'Failed to delete match' });
  }
});

module.exports = router;