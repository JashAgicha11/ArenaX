const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  playerId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true,
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    maxlength: [100, 'Display name cannot exceed 100 characters'],
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team',
  }],
  stats: {
    matches: { type: Number, default: 0 },
    wins: { type: Number, default: 0 },
    losses: { type: Number, default: 0 },
    points: { type: Number, default: 0 },
  },
  sportPreferences: [{
    type: String,
    enum: ['cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball'],
  }],
}, {
  timestamps: true,
});

playerSchema.index({ displayName: 1 });
playerSchema.index({ teams: 1 });

module.exports = mongoose.model('Player', playerSchema);