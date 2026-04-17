const User = require('../models/User');
const Player = require('../models/Player');

const randomDigits = (length = 5) => Math.floor(Math.random() * (10 ** length)).toString().padStart(length, '0');

const generatePlayerIdCandidate = () => `PLY${randomDigits(5)}`;

const generateUniquePlayerId = async () => {
  let attempts = 0;

  while (attempts < 20) {
    const playerId = generatePlayerIdCandidate();
    const [userExists, playerExists] = await Promise.all([
      User.exists({ playerId }),
      Player.exists({ playerId }),
    ]);

    if (!userExists && !playerExists) {
      return playerId;
    }

    attempts += 1;
  }

  throw new Error('Failed to generate a unique playerId');
};

module.exports = {
  generateUniquePlayerId,
};
