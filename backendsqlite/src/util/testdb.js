const userModel = require('../models/users.js');
const gameModel = require('../models/games.js');
const powerModel = require('../models/powers.js');
const playerModel = require('../models/players.js');
const powersProbabilityModel = require('../models/powersProbabilities.js');
const playerInGameModel = require('../models/playersInGame.js');
const playersPowers = require('../models/playersPowers.js');
const messages = require('../models/messages.js');
const votes = require('../models/votes.js');
// const playersPowersModel = require('../models/playersPowers.js');
const validator = require('validator');
const bcrypt = require('bcrypt');
// const tagsModel = require('../models/tags.js');
// const bcrypt = require('bcrypt');
// Ajouter ici les nouveaux require des nouveaux modèles

// eslint-disable-next-line no-unexpected-multiline
(async () => {
  // Regénère la base de données
  await require('../models/database.js').sync({ force: true });
  // Initialise la base avec quelques données
  // console.log(passhash)
  // await userModel.create({
  //   name: 'Sebastien Viardot', email: 'Sebastien.Viardot@grenoble-inp.fr', passhash
  // })
  // // Ajouter ici le code permettant d'initialiser par défaut la base de donnée
  // const essalihn = await userModel.create({ username: 'essalihn' });
  // await userModel.create({ username: 'pradamej' });
  // await tagsModel.create({ name: 'Javascript', userId: essalihn.id });
  //

  try {
    const options = {
      minLength: 8, // Minimum password length (default: 8)
      minLowercase: 1, // Minimum number of lowercase letters (default: 1)
      minUppercase: 1, // Minimum number of uppercase letters (default: 1)
      minNumbers: 1, // Minimum number of numeric digits (default: 1)
      minSymbols: 1, // Minimum number of special characters (default: 1)
      // returnScore: false, // Whether to return the password strength score (default: false)
      // pointsPerUnique: 1, // Number of points for each unique character in the password (default: 1)
      // pointsPerRepeat: 0.5, // Number of points for each repeated character in the password (default: 0.5)
      // pointsForContaining: {
      //   // Extra points for containing certain character types (default: {})
      //   digits: 1, // Points for containing numeric digits
      //   letters: 1, // Points for containing letters
      //   lowercase: 0, // Points for containing lowercase letters
      //   uppercase: 0, // Points for containing uppercase letters
      //   symbols: 1, // Points for containing special characters
      // },
    };
    // create 10 users
    for (let i = 0; i < 5; i++) {
      const password = 'Robin777@';
      const isValidPassword = validator.isStrongPassword(password, options);
      if (isValidPassword) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await userModel.create({
          username: `user${i+1}`,
          password: hashedPassword,
          avatarId: `${12-i}`,
        });
      }
    }
    // user 5 creates game with defalut values except probas = 0.5
    const currentDate = new Date();
    const dateOneHourLater = new Date(currentDate.getTime() + (60 * 60 * 1000));
    const startingDate = dateOneHourLater//.toISOString().slice(0, 19).replace('T', ' ');
    await gameModel.create({
      creatorUsername: 'user5',
      dayDuration: 1,
      nightDuration: 1,
      startingDate
    });
    // ici on triche un peu : on sait que idGame = 0
    // les  10 users rejoignent la partie
    for (let i = 0; i < 5; i++) {
      await playerModel.create({
        idGame: '1',
        username: `user${i + 1}`
      });
    }
    // now user 5 can start
    const powers = ['contaminant', 'insomniaque', 'voyant', 'spiritiste'];
    powers.forEach(async (power) => await powerModel.create({ name: power }));
  } catch (error) { console.log(error); }
  // const data = await powerModel.findAll();
  // console.log(data);
})();
