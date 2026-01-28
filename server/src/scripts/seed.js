const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const SportRules = require('../models/SportRules');
const Team = require('../models/Team');
const Tournament = require('../models/Tournament');
const Match = require('../models/Match');

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

// Sport rules data
const sportRulesData = [
  {
    key: 'cricket',
    labels: {
      name: 'Cricket',
      shortName: 'CRI',
      description: 'Bat and ball team sport'
    },
    inputsSchema: {
      validEvents: ['ball', 'wicket', 'extra', 'over'],
      requiredFields: ['runs', 'ballType'],
      optionalFields: ['batsman', 'bowler', 'fielder', 'extraType']
    },
    scoringSchema: {
      primaryMetric: 'runs',
      secondaryMetrics: ['wickets', 'overs', 'extras'],
      timeFormat: 'overs',
      maxTime: 20
    },
    resultAlgoRef: 'cricket_standard',
    playerPointAlgoRef: 'cricket_fantasy',
    teamPointAlgoRef: 'cricket_team',
    tieBreakers: [
      { field: 'wickets', direction: 'desc', description: 'Wickets taken' },
      { field: 'runRate', direction: 'desc', description: 'Run rate' }
    ],
    uiHints: {
      primaryColor: '#ed7516',
      secondaryColor: '#f1943d',
      icon: '🏏',
      scoringInterface: 'ball-by-ball'
    }
  },
  {
    key: 'football',
    labels: {
      name: 'Football',
      shortName: 'FBL',
      description: 'Association football/soccer'
    },
    inputsSchema: {
      validEvents: ['goal', 'assist', 'card', 'substitution'],
      requiredFields: ['eventType', 'player'],
      optionalFields: ['minute', 'team', 'description']
    },
    scoringSchema: {
      primaryMetric: 'goals',
      secondaryMetrics: ['assists', 'cards', 'possession'],
      timeFormat: 'minutes',
      maxTime: 90
    },
    resultAlgoRef: 'football_standard',
    playerPointAlgoRef: 'football_fantasy',
    teamPointAlgoRef: 'football_team',
    tieBreakers: [
      { field: 'goalDifference', direction: 'desc', description: 'Goal difference' },
      { field: 'goalsFor', direction: 'desc', description: 'Goals scored' }
    ],
    uiHints: {
      primaryColor: '#0ea5e9',
      secondaryColor: '#38bdf8',
      icon: '⚽',
      scoringInterface: 'event-based'
    }
  },
  {
    key: 'basketball',
    labels: {
      name: 'Basketball',
      shortName: 'BSK',
      description: 'Team sport with hoops'
    },
    inputsSchema: {
      validEvents: ['point', 'rebound', 'assist', 'steal', 'block'],
      requiredFields: ['eventType', 'player'],
      optionalFields: ['quarter', 'time', 'team']
    },
    scoringSchema: {
      primaryMetric: 'points',
      secondaryMetrics: ['rebounds', 'assists', 'steals', 'blocks'],
      timeFormat: 'quarters',
      maxTime: 4
    },
    resultAlgoRef: 'basketball_standard',
    playerPointAlgoRef: 'basketball_fantasy',
    teamPointAlgoRef: 'basketball_team',
    tieBreakers: [
      { field: 'points', direction: 'desc', description: 'Total points' },
      { field: 'fieldGoalPercentage', direction: 'desc', description: 'Field goal %' }
    ],
    uiHints: {
      primaryColor: '#d946ef',
      secondaryColor: '#e879f9',
      icon: '🏀',
      scoringInterface: 'period-based'
    }
  },
  {
    key: 'tennis',
    labels: {
      name: 'Tennis',
      shortName: 'TNS',
      description: 'Racket sport with courts'
    },
    inputsSchema: {
      validEvents: ['point', 'game', 'set', 'ace', 'doubleFault'],
      requiredFields: ['eventType', 'player'],
      optionalFields: ['set', 'game', 'score']
    },
    scoringSchema: {
      primaryMetric: 'sets',
      secondaryMetrics: ['games', 'points', 'aces'],
      timeFormat: 'sets',
      maxTime: 3
    },
    resultAlgoRef: 'tennis_standard',
    playerPointAlgoRef: 'tennis_fantasy',
    teamPointAlgoRef: 'tennis_team',
    tieBreakers: [
      { field: 'sets', direction: 'desc', description: 'Sets won' },
      { field: 'games', direction: 'desc', description: 'Games won' }
    ],
    uiHints: {
      primaryColor: '#eab308',
      secondaryColor: '#facc15',
      icon: '🎾',
      scoringInterface: 'set-based'
    }
  },
  {
    key: 'badminton',
    labels: {
      name: 'Badminton',
      shortName: 'BDM',
      description: 'Racket sport with shuttlecock'
    },
    inputsSchema: {
      validEvents: ['point', 'game', 'set'],
      requiredFields: ['eventType', 'player'],
      optionalFields: ['set', 'game', 'score']
    },
    scoringSchema: {
      primaryMetric: 'sets',
      secondaryMetrics: ['games', 'points'],
      timeFormat: 'sets',
      maxTime: 3
    },
    resultAlgoRef: 'badminton_standard',
    playerPointAlgoRef: 'badminton_fantasy',
    teamPointAlgoRef: 'badminton_team',
    tieBreakers: [
      { field: 'sets', direction: 'desc', description: 'Sets won' },
      { field: 'games', direction: 'desc', description: 'Games won' }
    ],
    uiHints: {
      primaryColor: '#22c55e',
      secondaryColor: '#4ade80',
      icon: '🏸',
      scoringInterface: 'set-based'
    }
  },
  {
    key: 'volleyball',
    labels: {
      name: 'Volleyball',
      shortName: 'VBL',
      description: 'Team sport with net'
    },
    inputsSchema: {
      validEvents: ['point', 'set', 'serve', 'spike', 'block'],
      requiredFields: ['eventType', 'player'],
      optionalFields: ['set', 'team', 'description']
    },
    scoringSchema: {
      primaryMetric: 'sets',
      secondaryMetrics: ['points', 'aces', 'blocks'],
      timeFormat: 'sets',
      maxTime: 5
    },
    resultAlgoRef: 'volleyball_standard',
    playerPointAlgoRef: 'volleyball_fantasy',
    teamPointAlgoRef: 'volleyball_team',
    tieBreakers: [
      { field: 'sets', direction: 'desc', description: 'Sets won' },
      { field: 'points', direction: 'desc', description: 'Total points' }
    ],
    uiHints: {
      primaryColor: '#ef4444',
      secondaryColor: '#f87171',
      icon: '🏐',
      scoringInterface: 'set-based'
    }
  }
];

// Users data
const usersData = [
  {
    name: 'Admin User',
    email: 'admin@multisport.com',
    password: 'admin123',
    role: 'admin',
    sports: ['cricket', 'football', 'basketball', 'tennis', 'badminton', 'volleyball']
  },
  {
    name: 'Tournament Organizer',
    email: 'organizer@multisport.com',
    password: 'organizer123',
    role: 'organizer',
    sports: ['cricket', 'football']
  },
  {
    name: 'Match Scorer',
    email: 'scorer@multisport.com',
    password: 'scorer123',
    role: 'scorer',
    sports: ['cricket', 'basketball']
  },
  {
    name: 'Cricket Player',
    email: 'cricket@multisport.com',
    password: 'player123',
    role: 'player',
    sports: ['cricket']
  },
  {
    name: 'Football Player',
    email: 'football@multisport.com',
    password: 'player123',
    role: 'player',
    sports: ['football']
  }
];

// Teams data
const teamsData = [
  {
    name: 'Mumbai Indians',
    sportKey: 'cricket',
    location: 'Mumbai, India',
    logoUrl: 'https://via.placeholder.com/150x150/ed7516/ffffff?text=MI'
  },
  {
    name: 'Chennai Super Kings',
    sportKey: 'cricket',
    location: 'Chennai, India',
    logoUrl: 'https://via.placeholder.com/150x150/ed7516/ffffff?text=CSK'
  },
  {
    name: 'Manchester United',
    sportKey: 'football',
    location: 'Manchester, England',
    logoUrl: 'https://via.placeholder.com/150x150/0ea5e9/ffffff?text=MU'
  },
  {
    name: 'Liverpool FC',
    sportKey: 'football',
    location: 'Liverpool, England',
    logoUrl: 'https://via.placeholder.com/150x150/0ea5e9/ffffff?text=LFC'
  },
  {
    name: 'Los Angeles Lakers',
    sportKey: 'basketball',
    location: 'Los Angeles, USA',
    logoUrl: 'https://via.placeholder.com/150x150/d946ef/ffffff?text=LAL'
  },
  {
    name: 'Golden State Warriors',
    sportKey: 'basketball',
    location: 'San Francisco, USA',
    logoUrl: 'https://via.placeholder.com/150x150/d946ef/ffffff?text=GSW'
  }
];

// Tournaments data
const tournamentsData = [
  {
    name: 'IPL 2024',
    sportKey: 'cricket',
    type: 'league',
    season: '2024',
    location: 'India',
    startDate: new Date('2024-03-15'),
    endDate: new Date('2024-05-15'),
    status: 'ongoing'
  },
  {
    name: 'Premier League 2024',
    sportKey: 'football',
    type: 'league',
    season: '2024',
    location: 'England',
    startDate: new Date('2024-08-15'),
    endDate: new Date('2025-05-15'),
    status: 'ongoing'
  },
  {
    name: 'NBA Playoffs 2024',
    sportKey: 'basketball',
    type: 'knockout',
    season: '2024',
    location: 'USA',
    startDate: new Date('2024-04-15'),
    endDate: new Date('2024-06-15'),
    status: 'upcoming'
  }
];

// Seed function
const seedDatabase = async () => {
  try {
    console.log('Starting database seeding...');

    // Clear existing data
    await User.deleteMany({});
    await SportRules.deleteMany({});
    await Team.deleteMany({});
    await Tournament.deleteMany({});
    await Match.deleteMany({});

    console.log('Cleared existing data');

    // Create sport rules
    const sportRules = await SportRules.insertMany(sportRulesData);
    console.log(`Created ${sportRules.length} sport rules`);

    // Create users
    const users = [];
    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 12);
      const user = new User({
        ...userData,
        password: hashedPassword
      });
      users.push(await user.save());
    }
    console.log(`Created ${users.length} users`);

    // Create teams
    const teams = await Team.insertMany(teamsData);
    console.log(`Created ${teams.length} teams`);

    // Create tournaments
    const tournaments = await Tournament.insertMany(tournamentsData);
    console.log(`Created ${tournaments.length} tournaments`);

    // Create some sample matches
    const matchesData = [
      {
        sportKey: 'cricket',
        tournamentId: tournaments[0]._id,
        homeTeamId: teams[0]._id,
        awayTeamId: teams[1]._id,
        venue: {
          name: 'Wankhede Stadium',
          city: 'Mumbai',
          country: 'India'
        },
        scheduledAt: new Date(),
        status: 'live',
        metadata: {
          matchType: 'T20',
          weather: 'Sunny',
          pitchCondition: 'Good'
        }
      },
      {
        sportKey: 'football',
        tournamentId: tournaments[1]._id,
        homeTeamId: teams[2]._id,
        awayTeamId: teams[3]._id,
        venue: {
          name: 'Old Trafford',
          city: 'Manchester',
          country: 'England'
        },
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        status: 'upcoming',
        metadata: {
          matchType: '90min',
          weather: 'Cloudy'
        }
      }
    ];

    const matches = await Match.insertMany(matchesData);
    console.log(`Created ${matches.length} matches`);

    console.log('Database seeding completed successfully!');
    console.log('\nSample login credentials:');
    console.log('Admin: admin@multisport.com / admin123');
    console.log('Organizer: organizer@multisport.com / organizer123');
    console.log('Scorer: scorer@multisport.com / scorer123');
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