const mongoose = require('mongoose');

const sportRulesSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    enum: ['cricket', 'football', 'basketball', 'badminton', 'tennis', 'volleyball']
  },
  labels: {
    name: { type: String, required: true },
    shortName: { type: String, required: true },
    description: String
  },
  inputsSchema: {
    // Define what inputs are valid for this sport
    validEvents: [String],
    requiredFields: [String],
    optionalFields: [String]
  },
  scoringSchema: {
    // Define how scoring works for this sport
    primaryMetric: String, // e.g., 'runs', 'goals', 'points'
    secondaryMetrics: [String],
    timeFormat: String, // e.g., 'overs', 'periods', 'sets'
    maxTime: Number
  },
  resultAlgoRef: {
    // Reference to the algorithm that determines match results
    type: String,
    required: true
  },
  playerPointAlgoRef: {
    // Reference to the algorithm that calculates player fantasy points
    type: String,
    required: true
  },
  teamPointAlgoRef: {
    // Reference to the algorithm that calculates team points
    type: String,
    required: true
  },
  tieBreakers: [{
    // Define tie-breaking criteria in order of priority
    field: String,
    direction: { type: String, enum: ['asc', 'desc'] },
    description: String
  }],
  uiHints: {
    // UI-specific hints for rendering
    primaryColor: String,
    secondaryColor: String,
    icon: String,
    scoringInterface: String // 'ball-by-ball', 'event-based', 'period-based'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
sportRulesSchema.index({ key: 1 });
sportRulesSchema.index({ isActive: 1 });

// Virtual for display name
sportRulesSchema.virtual('displayName').get(function() {
  return this.labels.name;
});

// Static method to get active rules
sportRulesSchema.statics.getActiveRules = function() {
  return this.find({ isActive: true });
};

// Static method to get rules by sport key
sportRulesSchema.statics.getBySportKey = function(sportKey) {
  return this.findOne({ key: sportKey, isActive: true });
};

module.exports = mongoose.model('SportRules', sportRulesSchema); 