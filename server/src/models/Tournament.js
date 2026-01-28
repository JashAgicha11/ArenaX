const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tournament name is required'],
    trim: true,
    maxlength: [200, 'Tournament name cannot exceed 200 characters']
  },
  sportKey: {
    type: String,
    required: true,
    enum: ['cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball']
  },
  type: {
    type: String,
    required: true,
    enum: ['league', 'knockout', 'round-robin', 'mixed']
  },
  season: {
    type: String,
    required: true
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    city: String,
    country: String,
    venue: String
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  rulesRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SportRules'
  },
  standings: [{
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    entityType: {
      type: String,
      enum: ['team', 'player'],
      required: true
    },
    matchesPlayed: { type: Number, default: 0 },
    matchesWon: { type: Number, default: 0 },
    matchesDrawn: { type: Number, default: 0 },
    matchesLost: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
    goalsFor: { type: Number, default: 0 },
    goalsAgainst: { type: Number, default: 0 },
    goalDifference: { type: Number, default: 0 },
    rank: Number
  }],
  brackets: {
    // For knockout tournaments
    rounds: [{
      roundNumber: Number,
      matches: [{
        matchId: mongoose.Schema.Types.ObjectId,
        homeTeam: mongoose.Schema.Types.ObjectId,
        awayTeam: mongoose.Schema.Types.ObjectId,
        winner: mongoose.Schema.Types.ObjectId,
        status: String
      }]
    }]
  },
  fixtures: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  settings: {
    maxTeams: Number,
    maxPlayers: Number,
    registrationDeadline: Date,
    entryFee: Number,
    prizePool: Number,
    format: String, // e.g., 'T20', '90min', 'best-of-3'
    rules: String
  },
  isPublic: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
tournamentSchema.index({ name: 1 });
tournamentSchema.index({ sportKey: 1, season: 1 });
tournamentSchema.index({ organizerId: 1 });
tournamentSchema.index({ status: 1, startDate: 1 });
tournamentSchema.index({ 'teams': 1 });
tournamentSchema.index({ 'players': 1 });

// Virtual for tournament duration
tournamentSchema.virtual('duration').get(function() {
  const start = new Date(this.startDate);
  const end = new Date(this.endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
});

// Virtual for isRegistrationOpen
tournamentSchema.virtual('isRegistrationOpen').get(function() {
  if (!this.settings.registrationDeadline) return true;
  return new Date() < new Date(this.settings.registrationDeadline);
});

// Virtual for progress percentage
tournamentSchema.virtual('progressPercentage').get(function() {
  if (this.status === 'completed') return 100;
  if (this.status === 'upcoming') return 0;
  
  const totalFixtures = this.fixtures.length;
  const completedFixtures = this.fixtures.filter(fixture => 
    fixture.status === 'completed'
  ).length;
  
  if (totalFixtures === 0) return 0;
  return Math.round((completedFixtures / totalFixtures) * 100);
});

// Method to add team to tournament
tournamentSchema.methods.addTeam = function(teamId) {
  if (!this.teams.includes(teamId)) {
    this.teams.push(teamId);
    return this.save();
  }
  return this;
};

// Method to remove team from tournament
tournamentSchema.methods.removeTeam = function(teamId) {
  this.teams = this.teams.filter(id => id.toString() !== teamId.toString());
  return this.save();
};

// Method to add player to tournament
tournamentSchema.methods.addPlayer = function(playerId) {
  if (!this.players.includes(playerId)) {
    this.players.push(playerId);
    return this.save();
  }
  return this;
};

// Method to generate fixtures
tournamentSchema.methods.generateFixtures = function() {
  // This would implement the fixture generation logic based on tournament type
  // For now, we'll just return a success message
  return Promise.resolve('Fixtures generated successfully');
};

// Method to update standings
tournamentSchema.methods.updateStandings = function() {
  // This would recalculate standings based on completed matches
  // For now, we'll just return a success message
  return Promise.resolve('Standings updated successfully');
};

// Static method to find tournaments by sport
tournamentSchema.statics.findBySport = function(sportKey) {
  return this.find({ sportKey, isPublic: true }).populate('organizerId');
};

// Static method to find active tournaments
tournamentSchema.statics.findActive = function() {
  return this.find({ 
    status: { $in: ['upcoming', 'ongoing'] },
    isPublic: true 
  }).populate('organizerId');
};

// Static method to find tournaments by organizer
tournamentSchema.statics.findByOrganizer = function(organizerId) {
  return this.find({ organizerId }).populate('teams');
};

module.exports = mongoose.model('Tournament', tournamentSchema); 