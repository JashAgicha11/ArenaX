const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Team name is required'],
    trim: true,
    maxlength: [100, 'Team name cannot exceed 100 characters']
  },
  sport: {
    type: String,
    required: true,
    enum: ['cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball']
  },
  tournamentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tournament',
    required: true,
    index: true,
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Player'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true
});

// Indexes
teamSchema.index({ name: 1 });
teamSchema.index({ sport: 1 });
teamSchema.index({ tournamentId: 1 });

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

module.exports = mongoose.model('Team', teamSchema); 