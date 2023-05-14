const app = require('../app');
const request = require('supertest');
const status = require('http-status');

/* eslint-env jest */
async function createUser (username) {
  const response = await request(app)
    .post('/signin')
    .send({ data: `{"username": "${username}", "password": "1234"}` });

  expect(response.statusCode).toBe(status.CREATED);
  expect(response.body.message).toBe('user added');
}

async function getToken (username) {
  const response = await request(app)
    .post('/login')
    .send({ data: `{"username": "${username}", "password": "1234"}` });
  const token = response.body.token;
  expect(response.statusCode).toBe(status.OK);
  expect(response.body.message).toBe('logged succesfully');
  expect(token).toBeDefined();
  return token;
}

async function getAllGames (token) {
  const response = await request(app)
    .get('/game')
    .set({ 'x-access-token': token });
  expect(response.body.message).toBe('returning games in the data property');
  const games = JSON.parse(response.body.data);
  return games;
}

module.exports = {
  createUser,
  getToken,
  getAllGames
};

test('helper', async () => { // added this to make pipeline not fail
});
