require('dotenv').config();

const { connectDB, sequelize } = require('../config/database');
const {
  User, Player, Team, Tournament, Match, PlayersInMatch,
} = require('../models');
const { generateUniquePlayerId } = require('../utils/playerId');

const usersData = [
  { name: 'Admin User', email: 'admin@multisport.com', password: 'admin123', role: 'admin' },
  { name: 'Tournament Organizer', email: 'organizer@multisport.com', password: 'organizer123', role: 'organizer' },
  { name: 'Player One', email: 'scorer@multisport.com', password: 'scorer123', role: 'player' },
  { name: 'Cricket Player', email: 'cricket@multisport.com', password: 'player123', role: 'player' },
  { name: 'Football Player', email: 'football@multisport.com', password: 'player123', role: 'player' },
];

const seedDatabase = async () => {
  try {
    await connectDB();
    await sequelize.sync({ force: true });

    const users = [];
    const players = [];
    for (const userData of usersData) {
      const playerId = userData.role === 'player' ? await generateUniquePlayerId() : undefined;
      const user = await User.create({ ...userData, playerId });
      users.push(user);
      if (user.role === 'player') {
        players.push(await Player.create({
          userId: user.id,
          playerId,
          displayName: user.name,
          sportPreferences: ['cricket', 'football'],
        }));
      }
    }

    const organizer = users.find((user) => user.role === 'organizer');
    const tournament = await Tournament.create({
      name: 'Premier League 2026',
      sport: 'football',
      organizerId: organizer.id,
      status: 'ongoing',
    });

    const teamA = await Team.create({
      name: 'Manchester United', sport: 'football', tournamentId: tournament.id, createdBy: organizer.id,
    });
    const teamB = await Team.create({
      name: 'Liverpool FC', sport: 'football', tournamentId: tournament.id, createdBy: organizer.id,
    });
    await teamA.addPlayer(players[0]);
    await teamB.addPlayer(players[1]);

    const match = await Match.create({
      tournamentId: tournament.id,
      sportKey: tournament.sport,
      homeTeamId: teamA.id,
      awayTeamId: teamB.id,
      scheduledAt: new Date(),
      status: 'live',
      result: {},
    });
    await PlayersInMatch.bulkCreate([
      { matchId: match.id, playerId: players[0].id, teamId: teamA.id, role: 'forward' },
      { matchId: match.id, playerId: players[1].id, teamId: teamB.id, role: 'forward' },
    ]);
  } catch (error) {
    console.error('Seeding error:', error);
  } finally {
    await sequelize.close();
  }
};

if (require.main === module) seedDatabase();

module.exports = { seedDatabase };
