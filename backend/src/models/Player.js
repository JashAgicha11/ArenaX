const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  displayName: {
    type: String,
    required: [true, 'Display name is required'],
    trim: true,
    maxlength: [100, 'Display name cannot exceed 100 characters']
  },
  sports: [{
    type: String,
    enum: ['cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball']
  }],
  DOB: Date,
  country: String,
  statsBySport: {
    cricket: {
      seasonStats: {
        matches: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        catches: { type: Number, default: 0 },
        stumpings: { type: Number, default: 0 },
        fifties: { type: Number, default: 0 },
        hundreds: { type: Number, default: 0 },
        average: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0 },
        economy: { type: Number, default: 0 }
      },
      careerStats: {
        matches: { type: Number, default: 0 },
        runs: { type: Number, default: 0 },
        wickets: { type: Number, default: 0 },
        catches: { type: Number, default: 0 },
        stumpings: { type: Number, default: 0 },
        fifties: { type: Number, default: 0 },
        hundreds: { type: Number, default: 0 },
        average: { type: Number, default: 0 },
        strikeRate: { type: Number, default: 0 },
        economy: { type: Number, default: 0 }
      }
    },
    football: {
      seasonStats: {
        matches: { type: Number, default: 0 },
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        cleanSheets: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 }
      },
      careerStats: {
        matches: { type: Number, default: 0 },
        goals: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        cleanSheets: { type: Number, default: 0 },
        yellowCards: { type: Number, default: 0 },
        redCards: { type: Number, default: 0 },
        minutes: { type: Number, default: 0 }
      }
    },
    basketball: {
      seasonStats: {
        matches: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
        rebounds: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        steals: { type: Number, default: 0 },
        blocks: { type: Number, default: 0 },
        turnovers: { type: Number, default: 0 },
        fieldGoalPercentage: { type: Number, default: 0 },
        threePointPercentage: { type: Number, default: 0 },
        freeThrowPercentage: { type: Number, default: 0 }
      },
      careerStats: {
        matches: { type: Number, default: 0 },
        points: { type: Number, default: 0 },
        rebounds: { type: Number, default: 0 },
        assists: { type: Number, default: 0 },
        steals: { type: Number, default: 0 },
        blocks: { type: Number, default: 0 },
        turnovers: { type: Number, default: 0 },
        fieldGoalPercentage: { type: Number, default: 0 },
        threePointPercentage: { type: Number, default: 0 },
        freeThrowPercentage: { type: Number, default: 0 }
      }
    },
    tennis: {
      seasonStats: {
        matches: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        setsWon: { type: Number, default: 0 },
        setsLost: { type: Number, default: 0 },
        gamesWon: { type: Number, default: 0 },
        gamesLost: { type: Number, default: 0 },
        aces: { type: Number, default: 0 },
        doubleFaults: { type: Number, default: 0 }
      },
      careerStats: {
        matches: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        setsWon: { type: Number, default: 0 },
        setsLost: { type: Number, default: 0 },
        gamesWon: { type: Number, default: 0 },
        gamesLost: { type: Number, default: 0 },
        aces: { type: Number, default: 0 },
        doubleFaults: { type: Number, default: 0 }
      }
    },
    badminton: {
      seasonStats: {
        matches: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        setsWon: { type: Number, default: 0 },
        setsLost: { type: Number, default: 0 },
        gamesWon: { type: Number, default: 0 },
        gamesLost: { type: Number, default: 0 }
      },
      careerStats: {
        matches: { type: Number, default: 0 },
        wins: { type: Number, default: 0 },
        losses: { type: Number, default: 0 },
        setsWon: { type: Number, default: 0 },
        setsLost: { type: Number, default: 0 },
        gamesWon: { type: Number, default: 0 },
        gamesLost: { type: Number, default: 0 }
      }
    },
    volleyball: {
      seasonStats: {
        matches: { type: Number, default: 0 },
        sets: { type: Number, default: 0 },
        kills: { type: Number, default: 0 },
        blocks: { type: Number, default: 0 },
        aces: { type: Number, default: 0 },
        digs: { type: Number, default: 0 },
        assists: { type: Number, default: 0 }
      },
      careerStats: {
        matches: { type: Number, default: 0 },
        sets: { type: Number, default: 0 },
        kills: { type: Number, default: 0 },
        blocks: { type: Number, default: 0 },
        aces: { type: Number, default: 0 },
        digs: { type: Number, default: 0 },
        assists: { type: Number, default: 0 }
      }
    }
  },
  teams: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  }],
  achievements: [{
    title: String,
    description: String,
    year: Number,
    tournamentId: mongoose.Schema.Types.ObjectId,
    sport: String,
    imageUrl: String
  }],
  media: [{
    type: String,
    url: String,
    caption: String,
    kind: {
      type: String,
      enum: ['image', 'video'],
      default: 'image'
    }
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
playerSchema.index({ displayName: 1 });
playerSchema.index({ sports: 1 });
playerSchema.index({ country: 1 });
playerSchema.index({ 'teams': 1 });

// Virtual for age
playerSchema.virtual('age').get(function() {
  if (!this.DOB) return null;
  const today = new Date();
  const birthDate = new Date(this.DOB);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

// Virtual for primary sport
playerSchema.virtual('primarySport').get(function() {
  return this.sports[0] || null;
});

// Method to update stats for a specific sport
playerSchema.methods.updateStats = function(sportKey, stats, isSeason = true) {
  const targetStats = isSeason ? 'seasonStats' : 'careerStats';
  
  if (this.statsBySport[sportKey] && this.statsBySport[sportKey][targetStats]) {
    Object.assign(this.statsBySport[sportKey][targetStats], stats);
    return this.save();
  }
  
  return this;
};

// Method to add achievement
playerSchema.methods.addAchievement = function(achievement) {
  this.achievements.push(achievement);
  return this.save();
};

// Method to add team
playerSchema.methods.addTeam = function(teamId) {
  if (!this.teams.includes(teamId)) {
    this.teams.push(teamId);
    return this.save();
  }
  return this;
};

// Method to remove team
playerSchema.methods.removeTeam = function(teamId) {
  this.teams = this.teams.filter(id => id.toString() !== teamId.toString());
  return this.save();
};

// Static method to find players by sport
playerSchema.statics.findBySport = function(sportKey) {
  return this.find({ 
    sports: sportKey, 
    isActive: true 
  }).populate('teams');
};

// Static method to find top players by sport
playerSchema.statics.findTopBySport = function(sportKey, limit = 10) {
  // This would implement ranking logic based on sport-specific criteria
  return this.find({ 
    sports: sportKey, 
    isActive: true 
  }).limit(limit).populate('teams');
};

module.exports = mongoose.model('Player', playerSchema); 