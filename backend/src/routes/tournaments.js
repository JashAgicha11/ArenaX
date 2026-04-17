const express = require('express');
const Tournament = require('../models/Tournament');
const { verifyToken, verifyRole } = require('../middleware/auth');
const logger = require('../utils/logger');

const router = express.Router();

// @route   GET /api/v1/tournaments
// @desc    Get tournaments
// @access  Public
router.get('/', async (req, res) => {
  try {
    const tournaments = await Tournament.find()
      .populate('organizerId', 'name email role')
      .sort({ createdAt: -1 });
    res.json({ tournaments });
  } catch (error) {
    logger.error('Get tournaments error:', error);
    res.status(500).json({ error: 'Failed to get tournaments' });
  }
});

// @route   GET /api/v1/tournaments/:id
// @desc    Get tournament by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id)
      .populate('organizerId', 'name email role')
      .populate('teams', 'name sportKey')
      .populate('players', 'displayName userId');

    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    res.json({ tournament });
  } catch (error) {
    logger.error('Get tournament error:', error);
    res.status(500).json({ error: 'Failed to get tournament' });
  }
});

// @route   POST /api/v1/tournaments
// @desc    Create tournament
// @access  Private (Organizer)
router.post('/', verifyToken, verifyRole(['organizer']), async (req, res) => {
  try {
    // Organizer ownership is persisted at creation to enforce manage-your-own rules later.
    const tournament = await Tournament.create({
      ...req.body,
      organizerId: req.user._id
    });
    res.status(201).json({ message: 'Tournament created successfully', tournament });
  } catch (error) {
    logger.error('Create tournament error:', error);
    res.status(500).json({ error: 'Failed to create tournament' });
  }
});

// @route   PATCH /api/v1/tournaments/:id
// @desc    Update tournament
// @access  Private (Organizer owner or Admin)
router.patch('/:id', verifyToken, verifyRole(['admin', 'organizer']), async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    // Organizers can only manage tournaments they created.
    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only manage tournaments you created.' });
    }

    Object.assign(tournament, req.body);
    await tournament.save();

    res.json({ message: 'Tournament updated successfully', tournament });
  } catch (error) {
    logger.error('Update tournament error:', error);
    res.status(500).json({ error: 'Failed to update tournament' });
  }
});

// @route   DELETE /api/v1/tournaments/:id
// @desc    Delete tournament
// @access  Private (Organizer owner or Admin)
router.delete('/:id', verifyToken, verifyRole(['admin', 'organizer']), async (req, res) => {
  try {
    const tournament = await Tournament.findById(req.params.id);
    if (!tournament) {
      return res.status(404).json({ error: 'Tournament not found' });
    }

    // Organizers can only manage tournaments they created.
    const isOwner = tournament.organizerId.toString() === req.user._id.toString();
    if (req.user.role === 'organizer' && !isOwner) {
      return res.status(403).json({ error: 'You can only manage tournaments you created.' });
    }

    await tournament.deleteOne();
    res.json({ message: 'Tournament deleted successfully' });
  } catch (error) {
    logger.error('Delete tournament error:', error);
    res.status(500).json({ error: 'Failed to delete tournament' });
  }
});

module.exports = router;
