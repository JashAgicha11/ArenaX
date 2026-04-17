const express = require('express');
const playerController = require('../controllers/playerController');
const { verifyToken, verifyRole } = require('../middleware/auth');

const router = express.Router();

router.get('/admin/all', verifyToken, verifyRole(['admin']), playerController.listPlayers);
router.get('/', verifyToken, playerController.listPlayers);
router.get('/:id', verifyToken, playerController.getPlayerById);

module.exports = router;
