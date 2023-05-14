const app = require('../app');
const request = require('supertest');
const status = require('http-status');
const { createUser, getToken, getAllGames, joinGame } = require('./helperFunctions.js');

/* eslint-env jest */

describe('testing the start of game ', () => {
  let sebToken;
  let viarToken;
  test('creating user seb', async () => {
    await createUser('seb');
    sebToken = await getToken('seb');
  });

  test('creating user viardot', async () => {
    await createUser('viardot');
    viarToken = await getToken('viardot');
  });

  let gameInfo
  test('seb creates a game', async () => {
    console.log(sebToken, viarToken);
    // jest.useFakeTimers();
    const currentDate = new Date();
    let startingDate = new Date(currentDate.getTime() + (60 * 60 * 1000));
    startingDate = startingDate.toISOString();
    const data = { dayDuration: 3, nightDuration: 2, startingDate, minPlayers: 0, maxPlayers: 2 };
    const response = await request(app)
      .post('/game')
      .set({ 'x-access-token': sebToken })
      .send({ data: JSON.stringify(data) });
    expect(response.body.message).toBe('game created');
    expect(response.statusCode).toBe(status.CREATED);
    const games = await getAllGames(sebToken);
    games.forEach((game) => {
      if (game.creatorUsername === 'seb') {
        gameInfo = game;
      }
    });
  });

  async function getGame (token, idGame) {
    const response = await request(app)
      .get(`/game/${idGame}`)
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('returning game in the data property');
    return JSON.parse(response.body.data);
  }

  test('viardot joins the a game, game should start', async () => {
    await joinGame(viarToken, 'viardot', gameInfo.idGame);
    const game = await getGame(sebToken, gameInfo.idGame);
    expect(game.started).toBe(true);
  });
});
