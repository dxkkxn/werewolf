const app = require('../app');
const request = require('supertest');
const status = require('http-status');
const { createUser, getToken } = require('./helperFunctions.js');

/* eslint-env jest */

describe('full gameplay test', () => {
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
  test('getting the game info', async () => {
    const response = await request(app)
      .get(`/game/${gameInfo.idGame}/play`)
      .set({ 'x-access-token': userInfo.youssef.token });
    expect(response.body.message).toBe('returning game state');
    const data = JSON.parse(response.body.data);
    data.players.forEach((player) => {
      if (player.role === 'human') humans.push(player.username);
      else werewolfs.push(player.username);
    });
    expect(werewolfs).toHaveLength(2);
    expect(humans).toHaveLength(3);
  });

  async function getGameInfo (username = 'youssef') {
    const response = await request(app)
      .get(`/game/${gameInfo.idGame}/play`)
      .set({ 'x-access-token': userInfo[username].token });
    const data = JSON.parse(response.body.data);
    gameInfo.votes = data.votes;
    gameInfo.messages = data.messages;
    gameInfo.gameHour = data.gameHour;
    gameInfo.gameEnded = data.gameEnded;
    data.players.forEach((player) => {
      userInfo[player.username].idPlayer = player.idPlayer;
      userInfo[player.username].role = player.role;
      userInfo[player.username].state = player.state;
    });
  }
  test('getting game information', async () => {
    await getGameInfo('youssef');
  });

  async function voteFor (username, accusedUsername) {
    const response = await request(app)
      .post(`/game/${gameInfo.idGame}/vote`)
      .set({ 'x-access-token': userInfo[username].token })
      .send({ data: `{"accusedId": "${userInfo[accusedUsername].idPlayer}"}` });
    expect(response.body.message).toBe('Your vote has been recorded');
    expect(response.statusCode).toBe(status.CREATED);
  }

  async function sendMessage (username, message) {
    const response = await request(app)
      .post(`/game/${gameInfo.idGame}/message`)
      .set({ 'x-access-token': userInfo[username].token })
      .send({ data: `{"message": "${message}"}` });
    expect(response.body.message).toBe('message sent');
    expect(response.statusCode).toBe(status.CREATED);
  }

  // async function getMessages (username) {
  //   const response = await request(app)
  //     .get(`/game/${gameInfo.idGame}/message`)
  //     .set({ 'x-access-token': userInfo[username].token })
  //   return response;
  // }

  test('youssef voting for imad', async () => {
    await voteFor('youssef', 'imad');
    await sendMessage('youssef', 'i vote for imad');
  });

  test('checking game state', async () => {
    await getGameInfo();
    expect(gameInfo.votes).toEqual({
      imad: 1
    });
  });

  test('youssef chaging vote for human 0', async () => {
    await voteFor('youssef', humans[0]);
    await sendMessage('youssef', `i vote for ${humans[0]}`);
  });

  test('checking votes', async () => {
    await getGameInfo();
    const expected = {};
    expected[humans[0]] = 1;
    expect(gameInfo.votes).toEqual(expected);
  });

  test('2 more users voting for human 0 (should be validated)', async () => {
    await voteFor('etienne', humans[0]);
    await voteFor('juanpa', humans[0]);
  });

  test('checking votes', async () => {
    const response = await request(app)
      .get(`/game/${gameInfo.idGame}/play`)
      .set({ 'x-access-token': userInfo.youssef.token });
    const data = JSON.parse(response.body.data);
    const expected = {};
    expected[humans[0]] = 3;
    expect(data.votes).toEqual(expected);
  });

  test('youssef changing vote for human 1 (should fail)', async () => {
    const response = await request(app)
      .post(`/game/${gameInfo.idGame}/vote`)
      .set({ 'x-access-token': userInfo.youssef.token })
      .send({ data: `{"accusedId": "${userInfo[humans[0]].idPlayer}"}` });
    expect(response.body.message).toBe('You can\'t change your vote');
    expect(response.statusCode).toBe(status.BAD_REQUEST);
  });

  test('verifing game state', async () => {
    await getGameInfo('youssef');
    expect(userInfo[humans[0]].state).toBe('alive');
    expect(gameInfo.messages).toHaveLength(2);
    expect(gameInfo.messages[0].body).toBe('i vote for imad');
    expect(gameInfo.messages[0].current).toBe(true);
    expect(gameInfo.messages[0].gameTime).toBe('day');
    expect(gameInfo.messages[0].username).toBe('youssef');
    expect(gameInfo.messages[1].body).toBe(`i vote for ${humans[0]}`);
    expect(gameInfo.messages[1].current).toBe(true);
    expect(gameInfo.messages[1].gameTime).toBe('day');
    expect(gameInfo.messages[1].username).toBe('youssef');
  });

  test('verifing game state', async () => {
    jest.advanceTimersByTime(3 * 60 * 1000); // jumping to night
    await getGameInfo();
    await getGameInfo(werewolfs[0]); // making 2 times getgame info to let some time for async funcs to finish
    expect(userInfo[humans[0]].state).toBe('dead');
    expect(gameInfo.votes).toEqual({}); // becase gameTime changed
    expect(gameInfo.messages).toEqual([]); // becase gameTime changed
    await getGameInfo(humans[0]);
    expect(userInfo[humans[0]].state).toBe('dead');
    expect(gameInfo.votes).toEqual({}); // becase humans cannot acceed to werewolfs votes
    expect(gameInfo.messages).toEqual([]); // becase humans cannot acces to messages of werewolfs
  });

  test('voting for dead player ', async () => {
    const response = await request(app)
      .post(`/game/${gameInfo.idGame}/vote`)
      .set({ 'x-access-token': userInfo[werewolfs[0]].token })
      .send({ data: `{"accusedId": "${userInfo[humans[0]].idPlayer}"}` });
    expect(response.body.message).toBe('Player is already dead');
    expect(response.statusCode).toBe(status.BAD_REQUEST);
  });

  test('werewolfs conversation', async () => {
    await sendMessage(werewolfs[0], 'im the 1st werewolf');
    await sendMessage(werewolfs[1], 'im the 2nd werewolf');
    await getGameInfo(werewolfs[0]);
    expect(gameInfo.messages).toHaveLength(2);
    expect(gameInfo.messages[0].body).toBe('im the 1st werewolf');
    expect(gameInfo.messages[0].current).toBe(true);
    expect(gameInfo.messages[0].gameTime).toBe('night');
    expect(gameInfo.messages[0].username).toBe(werewolfs[0]);
    expect(gameInfo.messages[1].body).toBe('im the 2nd werewolf');
    expect(gameInfo.messages[1].current).toBe(true);
    expect(gameInfo.messages[1].gameTime).toBe('night');
    expect(gameInfo.messages[1].username).toBe(werewolfs[1]);
  });

  test('check humans have not access werewolfs messages', async () => {
    await getGameInfo(humans[1]); // human 0 is dead
    expect(userInfo[humans[0]].state).toBe('dead');
    expect(gameInfo.votes).toEqual({}); // because humans cannot acceed to werewolfs votes
    expect(gameInfo.messages).toEqual([]);// because humans cannot acces to messages of werewolfs
  });

  test('check dead user have access werewolfs messages', async () => {
    await getGameInfo(humans[0]);
    expect(gameInfo.messages).toHaveLength(2);
    expect(gameInfo.messages[0].body).toBe('im the 1st werewolf');
    expect(gameInfo.messages[0].current).toBe(true);
    expect(gameInfo.messages[0].gameTime).toBe('night');
    expect(gameInfo.messages[0].username).toBe(werewolfs[0]);
    expect(gameInfo.messages[1].body).toBe('im the 2nd werewolf');
    expect(gameInfo.messages[1].current).toBe(true);
    expect(gameInfo.messages[1].gameTime).toBe('night');
    expect(gameInfo.messages[1].username).toBe(werewolfs[1]);
  });

  test('werewolfs killing human 1', async () => {
    await voteFor(werewolfs[0], humans[1]);
    await voteFor(werewolfs[1], humans[1]);
    await getGameInfo(werewolfs[0]);
  });

  test('checking human is dead', async () => {
    jest.advanceTimersByTime(2 * 60 * 1000); // jumping to day
    await getGameInfo(humans[0]);
    await getGameInfo(humans[0]); // 2 calls bc of async nature of timeout
    expect(userInfo[humans[1]].state).toBe('dead');
  });

  test('werewolfs vote human 2', async () => {
    await voteFor(werewolfs[0], humans[2]);
    await voteFor(werewolfs[1], humans[2]);
  });

  test('werewolfs won', async () => {
    jest.advanceTimersByTime(3 * 60 * 1000); // jumping to night
    await getGameInfo(humans[0]);
    await getGameInfo(humans[0]); // 2 calls bc of async nature of timeout
    humans.forEach((human) => {
      expect(userInfo[human].state).toBe('dead');
    });
    expect(gameInfo.gameEnded).toBe(true);
  });
});
