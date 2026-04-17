const mongoose = require('mongoose');

const tournamentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tournament name is required'],
    trim: true,
    maxlength: [200, 'Tournament name cannot exceed 200 characters']
  },
  sport: {
    type: String,
    required: true,
    enum: ['cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball']
  },
  organizerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  matches: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match'
  }],
  applications: [{
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Player',
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    reviewedAt: Date,
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  }],
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
}, {
  timestamps: true
});

// Indexes
tournamentSchema.index({ name: 1 });
tournamentSchema.index({ sport: 1 });
tournamentSchema.index({ organizerId: 1 });
tournamentSchema.index({ status: 1, createdAt: -1 });
tournamentSchema.index({ 'teams': 1 });
tournamentSchema.index({ 'applications.playerId': 1 });

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

// Static method to find tournaments by organizer
tournamentSchema.statics.findByOrganizer = function(organizerId) {
  return this.find({ organizerId }).populate('teams');
};

module.exports = mongoose.model('Tournament', tournamentSchema); 