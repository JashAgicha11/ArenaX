const express = require('express');
const matchController = require('../controllers/matchController');
const { verifyToken, verifyRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', verifyToken, matchController.listMatches);
router.get('/:id', verifyToken, matchController.getMatchById);
router.post('/', verifyToken, verifyRole(['organizer', 'admin']), matchController.createMatch);
router.put('/:id', verifyToken, verifyRole(['organizer', 'admin']), matchController.updateMatch);
router.delete('/:id', verifyToken, verifyRole(['organizer', 'admin']), matchController.deleteMatch);

module.exports = router;