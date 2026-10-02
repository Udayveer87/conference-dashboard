const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  attendee_id: { type: String, required: true },
  name: { type: String, required: true },
  session: { type: String, required: true },
  day: { type: Number, required: true },
  rating: { type: Number, required: true }
}, { collection: 'registrations', versionKey: false });

// 🔥 Compound Index
schema.index({ attendee_id: 1, day: 1 });

module.exports = mongoose.model('Registration', schema);