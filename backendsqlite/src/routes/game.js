const express = require('express');
const router = express.Router();
const {
  createGame, getGames, getGameWithId,
  joinGame, addMessage, startGame, getStateOfGame, votePlayer
} = require('../controllers/game.js');
const { validateToken } = require('../middlewares/userValidators.js');
const {
  validateBodyHasData,
  validateGameNotStarted, validateBodyCreateGame, validateUserInGame,
  validateIdGame, validateUserIsCreator, validateGameStarted,
  validateUserNotAlreadyInGame, validatePlayerAlive, validateRightRole,
  validateAccusedId
} = require('../middlewares/gameValidators.js');

router.get('/game', validateToken, getGames);
router.post('/game', validateToken, validateBodyHasData, validateBodyCreateGame,
  validateUserNotAlreadyInGame, createGame);

router.post('/game/:idGame', validateToken, validateIdGame,
  validateUserNotAlreadyInGame, joinGame);
router.get('/game/:idGame', validateToken, validateIdGame,
  validateUserInGame, getGameWithId);

router.post('/game/:idGame/play', validateToken, validateIdGame,
  validateUserInGame, validateUserIsCreator, validateGameNotStarted, startGame);
router.get('/game/:idGame/play', validateToken, validateIdGame, validateUserInGame,
  validateGameStarted, getStateOfGame);

router.post('/game/:idGame/message', validateToken, validateBodyHasData, validateUserInGame,
  validateGameStarted, validatePlayerAlive, validateRightRole, addMessage);

router.post('/game/:idGame/vote', validateToken, validateBodyHasData, validateUserInGame,
  validateGameStarted, validatePlayerAlive, validateRightRole, validateAccusedId, votePlayer);
module.exports = router;
