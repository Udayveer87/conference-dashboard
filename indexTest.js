// Demonstrates the performance difference an index makes, using MongoDB's
// own query planner stats (explain) rather than a synthetic benchmark.
//
// We compare two equivalent-selectivity queries on the seeded `registrations`
// collection (seed.js inserts 200 attendees x 4 sessions x 3 days = 2400 docs):
//   1. A query on `rating`      -> NOT indexed -> full collection scan (COLLSCAN)
//   2. A query on `attendee_id` + `day` -> covered by the compound index
//      declared in models/Registration.js -> index scan (IXSCAN)
//
// Run with: npm run test-index

require('dotenv').config();
const mongoose = require('mongoose');
const Reg = require('./models/Registration');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  const count = await Reg.countDocuments();
  if (count === 0) {
    console.log('No data found. Run `npm run seed` first.');
    await mongoose.disconnect();
    return;
  }

  console.log(`\nComparing query plans over ${count} documents\n`);

  // 1) Query on a field with NO index -> expect a collection scan
  const noIndexPlan = await Reg.find({ rating: 3 })
    .explain('executionStats');

  const noIndexStats = noIndexPlan.executionStats;
  console.log('Query WITHOUT an index: { rating: 3 }');
  console.log('  Winning stage:       ', noIndexPlan.queryPlanner.winningPlan.stage || noIndexPlan.queryPlanner.winningPlan.inputStage?.stage);
  console.log('  Documents examined:  ', noIndexStats.totalDocsExamined);
  console.log('  Documents returned:  ', noIndexStats.nReturned);
  console.log('  Execution time (ms): ', noIndexStats.executionTimeMillis);

  // 2) Query on the compound-indexed fields -> expect an index scan
  const indexPlan = await Reg.find({ attendee_id: 'A1', day: 1 })
    .explain('executionStats');

  const indexStats = indexPlan.executionStats;
  console.log('\nQuery WITH the { attendee_id: 1, day: 1 } index:');
  console.log('  Winning stage:       ', indexPlan.queryPlanner.winningPlan.inputStage?.stage || indexPlan.queryPlanner.winningPlan.stage);
  console.log('  Documents examined:  ', indexStats.totalDocsExamined);
  console.log('  Documents returned:  ', indexStats.nReturned);
  console.log('  Execution time (ms): ', indexStats.executionTimeMillis);

  console.log('\nTakeaway: the indexed query examines only the documents that');
  console.log('match (totalDocsExamined ~= nReturned), while the non-indexed');
  console.log('query scans every document in the collection to find matches.\n');

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
