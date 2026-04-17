const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Player = require('../models/Player');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');
const { generateUniquePlayerId } = require('../utils/playerId');

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/multisport');
    console.log('MongoDB Connected for seeding');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const usersData = [
  {
    name: 'Admin User',
    email: 'admin@multisport.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    name: 'Tournament Organizer',
    email: 'organizer@multisport.com',
    password: 'organizer123',
    role: 'organizer'
  },
  {
    name: 'Player One',
    email: 'scorer@multisport.com',
    password: 'scorer123',
    role: 'player'
  },
  {
    name: 'Cricket Player',
    email: 'cricket@multisport.com',
    password: 'player123',
    role: 'player'
  },
  {
    name: 'Football Player',
    email: 'football@multisport.com',
    password: 'player123',
    role: 'player'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Player.deleteMany({});
    await Team.deleteMany({});
    await Tournament.deleteMany({});
    await Match.deleteMany({});

    console.log('Cleared existing data');

    // Create users and player profiles
    const users = [];
    const players = [];
    for (const userData of usersData) {
      const playerId = userData.role === 'player' ? await generateUniquePlayerId() : undefined;
      const user = new User({
        ...userData,
        playerId,
      });
      users.push(await user.save());

      if (user.role === 'player') {
        players.push(await Player.create({
          userId: user._id,
          playerId,
          displayName: user.name,
          sportPreferences: ['cricket', 'football'],
        }));
      }
    }
    console.log(`Created ${users.length} users`);
    console.log(`Created ${players.length} player profiles`);

    const organizer = users.find((user) => user.role === 'organizer');
    const tournament = await Tournament.create({
      name: 'Premier League 2026',
      sport: 'football',
      organizerId: organizer._id,
      status: 'ongoing',
      teams: [],
      matches: [],
    });
    console.log('Created 1 tournament');

    const teams = await Team.insertMany([
      { name: 'Manchester United', sport: 'football', tournamentId: tournament._id, createdBy: organizer._id, players: [players[0]._id] },
      { name: 'Liverpool FC', sport: 'football', tournamentId: tournament._id, createdBy: organizer._id, players: [players[1]._id] },
    ]);

    await Player.updateOne({ _id: players[0]._id }, { $addToSet: { teams: teams[0]._id } });
    await Player.updateOne({ _id: players[1]._id }, { $addToSet: { teams: teams[1]._id } });
    await Tournament.updateOne({ _id: tournament._id }, { $set: { teams: teams.map((team) => team._id) } });
    console.log(`Created ${teams.length} teams`);

    // Create some sample matches
    const matches = await Match.insertMany([{
      tournamentId: tournament._id,
      homeTeamId: teams[0]._id,
      awayTeamId: teams[1]._id,
      playersInvolved: [
        { playerId: players[0]._id, teamId: teams[0]._id, role: 'forward' },
        { playerId: players[1]._id, teamId: teams[1]._id, role: 'forward' },
      ],
      scoringFeed: [],
      result: {},
      scheduledAt: new Date(),
      status: 'live',
    }]);
    await Tournament.updateOne({ _id: tournament._id }, { $set: { matches: matches.map((match) => match._id) } });
    console.log(`Created ${matches.length} matches`);

    console.log('Database seeding completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@multisport.com / admin123');
    console.log('Organizer: organizer@multisport.com / organizer123');
    console.log('Player: scorer@multisport.com / scorer123');
    console.log('Player: cricket@multisport.com / player123');

  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDB disconnected');
  }
};

// Run seeding
if (require.main === module) {
  connectDB().then(() => {
    seedDatabase();
  });
}

module.exports = { seedDatabase }; 