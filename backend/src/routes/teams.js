const express = require('express');
const teamController = require('../controllers/teamController');
const { verifyToken, verifyRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, teamController.listTeams);
router.post('/', verifyToken, verifyRole(['organizer', 'admin']), teamController.createTeam);
router.post('/:teamId/players', verifyToken, verifyRole(['organizer', 'admin']), teamController.addPlayerByPlayerId);

module.exports = router;
