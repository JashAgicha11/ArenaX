const express = require('express');
const User = require('../models/User');
const Player = require('../models/Player');
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const { generateUniquePlayerId } = require('../utils/playerId');
const { verifyToken, verifyRole } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/v1/users
// @desc    List users (admin only)
// @access  Private (Admin)
router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken');
    res.json({ users });
  } catch (error) {
    logger.error('List users error:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

// @route   POST /api/v1/users
// @desc    Create user (admin only)
// @access  Private (Admin)
router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { name, email, password, role = 'player' } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists.' });
    }

    const playerId = role === 'player' ? await generateUniquePlayerId() : undefined;
    const user = await User.create({ name, email, password, role, playerId });
    const userResponse = user.toObject();
    delete userResponse.password;
    delete userResponse.refreshToken;

    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// @route   PATCH /api/v1/users/:id/role
// @desc    Update user role (admin only)
// @access  Private (Admin)
router.patch('/:id/role', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['admin', 'organizer', 'player'];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    logger.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// @route   DELETE /api/v1/users/:id
// @desc    Delete user (admin only)
// @access  Private (Admin)
router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// @route   GET /api/v1/users/me/player-dashboard
// @desc    Get logged-in player's tournaments and statistics
// @access  Private (Player)
router.get('/me/player-dashboard', verifyToken, verifyRole(['player']), async (req, res) => {
  try {
    const player = await Player.findOne({ userId: req.user._id }).populate('teams', 'name sport');

    if (!player) {
      return res.status(404).json({
        error: 'Player profile not found for this user.'
      });
    }

    const matchDocs = await Match.find({ 'playersInvolved.playerId': player._id }).select('tournamentId status');
    const tournamentIds = [...new Set(matchDocs.map((match) => match.tournamentId.toString()))];

    const tournaments = await Tournament.find({ _id: { $in: tournamentIds } })
      .select('name sport status organizerId teams matches')
      .populate('organizerId', 'name email')
      .sort({ createdAt: -1 });

    const totalMatches = matchDocs.length;

    const liveMatches = matchDocs.filter((match) => match.status === 'live').length;

    res.json({
      player: {
        _id: player._id,
        displayName: player.displayName,
        playerId: player.playerId,
        sportPreferences: player.sportPreferences,
        stats: player.stats,
        teams: player.teams
      },
      tournaments,
      summary: {
        tournamentsCount: tournaments.length,
        matchesCount: totalMatches,
        liveMatchesCount: liveMatches
      }
    });
  } catch (error) {
    logger.error('Player dashboard error:', error);
    res.status(500).json({ error: 'Failed to load player dashboard data' });
  }
});

module.exports = router;
