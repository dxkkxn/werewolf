const app = require('../app');
const request = require('supertest');
const status = require('http-status');

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
  });
});
