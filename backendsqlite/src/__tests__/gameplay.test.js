const app = require('../app');
const request = require('supertest');
const status = require('http-status');

/* eslint-env jest */

describe('full gameplay test', () => {
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

  test('creating 5 users ', async () => {
    await createUser('etienne');
    await createUser('juanpa');
    await createUser('imad');
    await createUser('nabil');
    await createUser('youssef');
  });

  const userInfo = {
    etienne: {},
    juanpa: {},
    imad: {},
    nabil: {},
    youssef: {}
  };
  test('getting tokens', async () => {
    userInfo.etienne.token = await getToken('etienne');
    userInfo.juanpa.token = await getToken('juanpa');
    userInfo.imad.token = await getToken('imad');
    userInfo.nabil.token = await getToken('nabil');
    userInfo.youssef.token = await getToken('youssef');
  });

  test('youssef creates a game', async () => {
    const currentDate = new Date();
    let startingDate = new Date(currentDate.getTime() + (60 * 60 * 1000));
    startingDate = startingDate.toISOString();
    const data = { dayDuration: 3, nightDuration: 2, startingDate };
    const response = await request(app)
      .post('/game')
      .set({ 'x-access-token': userInfo.youssef.token })
      .send({ data: JSON.stringify(data) });
    expect(response.body.message).toBe('game created');
    expect(response.statusCode).toBe(status.CREATED);
  });

  let gameInfo;
  test('getting game info', async () => {
    const response = await request(app)
      .get('/game')
      .set({ 'x-access-token': userInfo.youssef.token });
    expect(response.body.message).toBe('returning games in the data property');
    const games = JSON.parse(response.body.data);
    games.forEach((game) => {
      if (game.creatorUsername === 'youssef') {
        gameInfo = game;
      }
    });
  });

  async function joinGame (username, idGame) {
    const response = await request(app)
      .post(`/game/${idGame}`)
      .set({ 'x-access-token': userInfo[username].token });
    expect(response.body.message).toBe(`user: ${username} joined game with id: ${idGame}`);
    expect(response.statusCode).toBe(status.OK);
  }

  test('the 4 other users joins the game', async () => {
    const users = ['etienne', 'juanpa', 'imad', 'nabil'];
    users.forEach(async (user) => {
      await joinGame(user, gameInfo.idGame);
    });
  });

  test('youssef starts the game', async () => {
    jest.useFakeTimers();
    const response = await request(app)
      .post(`/game/${gameInfo.idGame}/play`)
      .set({ 'x-access-token': userInfo.youssef.token });
    expect(response.body.message).toBe('game started');
    expect(response.statusCode).toBe(status.CREATED);
  });

  const werewolfs = [];
  const humans = [];
  test('youssef starts the game', async () => {
    const response = await request(app)
      .get(`/game/${gameInfo.idGame}/play`)
      .set({ 'x-access-token': userInfo.youssef.token });
    expect(response.body.message).toBe('returning game state');
    const data = JSON.parse(response.body.data);
    data.players.forEach((player) => {
      if (player.role === 'human') humans.push(player.username);
      else werewolfs.push(player);
    });
  });

  async function getGameInfo () {
    const response = await request(app)
      .get(`/game/${gameInfo.idGame}/play`)
      .set({ 'x-access-token': userInfo.youssef.token });
    const data = JSON.parse(response.body.data);
    gameInfo.votes = data.votes;
    data.players.forEach((player) => {
      userInfo[player.username].idPlayer = player.idPlayer;
      userInfo[player.username].role = player.role;
      userInfo[player.username].state = player.state;
    });
  }
  test('getting game information', async () => {
    await getGameInfo();
  });

  async function voteFor (username, accusedUsername) {
    const response = await request(app)
      .post(`/game/${gameInfo.idGame}/vote`)
      .set({ 'x-access-token': userInfo[username].token })
      .send({ data: `{"accusedId": "${userInfo[accusedUsername].idPlayer}"}` });
    expect(response.body.message).toBe('Your vote has been recorded');
    expect(response.statusCode).toBe(status.CREATED);
  }

  test('youssef voting for imad', async () => {
    await voteFor('youssef', 'imad');
  });

  test('checking vote ', async () => {
    await getGameInfo();
    expect(gameInfo.votes).toEqual({
      imad: 1
    });
  });

  test('youssef chaging vote for juanpa', async () => {
    await voteFor('youssef', 'juanpa');
  });

  test('checking votes', async () => {
    await getGameInfo();
    expect(gameInfo.votes).toEqual({
      juanpa: 1
    });
  });

  test('2 more users voting for juanpa (should be validated)', async () => {
    await voteFor('juanpa', 'juanpa');
    await voteFor('etienne', 'juanpa');
  });

  test('checking votes', async () => {
    const response = await request(app)
      .get(`/game/${gameInfo.idGame}/play`)
      .set({ 'x-access-token': userInfo.youssef.token });
    const data = JSON.parse(response.body.data);
    expect(data.votes).toEqual({
      juanpa: 3
    });
  });

  test('youssef chaging vote for nabil (should fail)', async () => {
    const response = await request(app)
      .post(`/game/${gameInfo.idGame}/vote`)
      .set({ 'x-access-token': userInfo.youssef.token })
      .send({ data: `{"accusedId": "${userInfo.nabil.idPlayer}"}` });
    expect(response.body.message).toBe('You can\'t change your vote');
    expect(response.statusCode).toBe(status.BAD_REQUEST);
  });

  test('verifing game state', async () => {
    await getGameInfo();
    expect(userInfo.juanpa.state).toBe('alive');
  });

  test('verifing game state', async () => {
    jest.advanceTimersByTime(3 * 60 * 1000); // jumping to night
    await getGameInfo();
    await getGameInfo(); // making 2 times getgame info to let some time for async funcs to finish
    expect(userInfo.juanpa.state).toBe('dead');
    expect(gameInfo.votes).toEqual({}); //becase gameTime changed
  });
});
