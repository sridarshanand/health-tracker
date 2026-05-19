const mongoose = require('mongoose');

const healthRecordSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  weight: {
    type: Number,
    required: true
  },
  height: {
    type: Number,
    required: true
  },
  bloodPressure: {
    systolic: Number,
    diastolic: Number
  },
  heartRate: {
    type: Number
  },
  bloodSugar: {
    type: Number
  },
  steps: {
    type: Number,
    default: 0
  },
  waterIntake: {
    type: Number,
    default: 0
  },
  sleepHours: {
    type: Number
  },
  notes: {
    type: String
  },
  bmi: {
    type: Number
  }
}, {
  timestamps: true
});

// Calculate BMI before saving
healthRecordSchema.pre('save', function(next) {
  if (this.weight && this.height) {
    // BMI = weight(kg) / height(m)^2
    const heightInMeters = this.height / 100;
    this.bmi = parseFloat((this.weight / (heightInMeters * heightInMeters)).toFixed(2));
  }
  next();
});

module.exports = mongoose.model('HealthRecord', healthRecordSchema);
