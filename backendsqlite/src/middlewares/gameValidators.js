const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');

const validateBodyCreateGame = async (req, res, next) => {
  const requiredAttrs = ['minPlayers', 'maxPlayers', 'dayDuration', 'nightDuration', 'werewolfProbability'];
  const notFoundAttrs = [];
  requiredAttrs.forEach((attr) => {
    if (!has(req.body, [attr])) {
      notFoundAttrs.push(attr);
    }
  });
  if (notFoundAttrs.length !== 0) {
    throw new CodeError(`need attributes: ${notFoundAttrs} where not found`, status.BAD_REQUEST);
  }
  next();
};

module.exports = {
  validateBodyCreateGame
};
