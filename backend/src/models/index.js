const { DataTypes, Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
  password: { type: DataTypes.STRING(255), allowNull: false },
  role: { type: DataTypes.ENUM('admin', 'organizer', 'player'), allowNull: false, defaultValue: 'player' },
  playerId: { type: DataTypes.STRING(32), unique: true, allowNull: true },
  avatarUrl: { type: DataTypes.STRING(255), allowNull: true },
  bio: { type: DataTypes.STRING(500), allowNull: true },
  sports: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  follows: { type: DataTypes.JSON, allowNull: false, defaultValue: { players: [], teams: [], tournaments: [] } },
  isVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  lastLogin: { type: DataTypes.DATE, allowNull: true },
  refreshToken: { type: DataTypes.TEXT, allowNull: true },
}, {
  indexes: [{ unique: true, fields: ['email'] }, { fields: ['role'] }],
  hooks: {
    beforeValidate: (user) => {
      if (user.email) user.email = user.email.toLowerCase().trim();
      if (user.role === 'player' && !user.playerId) {
        throw new Error('playerId is required for players');
      }
    },
    beforeCreate: async (user) => {
      user.password = await bcrypt.hash(user.password, 12);
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) user.password = await bcrypt.hash(user.password, 12);
    },
  },
});

User.prototype.comparePassword = async function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
User.prototype.hasRole = function hasRole(role) {
  return this.role === role || this.role === 'admin';
};
User.prototype.hasAnyRole = function hasAnyRole(roles) {
  return roles.includes(this.role) || this.role === 'admin';
};
User.findByEmail = function findByEmail(email) {
  return User.findOne({ where: { email: String(email).toLowerCase() } });
};

const Player = sequelize.define('Player', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
  playerId: { type: DataTypes.STRING(32), allowNull: false, unique: true },
  displayName: { type: DataTypes.STRING(100), allowNull: false },
  stats: { type: DataTypes.JSON, allowNull: false, defaultValue: { matches: 0, wins: 0, losses: 0, points: 0 } },
  sportPreferences: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
});

const Tournament = sequelize.define('Tournament', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(200), allowNull: false },
  sport: { type: DataTypes.ENUM('cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball'), allowNull: false },
  organizerId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('upcoming', 'ongoing', 'completed', 'cancelled'), allowNull: false, defaultValue: 'upcoming' },
});

const Team = sequelize.define('Team', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING(100), allowNull: false },
  sport: { type: DataTypes.ENUM('cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball'), allowNull: false },
  tournamentId: { type: DataTypes.INTEGER, allowNull: true },
  createdBy: { type: DataTypes.INTEGER, allowNull: false },
});

const Match = sequelize.define('Match', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  sportKey: { type: DataTypes.STRING(50), allowNull: true },
  tournamentId: { type: DataTypes.INTEGER, allowNull: false },
  homeTeamId: { type: DataTypes.INTEGER, allowNull: false },
  awayTeamId: { type: DataTypes.INTEGER, allowNull: false },
  scheduledAt: { type: DataTypes.DATE, allowNull: false },
  status: { type: DataTypes.ENUM('upcoming', 'live', 'completed', 'cancelled', 'postponed'), allowNull: false, defaultValue: 'upcoming' },
  result: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
}, {
  validate: {
    teamsDiffer() {
      if (this.homeTeamId === this.awayTeamId) throw new Error('homeTeamId and awayTeamId must be different');
    },
  },
});

const PlayersInMatch = sequelize.define('PlayersInMatch', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  matchId: { type: DataTypes.INTEGER, allowNull: false },
  playerId: { type: DataTypes.INTEGER, allowNull: false },
  teamId: { type: DataTypes.INTEGER, allowNull: false },
  role: { type: DataTypes.STRING(50), allowNull: true },
});

const ScoringFeed = sequelize.define('ScoringFeed', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  matchId: { type: DataTypes.INTEGER, allowNull: false },
  playerId: { type: DataTypes.INTEGER, allowNull: true },
  teamId: { type: DataTypes.INTEGER, allowNull: true },
  eventType: { type: DataTypes.STRING(100), allowNull: false },
  timestamp: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  data: { type: DataTypes.JSON, allowNull: true },
  period: { type: DataTypes.INTEGER, allowNull: true },
  time: { type: DataTypes.STRING(50), allowNull: true },
  scorerId: { type: DataTypes.INTEGER, allowNull: true },
});

const PlayerTeam = sequelize.define('PlayerTeam', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  playerId: { type: DataTypes.INTEGER, allowNull: false },
  teamId: { type: DataTypes.INTEGER, allowNull: false },
});

const TournamentApplication = sequelize.define('TournamentApplication', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  tournamentId: { type: DataTypes.INTEGER, allowNull: false },
  playerId: { type: DataTypes.INTEGER, allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
  message: { type: DataTypes.STRING(500), allowNull: true },
  appliedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  reviewedAt: { type: DataTypes.DATE, allowNull: true },
  reviewedBy: { type: DataTypes.INTEGER, allowNull: true },
});

const SportRules = sequelize.define('SportRules', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  key: { type: DataTypes.ENUM('cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball'), allowNull: false, unique: true },
  labels: { type: DataTypes.JSON, allowNull: false },
  inputsSchema: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
  scoringSchema: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
  resultAlgoRef: { type: DataTypes.STRING(255), allowNull: false },
  playerPointAlgoRef: { type: DataTypes.STRING(255), allowNull: false },
  teamPointAlgoRef: { type: DataTypes.STRING(255), allowNull: false },
  tieBreakers: { type: DataTypes.JSON, allowNull: false, defaultValue: [] },
  uiHints: { type: DataTypes.JSON, allowNull: false, defaultValue: {} },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
});

SportRules.getActiveRules = function getActiveRules() {
  return SportRules.findAll({ where: { isActive: true } });
};
SportRules.getBySportKey = function getBySportKey(sportKey) {
  return SportRules.findOne({ where: { key: sportKey, isActive: true } });
};

User.hasOne(Player, { foreignKey: 'userId', as: 'player' });
Player.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Tournament.belongsTo(User, { foreignKey: 'organizerId', as: 'organizer' });
User.hasMany(Tournament, { foreignKey: 'organizerId', as: 'organizedTournaments' });
Team.belongsTo(Tournament, { foreignKey: 'tournamentId', as: 'tournament' });
Tournament.hasMany(Team, { foreignKey: 'tournamentId', as: 'teams' });
Team.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
Match.belongsTo(Tournament, { foreignKey: 'tournamentId', as: 'tournament' });
Tournament.hasMany(Match, { foreignKey: 'tournamentId', as: 'matches' });
Match.belongsTo(Team, { foreignKey: 'homeTeamId', as: 'homeTeam' });
Match.belongsTo(Team, { foreignKey: 'awayTeamId', as: 'awayTeam' });
Match.hasMany(PlayersInMatch, { foreignKey: 'matchId', as: 'playersInvolved' });
PlayersInMatch.belongsTo(Match, { foreignKey: 'matchId', as: 'match' });
PlayersInMatch.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });
PlayersInMatch.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });
Match.hasMany(ScoringFeed, { foreignKey: 'matchId', as: 'scoringFeed' });
ScoringFeed.belongsTo(Match, { foreignKey: 'matchId', as: 'match' });
ScoringFeed.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });
ScoringFeed.belongsTo(Team, { foreignKey: 'teamId', as: 'team' });
Player.belongsToMany(Match, { through: PlayersInMatch, foreignKey: 'playerId', otherKey: 'matchId', as: 'matches' });
Match.belongsToMany(Player, { through: PlayersInMatch, foreignKey: 'matchId', otherKey: 'playerId', as: 'players' });
Player.belongsToMany(Team, { through: PlayerTeam, foreignKey: 'playerId', otherKey: 'teamId', as: 'teams' });
Team.belongsToMany(Player, { through: PlayerTeam, foreignKey: 'teamId', otherKey: 'playerId', as: 'players' });
Tournament.hasMany(TournamentApplication, { foreignKey: 'tournamentId', as: 'applications' });
TournamentApplication.belongsTo(Tournament, { foreignKey: 'tournamentId', as: 'tournament' });
TournamentApplication.belongsTo(Player, { foreignKey: 'playerId', as: 'player' });

module.exports = {
  sequelize,
  Op,
  User,
  Player,
  Team,
  Tournament,
  Match,
  PlayersInMatch,
  ScoringFeed,
  PlayerTeam,
  TournamentApplication,
  SportRules,
};
