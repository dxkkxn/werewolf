const status = require('http-status');
const has = require('has-keys');
const CodeError = require('../util/CodeError.js');

const validateBodyCreateGame = async (req, res, next) => {
  if (!has(req.body, ['data'])) {
    throw new CodeError('You must include a data property in the request body', status.BAD_REQUEST);
  }
  const data = JSON.parse(req.body.data);
  // const requiredAttrs = ['minPlayers', 'maxPlayers', 'dayDuration', 'nightDuration', 'werewolfProbability'];
  const requiredAttrs = ['dayDuration', 'nightDuration'];
  const notFoundAttrs = [];
  requiredAttrs.forEach((attr) => {
    if (!has(data, [attr])) {
      notFoundAttrs.push(attr);
    }
  });
  if (notFoundAttrs.length !== 0) {
    throw new CodeError(`needed attributes: [${notFoundAttrs}] where not found`, status.BAD_REQUEST);
  }
  next();
};

module.exports = {
  validateBodyCreateGame
};
