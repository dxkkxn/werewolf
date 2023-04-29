const app = require('../app');
const request = require('supertest');
const status = require('http-status');

/* eslint-env jest */
let token;
describe('create test user for this module', () => {
  test('create testGame user', async () => {
    const response = await request(app)
      .post('/signin')
      .send({ data: '{"username": "testGame", "password": "1234"}' });
    expect(response.statusCode).toBe(status.CREATED);
    expect(response.body.message).toBe('user added');
  });
  test('login test user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ data: '{"username": "testGame", "password": "1234"}' });
    token = response.body.token;
    expect(response.statusCode).toBe(status.OK);
    expect(response.body.message).toBe('logged succesfully');
    expect(token).toBeDefined();
  });
});

describe('create game', () => {
  test('no body', async () => {
    const response = await request(app)
      .post('/testGame/game')
      .set({ 'x-access-token': token });
    expect(response.statusCode).toBe(status.BAD_REQUEST);
    expect(response.body.message).toBe('You must include a data property in the request body');
  });
  test('not passed required properties', async () => {
    const response = await request(app)
      .post('/testGame/game')
      .set({ 'x-access-token': token })
      .send({ data: '{}' });
    expect(response.statusCode).toBe(status.BAD_REQUEST);
    const notFoundAttrs = ['dayDuration', 'nightDuration'];
    expect(response.body.message).toBe(`needed attributes: [${notFoundAttrs}] where not found`);
  });
  test('creating a normal game', async () => {
    const data = {creatorUsername: 'testGame', dayDuration: 3, nightDuration: 2};
    const response = await request(app)
      .post('/testGame/game')
      .set({ 'x-access-token': token })
      .send({ data: JSON.stringify(data) });
    expect(response.statusCode).toBe(status.CREATED);
    // const notFoundAttrs = ['minPlayers', 'maxPlayers', 'dayDuration', 'nightDuration', 'werewolfProbability'];
    expect(response.body.message).toBe('game created');
  });
});

describe('get games', () => {
  test('getting all existing games', async () => {
    const response = await request(app)
      .get('/testGame/game')
      .set({ 'x-access-token': token });
    expect(response.statusCode).toBe(status.OK);
    expect(response.body.message).toBe('returning games in the data property');
    expect(response.body.data).toBe('[{"idGame":1,"minPlayers":5,"maxPlayers":20,"dayDuration":3,"nightDuration":2,"werewolfProbability":0.33,"creatorUsername":"testGame"}]');
  });
});
