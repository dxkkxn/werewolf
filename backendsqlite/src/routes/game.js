const express = require('express');
const router = express.Router();
const { createGame, getGames, getStateGame, joinGame, addMessage } = require('../controllers/games.js');
const { validateToken, validateUserInGame } = require('../middlewares/validators.js');

router.get('/:username/game', validateToken, getGames);
router.post('/:username/game', validateToken, createGame);

router.post('/:username/:idGame', validateToken, joinGame);
router.get('/:username/:idGame', validateToken, validateUserInGame, getStateGame);

router.post('/:username/:idGame/message', validateToken, validateUserInGame, addMessage);
// router.post('/:username/:idGame/vote', validateToken, validateUserInGame, addMessage);
module.exports = router;
