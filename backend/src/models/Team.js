const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    maxlength: [100, 'Team name cannot exceed 100 characters']
  },
  sportKey: {
    type: String,
    required: true,
    enum: ['cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball']
  },
  logoUrl: {
    type: String,
    default: null
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  location: {
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  stats: {
    season: {
      matchesPlayed: { type: Number, default: 0 },
      matchesWon: { type: Number, default: 0 },
      matchesDrawn: { type: Number, default: 0 },
      matchesLost: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
      goalsFor: { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
      goalDifference: { type: Number, default: 0 }
    },
    career: {
      totalMatches: { type: Number, default: 0 },
      totalWins: { type: Number, default: 0 },
      totalDraws: { type: Number, default: 0 },
      totalLosses: { type: Number, default: 0 },
      totalPoints: { type: Number, default: 0 }
    }
  },
  rankings: {
    current: {
      rank: Number,
      points: Number,
      sportKey: String,
      tournamentId: mongoose.Schema.Types.ObjectId
    },
    history: [{
      rank: Number,
      points: Number,
      sportKey: String,
      tournamentId: mongoose.Schema.Types.ObjectId,
      date: { type: Date, default: Date.now }
    }]
  },
  achievements: [{
    title: String,
    description: String,
    year: Number,
    tournamentId: mongoose.Schema.Types.ObjectId,
    imageUrl: String
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
teamSchema.index({ name: 1 });
teamSchema.index({ sportKey: 1 });
teamSchema.index({ 'location.city': 1, 'location.country': 1 });
teamSchema.index({ 'rankings.current.sportKey': 1, 'rankings.current.points': -1 });

// Virtual for win percentage
teamSchema.virtual('winPercentage').get(function() {
  const { matchesPlayed, matchesWon } = this.stats.season;
  if (matchesPlayed === 0) return 0;
  return ((matchesWon / matchesPlayed) * 100).toFixed(1);
});

// Virtual for form (last 5 matches)
teamSchema.virtual('form').get(function() {
  // This would be calculated from recent matches
  return 'WWDLW'; // Example form string
});

// Method to update season stats
teamSchema.methods.updateSeasonStats = function(matchResult) {
  const { isWin, isDraw, goalsFor, goalsAgainst } = matchResult;
  
  this.stats.season.matchesPlayed += 1;
  
  if (isWin) {
    this.stats.season.matchesWon += 1;
    this.stats.season.points += 3;
  } else if (isDraw) {
    this.stats.season.matchesDrawn += 1;
    this.stats.season.points += 1;
  } else {
    this.stats.season.matchesLost += 1;
  }
  
  this.stats.season.goalsFor += goalsFor || 0;
  this.stats.season.goalsAgainst += goalsAgainst || 0;
  this.stats.season.goalDifference = this.stats.season.goalsFor - this.stats.season.goalsAgainst;
  
  return this.save();
};

// Method to add player to team
teamSchema.methods.addPlayer = function(playerId) {
  if (!this.players.includes(playerId)) {
    this.players.push(playerId);
    return this.save();
  }
  return this;
};

// Method to remove player from team
teamSchema.methods.removePlayer = function(playerId) {
  this.players = this.players.filter(id => id.toString() !== playerId.toString());
  return this.save();
};

// Static method to find teams by sport
teamSchema.statics.findBySport = function(sportKey) {
  return this.find({ sportKey, isActive: true }).populate('players');
};

// Static method to find top teams
teamSchema.statics.findTopTeams = function(sportKey, limit = 10) {
  return this.find({ sportKey, isActive: true })
    .sort({ 'rankings.current.points': -1 })
    .limit(limit)
    .populate('players');
};

module.exports = mongoose.model('Team', teamSchema); 