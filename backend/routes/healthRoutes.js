const express = require('express');
const router = express.Router();
const HealthRecord = require('../models/HealthRecord');
const { authMiddleware } = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const { generateToken } = require('../middleware/auth');

// Mock user database (replace with real User model in production)
const users = [
  {
    id: '1',
    email: 'user@example.com',
    password: bcrypt.hashSync('password123', 10),
    name: 'John Doe'
  }
];

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user.id);
    
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/health
// @desc    Get all health records for user
router.get('/health', authMiddleware, async (req, res) => {
  try {
    const records = await HealthRecord.find({ userId: req.user.userId })
      .sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/health/:id
// @desc    Get single health record
router.get('/health/:id', authMiddleware, async (req, res) => {
  try {
    const record = await HealthRecord.findOne({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/health
// @desc    Create new health record
router.post('/health', authMiddleware, async (req, res) => {
  try {
    const { weight, height, bloodPressure, heartRate, bloodSugar, steps, waterIntake, sleepHours, notes } = req.body;
    
    const newRecord = new HealthRecord({
      userId: req.user.userId,
      weight,
      height,
      bloodPressure: {
        systolic: bloodPressure?.systolic,
        diastolic: bloodPressure?.diastolic
      },
      heartRate,
      bloodSugar,
      steps,
      waterIntake,
      sleepHours,
      notes
    });

    const savedRecord = await newRecord.save();
    res.status(201).json(savedRecord);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/health/:id
// @desc    Update health record
router.put('/health/:id', authMiddleware, async (req, res) => {
  try {
    const record = await HealthRecord.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: req.body },
      { new: true }
    );
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json(record);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/health/:id
// @desc    Delete health record
router.delete('/health/:id', authMiddleware, async (req, res) => {
  try {
    const record = await HealthRecord.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId
    });
    
    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }
    
    res.json({ message: 'Record removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/health/stats/summary
// @desc    Get health statistics summary
router.get('/health/stats/summary', authMiddleware, async (req, res) => {
  try {
    const records = await HealthRecord.find({ userId: req.user.userId }).sort({ date: 1 });
    
    if (records.length === 0) {
      return res.json({ message: 'No records found' });
    }

    const latest = records[records.length - 1];
    const avgWeight = records.reduce((sum, r) => sum + r.weight, 0) / records.length;
    const avgSteps = records.reduce((sum, r) => sum + (r.steps || 0), 0) / records.length;
    const avgSleep = records.reduce((sum, r) => sum + (r.sleepHours || 0), 0) / records.length;

    res.json({
      totalRecords: records.length,
      latestBMI: latest.bmi,
      averageWeight: parseFloat(avgWeight.toFixed(2)),
      averageSteps: Math.round(avgSteps),
      averageSleep: parseFloat(avgSleep.toFixed(1)),
      weightTrend: records.map(r => ({ date: r.date, weight: r.weight })),
      bmiTrend: records.map(r => ({ date: r.date, bmi: r.bmi }))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
