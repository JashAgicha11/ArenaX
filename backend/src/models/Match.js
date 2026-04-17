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
  
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
  },
  // Referenced relationships (normalized)
// Using ObjectId references prevents duplication of team/tournament data
// and allows population when detailed information is required.

  homeTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  awayTeamId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
    required: true,
  },
  
  // Tracks players participating in this match.
// Stored as embedded subdocuments because participation is match-specific.

  playersInvolved: [{
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    role: String // 'batsman', 'bowler', 'fielder', etc.
  }],
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
}, {
  timestamps: true
});

// Indexes improve performance for live match filtering
// Indexing Strategy:
// - sportKey + status → used for filtering live matches by sport
// - tournamentId → used when displaying tournament fixtures
// - scheduledAt → used for upcoming match sorting
// - playersInvolved.playerId → enables quick player-match lookup

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

matchSchema.pre('validate', function(next) {
  if (this.homeTeamId && this.awayTeamId && this.homeTeamId.toString() === this.awayTeamId.toString()) {
    return next(new Error('homeTeamId and awayTeamId must be different'));
  }
  return next();
});

module.exports = mongoose.model('Match', matchSchema); 
