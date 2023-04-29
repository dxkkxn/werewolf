const express = require('express');
const router = express.Router();
const { createGame, getGames, getStateGame, joinGame, addMessage } = require('../controllers/game.js');
const { validateToken } = require('../middlewares/userValidators.js');
const { validateBodyCreateGame, validateUserInGame, validateIdGame } = require('../middlewares/gameValidators.js');

router.get('/game', validateToken, getGames);
router.post('/game', validateToken, validateBodyCreateGame, createGame);

router.post('/game/:idGame', validateToken, validateIdGame, joinGame);
// router.get('/:username/:idGame', validateToken, validateUserInGame, getStateGame);

// router.post('/:username/:idGame/message', validateToken, validateUserInGame, addMessage);
// router.post('/:username/:idGame/vote', validateToken, validateUserInGame, addMessage);
module.exports = router;
