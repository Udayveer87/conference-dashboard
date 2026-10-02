require('dotenv').config();
const mongoose = require('mongoose');
const Reg = require('./models/Registration');

const sessions = ['AI', 'Blockchain', 'Cybersecurity', 'Web Dev'];
const days = [1, 2, 3];

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  await Reg.deleteMany();

  const data = [];

  for (let i = 1; i <= 200; i++) {
    for (let s of sessions) {
      for (let d of days) {
        data.push({
          attendee_id: 'A' + i,
          name: 'User ' + i,
          session: s,
          day: d,
          rating: rand(1, 5)
        });
      }
    }
  }

  await Reg.insertMany(data);
  console.log("Seeded!");
  mongoose.disconnect();
}

seed();