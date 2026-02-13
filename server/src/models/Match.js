/**
 * Match Schema
 * -------------
 * Represents a single sports match in the system.
 *
 * Design Decisions:
 * - Uses references for Teams, Tournament, and Users to maintain normalization.
 * - Uses embedded documents for scoringFeed to optimize real-time read performance.
 * - Uses flexible (Mixed) fields for sport-specific data to support multi-sport architecture.
 *
 * This schema is designed to handle cricket, football, basketball, badminton,
 * tennis, and volleyball under a unified structure.
 */



const mongoose = require('mongoose');

// Match schema represents a single sports match.
// This document stores match metadata, teams, score,
// and embedded events for fast read performance.

const matchSchema = new mongoose.Schema({
  
  sportKey: {
    // Identifies which sport this match belongs to.
// Enum restriction ensures only supported sports are stored.

    type: String,
    required: true,
    enum: ['cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball']
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament'
  },
  // Referenced relationships (normalized)
// Using ObjectId references prevents duplication of team/tournament data
// and allows population when detailed information is required.

  homeTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  awayTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  
  // Tracks players participating in this match.
// Stored as embedded subdocuments because participation is match-specific.

  playersInvolved: [{
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player'
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    role: String // 'batsman', 'bowler', 'fielder', etc.
  }],
  venue: {
    name: String,
    city: String,
    country: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  scheduledAt: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['upcoming', 'live', 'completed', 'cancelled', 'postponed'],
    default: 'upcoming'
  },
  // Real-time scoring feed (embedded for fast retrieval during live matches).
// Each entry represents an atomic scoring event.
// Using Mixed type in `data` allows sport-specific flexibility.

  scoringFeed: [{
    // Real-time scoring events
    timestamp: { type: Date, default: Date.now },
    eventType: String, // 'ball', 'goal', 'point', 'foul', etc.
    playerId: mongoose.Schema.Types.ObjectId,
    teamId: mongoose.Schema.Types.ObjectId,
    data: mongoose.Schema.Types.Mixed, // Sport-specific scoring data
    period: Number, // over, period, set, etc.
    time: String, // minute, ball number, etc.
    scorerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  // Precomputed match statistics.
// Stored to avoid recalculating aggregates on every read.
// Updated via middleware when scoringFeed changes.

  statsAggregate: {
    // Aggregated statistics for the match
    homeTeam: mongoose.Schema.Types.Mixed,
    awayTeam: mongoose.Schema.Types.Mixed,
    players: [{
      playerId: mongoose.Schema.Types.ObjectId,
      stats: mongoose.Schema.Types.Mixed
    }]
  },
  result: {
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team'
    },
    homeScore: mongoose.Schema.Types.Mixed,
    awayScore: mongoose.Schema.Types.Mixed,
    margin: String, // e.g., "by 5 wickets", "2-1", "25-23, 25-20, 25-18"
    completedAt: Date
  },
  officials: {
    scorerIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    umpireIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  metadata: {
    // Sport-specific metadata
    matchType: String, // 'T20', '90min', 'best-of-3', etc.
    weather: String,
    pitchCondition: String, // for cricket
    attendance: Number,
    highlights: [String]
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

// Indexes improve performance for live match filtering
// Indexing Strategy:
// - sportKey + status → used for filtering live matches by sport
// - tournamentId → used when displaying tournament fixtures
// - scheduledAt → used for upcoming match sorting
// - playersInvolved.playerId → enables quick player-match lookup

matchSchema.index({ sportKey: 1, status: 1 });
matchSchema.index({ tournamentId: 1 });
matchSchema.index({ homeTeamId: 1 });
matchSchema.index({ awayTeamId: 1 });
matchSchema.index({ scheduledAt: 1 });
matchSchema.index({ status: 1, scheduledAt: 1 });
matchSchema.index({ 'playersInvolved.playerId': 1 });

// Virtual for match title
// Virtual properties (computed fields, not stored in DB)


matchSchema.virtual('matchTitle').get(function(){
// Generates readable match title dynamically.
// Requires populated team references for full name display.
                                    
  if (this.homeTeamId && this.awayTeamId) {
    return `${this.homeTeamId.name || 'TBD'} vs ${this.awayTeamId.name || 'TBD'}`;
  }
  return 'Match Details';
});

// Virtual for isLive
// Convenience flag used by frontend to check live state.

matchSchema.virtual('isLive').get(function() {
  return this.status === 'live';
});

// Virtual for isCompleted
matchSchema.virtual('isCompleted').get(function() {
  return this.status === 'completed';
});

// Method to add scoring event
// Adds a new scoring event to the match.
// Designed to be atomic to maintain event ordering.

matchSchema.methods.addScoringEvent = function(eventData) {
  this.scoringFeed.push({
    ...eventData,
    timestamp: new Date()
  });
  return this.save();
};

// Method to update match status
matchSchema.methods.updateStatus = function(newStatus) {
  this.status = newStatus;
  if (newStatus === 'completed') {
    this.result.completedAt = new Date();
  }
  return this.save();
};

// Static method to find live matches
matchSchema.statics.findLiveMatches = function() {
  return this.find({ status: 'live' }).populate('homeTeamId awayTeamId tournamentId');
};

// Static method to find matches by sport
matchSchema.statics.findBySport = function(sportKey) {
  return this.find({ sportKey }).populate('homeTeamId awayTeamId tournamentId');
};

// Pre-save middleware to update stats
matchSchema.pre('save', function(next) {
  // Update aggregated stats when scoring feed changes
  if (this.isModified('scoringFeed')) {
    // This would call a sport-specific stats aggregator
    // For now, we'll just mark it as modified
    this.markModified('statsAggregate');
  }
  next();
});

module.exports = mongoose.model('Match', matchSchema); 
