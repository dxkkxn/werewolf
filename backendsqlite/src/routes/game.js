const express = require('express');
const router = express.Router();
const { createGame, getGames, getGameWithId, joinGame, addMessage, startGame, getStateOfGame } = require('../controllers/game.js');
const { validateToken } = require('../middlewares/userValidators.js');
const { validateGameNotStarted, validateBodyCreateGame, validateUserInGame, validateIdGame, validateUserIsCreator, validateGameStarted } = require('../middlewares/gameValidators.js');

router.get('/game', validateToken, getGames);
router.post('/game', validateToken, validateBodyCreateGame, createGame);

router.post('/game/:idGame', validateToken, validateIdGame, joinGame);
router.get('/game/:idGame', validateToken, validateIdGame, validateUserInGame, getGameWithId);

router.post('/game/:idGame/play', validateToken, validateIdGame, validateUserInGame, validateUserIsCreator, validateGameNotStarted, startGame);
router.get('/game/:idGame/play', validateToken, validateIdGame, validateUserInGame, validateGameStarted, getStateOfGame);

router.post('/:username/:idGame/message', validateToken, validateUserInGame, validateGameStarted, addMessage);
// router.post('/:username/:idGame/vote', validateToken, validateUserInGame, addMessage);
module.exports = router;
