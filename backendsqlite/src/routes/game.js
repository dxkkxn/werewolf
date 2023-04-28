const express = require('express');
const router = express.Router();
const { createGame, getGames } = require('../controllers/games.js');
const { validateToken } = require('../middlewares/validators.js');

router.get('/:username/game', validateToken, getGames);
router.post('/:username/game', validateToken, createGame);

module.exports = router;
