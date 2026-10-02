const express = require('express');
const router = express.Router();
const Reg = require('../models/Registration');

// 📊 Dashboard Stats
router.get('/stats', async (req, res) => {
  const [stats] = await Reg.aggregate([
    {
      $group: {
        _id: null,
        totalRecords: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        attendees: { $addToSet: '$attendee_id' },
        sessions: { $addToSet: '$session' }
      }
    },
    {
      $project: {
        _id: 0,
        totalRecords: 1,
        avgRating: { $round: ['$avgRating', 2] },
        totalAttendees: { $size: '$attendees' },
        totalSessions: { $size: '$sessions' }
      }
    }
  ]);

  res.json(stats);
});

// 👤 Attendee Day-wise
router.get('/attendee/:id/:day', async (req, res) => {
  const { id, day } = req.params;
  const data = await Reg.find(
    { attendee_id: id.toUpperCase(), day: Number(day) },
    { _id: 0, session: 1, rating: 1 }
  );
  res.json(data);
});

// 📈 Average Rating
router.get('/average/:id', async (req, res) => {
  const [result] = await Reg.aggregate([
    { $match: { attendee_id: req.params.id.toUpperCase() } },
    {
      $group: {
        _id: '$attendee_id',
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  res.json(result);
});

// 🏆 Top Attendees
router.get('/top', async (req, res) => {
  const data = await Reg.aggregate([
    {
      $group: {
        _id: '$attendee_id',
        name: { $first: '$name' },
        avg: { $avg: '$rating' }
      }
    },
    { $sort: { avg: -1 } },
    { $limit: 5 }
  ]);
  res.json(data);
});

// 📊 Session Analytics
router.get('/session-analytics', async (req, res) => {
  const data = await Reg.aggregate([
    {
      $group: {
        _id: '$session',
        avg: { $avg: '$rating' },
        max: { $max: '$rating' },
        min: { $min: '$rating' }
      }
    }
  ]);
  res.json(data);
});

// ➕ CREATE
router.post('/add', async (req, res) => {
  const rec = await Reg.create(req.body);
  res.json(rec);
});

module.exports = router;