const express = require('express');
const tournamentController = require('../controllers/tournamentController');
const { verifyToken, verifyRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, tournamentController.listTournaments);
router.get('/:id', verifyToken, tournamentController.getTournamentById);
router.post('/', verifyToken, verifyRole(['organizer', 'admin']), tournamentController.createTournament);
router.post('/:id/teams', verifyToken, verifyRole(['organizer', 'admin']), tournamentController.addTeamToTournament);
router.post('/:id/apply', verifyToken, verifyRole(['player']), tournamentController.applyToTournament);
router.post('/:id/players', verifyToken, verifyRole(['organizer', 'admin']), tournamentController.addPlayerToTournamentTeam);
router.get('/:id/leaderboard', verifyToken, tournamentController.getTournamentLeaderboard);
router.patch('/:id/applications/:applicationId', verifyToken, verifyRole(['organizer', 'admin']), tournamentController.reviewApplication);
router.patch('/:id', verifyToken, verifyRole(['admin', 'organizer']), tournamentController.updateTournament);
router.delete('/:id', verifyToken, verifyRole(['admin', 'organizer']), tournamentController.deleteTournament);

module.exports = router;
