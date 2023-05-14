const app = require('../app');
const request = require('supertest');
const status = require('http-status');
const { createUser, getToken, getAllGames } = require('./helperFunctions.js');

/* eslint-env jest */

describe('testing the start of game ', () => {
  let sebToken;
  let viarToken;
  test('creating user seb', async () => {
    createUser('seb');
    sebToken = getToken('seb');
  });

  test('creating user viardot', async () => {
    createUser('viardot');
    viarToken = getToken('viardot');
  });

  // test('seb creates a game', async () => {
  //   const currentDate = new Date();
  //   let startingDate = new Date(currentDate.getTime() + (60 * 60 * 1000));
  //   startingDate = startingDate.toISOString();
  //   const data = { dayDuration: 3, nightDuration: 2, startingDate };
  //   const response = await request(app)
  //     .post('/game')
  //     .set({ 'x-access-token': userInfo.youssef.token })
  //     .send({ data: JSON.stringify(data) });
  //   expect(response.body.message).toBe('game created');
  //   expect(response.statusCode).toBe(status.CREATED);
  // });
});
