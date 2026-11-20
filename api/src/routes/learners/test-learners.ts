import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { initializeLocalDb } from '../../db';
import { createLearner, deleteLearner, getLearners } from './repository';

async function testLearner() {
  const db = await initializeLocalDb();
  const fixture = {
    studentId: `TEST-${randomUUID()}`,
    name: 'Test Student',
    classId: 'CLASS-001',
  };
  try {
    await createLearner(fixture);
    try {
      const rows = await getLearners({ studentId: fixture.studentId });
      assert.equal(rows.length, 1);
      assert.equal(rows[0].studentId, fixture.studentId);
      assert.equal(rows[0].name, fixture.name);
      assert.equal(rows[0].classId, fixture.classId);
    } finally {
      await deleteLearner({ studentId: fixture.studentId });
    }
  } finally {
    await db.close();
  }
  console.log('Learner repository smoke check passed.');
}

testLearner().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
