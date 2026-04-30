const express = require('express');
const {
  User, Player, Tournament, Match, PlayersInMatch, Team, Op,
} = require('../models');
const { generateUniquePlayerId } = require('../utils/playerId');
const { verifyToken, verifyRole } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

router.get('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password', 'refreshToken'] } });
    res.json({ users });
  } catch (error) {
    logger.error('List users error:', error);
    res.status(500).json({ error: 'Failed to list users' });
  }
});

router.post('/', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const {
      name, email, password, role = 'player',
    } = req.body;
    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'User with this email already exists.' });
    const playerId = role === 'player' ? await generateUniquePlayerId() : undefined;
    const user = await User.create({
      name, email, password, role, playerId,
    });
    const userResponse = user.toJSON();
    delete userResponse.password;
    delete userResponse.refreshToken;
    res.status(201).json({ message: 'User created successfully', user: userResponse });
  } catch (error) {
    logger.error('Create user error:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.patch('/:id/role', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const { role } = req.body;
    const allowedRoles = ['admin', 'organizer', 'player'];
    if (!allowedRoles.includes(role)) return res.status(400).json({ error: 'Invalid role' });
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.role = role;
    await user.save();
    const result = user.toJSON();
    delete result.password;
    delete result.refreshToken;
    res.json({ message: 'User role updated successfully', user: result });
  } catch (error) {
    logger.error('Update user role error:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

router.delete('/:id', verifyToken, verifyRole(['admin']), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    logger.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

router.get('/me/player-dashboard', verifyToken, verifyRole(['player']), async (req, res) => {
  try {
    const player = await Player.findOne({
      where: { userId: req.user.id },
      include: [{ model: Team, as: 'teams', through: { attributes: [] }, attributes: ['id', 'name', 'sport'] }],
    });
    if (!player) return res.status(404).json({ error: 'Player profile not found for this user.' });

    const links = await PlayersInMatch.findAll({ where: { playerId: player.id }, attributes: ['matchId'] });
    const matchDocs = await Match.findAll({
      where: { id: { [Op.in]: links.map((entry) => entry.matchId) } },
      attributes: ['id', 'tournamentId', 'status'],
    });
    const tournamentIds = [...new Set(matchDocs.map((match) => match.tournamentId))];
    const tournaments = await Tournament.findAll({
      where: { id: { [Op.in]: tournamentIds } },
      attributes: ['id', 'name', 'sport', 'status', 'organizerId'],
      include: [{ model: User, as: 'organizer', attributes: ['id', 'name', 'email'] }],
      order: [['createdAt', 'DESC']],
    });
    const totalMatches = matchDocs.length;
    const liveMatches = matchDocs.filter((match) => match.status === 'live').length;

    res.json({
      player: {
        _id: player.id,
        displayName: player.displayName,
        playerId: player.playerId,
        sportPreferences: player.sportPreferences,
        stats: player.stats,
        teams: player.teams,
      },
      tournaments,
      summary: {
        tournamentsCount: tournaments.length,
        matchesCount: totalMatches,
        liveMatchesCount: liveMatches,
      },
    });
  } catch (error) {
    logger.error('Player dashboard error:', error);
    res.status(500).json({ error: 'Failed to load player dashboard data' });
  }
});

module.exports = router;
