const express = require('express');
const router = express.Router();
const {
  createGame, getGames, getGameWithId, getMyPower,
  joinGame, addMessage, startGame, getStateOfGame,
  votePlayer, validateTargetId, validateSeer
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

// powers
//
// get my power
//
router.get('/game/:idGame/power', validateToken, validateUserInGame, validateGameStarted, getMyPower);

// router.post('/game/:idGame/see', validateToken, validateUserInGame, validateGameStarted,
// validateBodyHasData, validatePlayerAlive, validateTargetId, validateSeer, validateNotUsed, getRole)

module.exports = router;
