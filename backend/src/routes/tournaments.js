const express = require('express');
const tournamentController = require('../controllers/tournamentController');
const { verifyToken, verifyRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, tournamentController.listTournaments);
router.get('/:id', verifyToken, tournamentController.getTournamentById);
router.post('/', verifyToken, verifyRole(['organizer', 'admin']), tournamentController.createTournament);
router.patch('/:id', verifyToken, verifyRole(['admin', 'organizer']), tournamentController.updateTournament);
router.delete('/:id', verifyToken, verifyRole(['admin', 'organizer']), tournamentController.deleteTournament);

module.exports = router;
