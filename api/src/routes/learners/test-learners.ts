import { sequelize } from '../../db';
import { Learner } from '../../db/models/learner.model';
import { getLearners } from './repository';

async function testLearner() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Connected to database');

    // Sync models
    await sequelize.sync({ alter: true });
    console.log('✅ Models synced');

    // Test data
    const testStudentId = `TEST-${Date.now()}`;
    const testName = 'Test Student';
    const testClassId = 'CLASS-001';

    console.log(`\n📝 Creating learner with studentId: ${testStudentId}`);

    // Create learner directly (since createLearner only sets studentId, but model requires name and classId)
    const created = await Learner.create({
      studentId: testStudentId,
      name: testName,
      classId: testClassId,
    });
    console.log('✅ Learner created:', {
      id: created.get('id'),
      studentId: created.get('studentId'),
      name: created.get('name'),
      classId: created.get('classId'),
    });

    // Retrieve learner by ID
    console.log(`\n🔍 Retrieving learner with studentId: ${testStudentId}`);
    const found = await getLearners({ studentId: testStudentId });

    if (found.length > 0) {
      console.log('✅ Learner found:', {
        id: found[0].get('id'),
        studentId: found[0].get('studentId'),
        name: found[0].get('name'),
        classId: found[0].get('classId'),
      });
      console.log('\n✅ Test passed! Create and retrieve working correctly.');
    } else {
      console.log('❌ Learner not found!');
    }

    // Cleanup (optional - comment out if you want to keep test data)
    // await Learner.destroy({ where: { studentId: testStudentId } });
    // console.log('🧹 Test data cleaned up');

    await sequelize.close();
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testLearner();
