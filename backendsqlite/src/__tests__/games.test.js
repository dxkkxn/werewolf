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

let startingDate;
describe('create game', () => {
  // get starting date in the good format
  const currentDate = new Date();
  startingDate = new Date(currentDate.getTime() + (60 * 60 * 1000));
  startingDate = startingDate.toISOString();
  // startingDate = dateOneHourLater.toISOString().slice(0, 19).replace('T', ' ');
  test('no body', async () => {
    const response = await request(app)
      .post('/game')
      .set({ 'x-access-token': token });
    expect(response.statusCode).toBe(status.BAD_REQUEST);
    expect(response.body.message).toBe('You must include a data property in the request body');
  });
  test('not passed required properties', async () => {
    const response = await request(app)
      .post('/game')
      .set({ 'x-access-token': token })
      .send({ data: '{}' });
    expect(response.statusCode).toBe(status.BAD_REQUEST);
    const notFoundAttrs = ['dayDuration', 'nightDuration', 'startingDate'];
    expect(response.body.message).toBe(`needed attributes: [${notFoundAttrs}] where not found`);
  });
  test('creating a normal game', async () => {
    const data = { dayDuration: 3, nightDuration: 2, startingDate };
    const response = await request(app)
      .post('/game')
      .set({ 'x-access-token': token })
      .send({ data: JSON.stringify(data) });
    expect(response.body.message).toBe('game created');
    expect(response.statusCode).toBe(status.CREATED);
  });

  test('trying to create another game with same user (should fail)', async () => {
    const data = { dayDuration: 3, nightDuration: 2, startingDate };
    const response = await request(app)
      .post('/game')
      .set({ 'x-access-token': token })
      .send({ data: JSON.stringify(data) });
    expect(response.statusCode).toBe(status.FORBIDDEN);
    expect(response.body.message).toBe('user: testGame already in game with id: 1');
  });
});

describe('get games', () => {
  test('getting all existing games', async () => {
    const response = await request(app)
      .get('/game')
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('returning games in the data property');
    const data = JSON.parse(response.body.data);
    let gameInfo;
    data.forEach((game) => {
      if (game.creatorUsername === 'testGame') {
        gameInfo = game;
      }
    });
    expect(gameInfo).toEqual({
      avatarId: 1,
      idGame: 1,
      minPlayers: 5,
      maxPlayers: 20,
      dayDuration: 3,
      nightDuration: 2,
      werewolfProbability: 0.33,
      seerProba: 0,
      infectionProba: 0,
      spiritismProba: 0,
      insomniaProba: 0,
      creatorUsername: 'testGame',
      players: ['testGame'],
      started: false,
      startingDate,
      gameTime: null
    });
    expect(response.statusCode).toBe(status.OK);
  });
});

let token2;
describe('create test user 2 for this module', () => {
  test('create testGame2 user', async () => {
    const response = await request(app)
      .post('/signin')
      .send({ data: '{"username": "testGame2", "password": "1234"}' });
    expect(response.statusCode).toBe(status.CREATED);
    expect(response.body.message).toBe('user added');
  });
  test('login test user', async () => {
    const response = await request(app)
      .post('/login')
      .send({ data: '{"username": "testGame2", "password": "1234"}' });
    token2 = response.body.token;
    expect(response.body.message).toBe('logged succesfully');
    expect(token).toBeDefined();
    expect(response.statusCode).toBe(status.OK);
  });
});

describe('join game', () => {
  test('testGame2 joins game 1 created by testgame', async () => {
    const response = await request(app)
      .post('/game/1')
      .set({ 'x-access-token': token2 });
    expect(response.body.message).toBe('user: testGame2 joined game with id: 1');
    expect(response.statusCode).toBe(status.OK);
  });
  test('verif testGame2 is a player of game 1', async () => {
    const response = await request(app)
      .get('/game')
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('returning games in the data property');
    const data = JSON.parse(response.body.data);
    let gameInfo;
    data.forEach((game) => {
      if (game.creatorUsername === 'testGame') {
        gameInfo = game;
      }
    });
    expect(gameInfo).toEqual({
      avatarId: 1,
      idGame: 1,
      minPlayers: 5,
      maxPlayers: 20,
      dayDuration: 3,
      nightDuration: 2,
      werewolfProbability: 0.33,
      creatorUsername: 'testGame',
      players: ['testGame', 'testGame2'],
      started: false,
      seerProba: 0,
      infectionProba: 0,
      spiritismProba: 0,
      insomniaProba: 0,
      startingDate,
      gameTime: null
    });
    expect(response.statusCode).toBe(status.OK);
  });

  test('verif testGame2 is a player of game 1 with get with id', async () => {
    const response = await request(app)
      .get('/game/1')
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('returning game in the data property');
    const data = JSON.parse(response.body.data);
    expect(data).toEqual({
      idGame: 1,
      minPlayers: 5,
      maxPlayers: 20,
      dayDuration: 3,
      nightDuration: 2,
      werewolfProbability: 0.33,
      creatorUsername: 'testGame',
      players: ['testGame', 'testGame2'],
      started: false,
      startingDate,
      gameTime: null
    });
    expect(response.statusCode).toBe(status.OK);
  });

  test('testGame2 joins again game 1 created by testgame', async () => {
    const response = await request(app)
      .post('/game/1')
      .set({ 'x-access-token': token2 });
    expect(response.body.message).toBe('user: testGame2 already in game with id: 1');
    expect(response.statusCode).toBe(status.FORBIDDEN);
  });
});

let werewolfToken;
let humanToken;

describe('starting game', () => {
  test('testGame2 tries to start game', async () => {
    const response = await request(app)
      .post('/game/1/play')
      .set({ 'x-access-token': token2 });
    expect(response.statusCode).toBe(status.BAD_REQUEST);
    expect(response.body.message).toBe('You can\'t start the game because you are not the creator');
  });

  test('get state in game not started', async () => {
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': token });
    expect(response.statusCode).toBe(status.BAD_REQUEST);
    expect(response.body.message).toBe('You can\'t get game state because the game didn\'t start');
  });

  test('get state in game not started', async () => {
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': token2 });
    expect(response.statusCode).toBe(status.BAD_REQUEST);
    expect(response.body.message).toBe('You can\'t get game state because the game didn\'t start');
  });

  test('testGame starts game', async () => {
    jest.useFakeTimers();
    const response = await request(app)
      .post('/game/1/play')
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('game started');
    expect(response.statusCode).toBe(status.CREATED);
  });

  test('checking game started correctly', async () => {
    const response = await request(app)
      .get('/game/1')
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('returning game in the data property');
    const data = JSON.parse(response.body.data);
    expect(data.startingDate).toBeDefined();
    // we remove staringDate because we cant check with high precision the date of start
    delete data.startingDate;
    expect(data).toEqual({
      idGame: 1,
      minPlayers: 5,
      maxPlayers: 20,
      dayDuration: 3,
      nightDuration: 2,
      werewolfProbability: 0.33,
      creatorUsername: 'testGame',
      players: ['testGame', 'testGame2'],
      started: true,
      gameTime: 'day'
    });
    expect(response.statusCode).toBe(status.OK);
  });

  const expectedData = ['idPlayer', 'username', 'role', 'state'];

  test('get state of players', async () => {
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': token2 });
    expect(response.body.message).toBe('returning game state');
    const data = JSON.parse(response.body.data);

    const players = data.players;
    players.forEach((player) => {
      expectedData.forEach((data) => {
        expect(player[data]).toBeDefined();
      });
      // getting roles for future tests
      if (player.username === 'testGame') {
        if (player.role === 'werewolf') {
          werewolfToken = token;
          humanToken = token2;
        } else {
          werewolfToken = token2;
          humanToken = token;
        }
      }
    });

    expect(response.statusCode).toBe(status.OK);
  });

  test('get state of players', async () => {
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('returning game state');
    const data = JSON.parse(response.body.data);
    const players = data.players;
    players.forEach((player) => {
      expectedData.forEach((data) => {
        expect(player[data]).toBeDefined();
      });
    });

    expect(response.statusCode).toBe(status.OK);
  });

  test('checking if gameTime changes correctly (day->night)', async () => {
    jest.advanceTimersByTime(3 * 60 * 1000);
    const response = await request(app)
      .get('/game/1')
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('returning game in the data property');
    const data = JSON.parse(response.body.data);
    expect(data.started).toBe(true);
    expect(data.gameTime).toBe('night');
  });

  test('checking if gameTime changes correctly (night->day)', async () => {
    // new change to be 100% sure
    jest.advanceTimersByTime(2 * 60 * 1000);
    const response = await request(app)
      .get('/game/1')
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('returning game in the data property');
    const data = JSON.parse(response.body.data);
    expect(data.started).toBe(true);
    expect(data.gameTime).toBe('day');
  });

  test('checking virtual timer aka game time aka game hour (hh:mm) during day', async () => {
    // new change to be 100% sure
    jest.advanceTimersByTime(1.5 * 60 * 1000);
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('returning game state');
    const data = JSON.parse(response.body.data);
    expect(data.gameHour).toBe('15:00');
  });
  test('checking virtual timer aka game time aka game hour (hh:mm) during night', async () => {
    // new change to be 100% sure
    jest.advanceTimersByTime(1.5 * 60 * 1000);
    jest.advanceTimersByTime(60 * 1000);
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': token });
    expect(response.body.message).toBe('returning game state');
    const data = JSON.parse(response.body.data);
    expect(data.gameHour).toBe('05:00');
    // jest.useRealTimers();
  });
});

describe('messages testing', () => {
  test('sending message', async () => {
    jest.advanceTimersByTime(60 * 1000);
    const response = await request(app)
      .post('/game/1/message')
      .set({ 'x-access-token': token })
      .send({ data: '{"message": "hello testGame2"}' });
    expect(response.body.message).toBe('message sent');
    expect(response.statusCode).toBe(status.CREATED);
  });

  test('receiving messages', async () => {
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': token2 });
    expect(response.body.message).toBe('returning game state');
    const data = JSON.parse(response.body.data);
    expect(data.messages).toHaveLength(1);
    expect(data.messages[0].body).toBe('hello testGame2');
    expect(data.messages[0].username).toBe('testGame');
    expect(response.statusCode).toBe(status.OK);
  });

  // // jest.advanceTimersByTime(60 * 1000);
  test('checking that humans cannot send messages during night', async () => {
    jest.advanceTimersByTime(3 * 60 * 1000);
    const response = await request(app)
      .post('/game/1/message')
      .set({ 'x-access-token': humanToken })
      .send({ data: '{"message": "i see u werewolf"}' });
    expect(response.body.message).toBe('Humans cannot send messages or vote during night');
    expect(response.statusCode).toBe(status.FORBIDDEN);
  });

  test('werewolf sending message during night', async () => {
    const response = await request(app)
      .post('/game/1/message')
      .set({ 'x-access-token': werewolfToken })
      .send({ data: '{"message": "i\' m a werewolf"}' });
    expect(response.body.message).toBe('message sent');
    expect(response.statusCode).toBe(status.CREATED);
  });

  test('werewolf receving his message', async () => {
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': werewolfToken });
    expect(response.body.message).toBe('returning game state');
    const data = JSON.parse(response.body.data);
    expect(data.messages).toHaveLength(1);
    expect(data.messages[0].body).toBe('i\' m a werewolf');
    expect(response.statusCode).toBe(status.OK);
  });

  test('human trying to get messages during night', async () => {
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': humanToken });
    expect(response.body.message).toBe('returning game state');
    const data = JSON.parse(response.body.data);
    expect(data.messages).toHaveLength(0);
    expect(response.statusCode).toBe(status.OK);
  });
  // jest

    // jest.useRealTimers();
});

describe('voting testing', () => {
  test('error no data', async () => {
    jest.useFakeTimers();
    jest.advanceTimersByTime(2 * 60 * 1000); //jump to day
    const response = await request(app)
      .post('/game/1/vote')
      .set({ 'x-access-token': humanToken });
    expect(response.body.message).toBe('You must include a data property in the request body');
    expect(response.statusCode).toBe(status.BAD_REQUEST);
  });

  test('error forgot accusedId in date', async () => {
    const response = await request(app)
      .post('/game/1/vote')
      .set({ 'x-access-token': humanToken })
      .send({ data: '{}' });
    expect(response.body.message).toBe('You need to specify the accusedId');
    expect(response.statusCode).toBe(status.BAD_REQUEST);
  });

  test('voting for unknown player', async () => {
    const response = await request(app)
      .post('/game/1/vote')
      .set({ 'x-access-token': humanToken })
      .send({ data: '{"accusedId": "100"}' });
    expect(response.body.message).toBe('Unknown player');
    expect(response.statusCode).toBe(status.BAD_REQUEST);
  });

  test('human votes for player with id 1', async () => {
    const response = await request(app)
      .post('/game/1/vote')
      .set({ 'x-access-token': humanToken })
      .send({ data: '{"accusedId": "1"}' });
    expect(response.body.message).toBe('Your vote has been recorded');
    expect(response.statusCode).toBe(status.CREATED);
  });

  test('checking if we get the opened vote', async () => {
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': token });
    const data = JSON.parse(response.body.data);
    expect(data.votes).toBeDefined();
  });

  test('werewolf sucicides', async () => {
    const response = await request(app)
      .post('/game/1/vote')
      .set({ 'x-access-token': werewolfToken })
      .send({ data: '{"accusedId": "1"}' });
    expect(response.body.message).toBe('Your vote has been recorded');
    expect(response.statusCode).toBe(status.CREATED);
  });

  test('checking the opened vote', async () => {
    const response = await request(app)
      .get('/game/1/play')
      .set({ 'x-access-token': token });
    const data = JSON.parse(response.body.data);
    expect(data.votes).toBeDefined();
    // expect(data.votes.testGame).toBe(2);
  });


});
