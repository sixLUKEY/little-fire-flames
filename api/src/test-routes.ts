const BASE_URL = process.env.API_URL || 'http://localhost:3000';

async function testRoutes() {
  const testStudentId = `ROUTE-TEST-${Date.now()}`;

  console.log('🧪 Testing Learner Routes\n');
  console.log(`Test Student ID: ${testStudentId}\n`);

  try {
    // Test 1: Create Learner
    console.log('📝 Test 1: Creating learner via POST /v1/learners');
    const createResponse = await fetch(`${BASE_URL}/v1/learners`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId: testStudentId,
        name: 'Route Test Student',
        classId: 'TEST-CLASS-001',
      }),
    });

    if (createResponse.ok) {
      console.log(
        '✅ POST request successful (status:',
        createResponse.status,
        ')'
      );
    } else {
      const errorText = await createResponse.text();
      console.log('❌ POST request failed:', createResponse.status, errorText);
      throw new Error(`POST failed with status ${createResponse.status}`);
    }

    // Small delay to ensure DB write completes
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Test 2: Get Learner by ID
    console.log(
      `\n🔍 Test 2: Retrieving learner via GET /v1/learners/${testStudentId}`
    );
    const getResponse = await fetch(`${BASE_URL}/v1/learners/${testStudentId}`);

    if (getResponse.ok) {
      const data: any = await getResponse.json();
      console.log('✅ GET request successful');
      console.log('📦 Response data:', JSON.stringify(data, null, 2));

      if (data.data && data.data.length > 0) {
        const learner = data.data[0];
        if (learner.studentId === testStudentId) {
          console.log(
            '\n✅ Test passed! Route create and retrieve working correctly.'
          );
          console.log('   Created and found learner:', {
            studentId: learner.studentId,
            name: learner.name,
            classId: learner.classId,
          });
        } else {
          console.log('❌ Student ID mismatch!');
        }
      } else {
        console.log('❌ No learner found in response!');
      }
    } else {
      const errorText = await getResponse.text();
      console.log('❌ GET request failed:', getResponse.status, errorText);
      throw new Error(`GET failed with status ${getResponse.status}`);
    }

    // Test 3: Get All Learners
    console.log(`\n🔍 Test 3: Retrieving all learners via GET /v1/learners`);
    const getAllResponse = await fetch(`${BASE_URL}/v1/learners`);

    if (getAllResponse.ok) {
      const data: any = await getAllResponse.json();
      console.log('✅ GET all request successful');
      console.log('📦 Response data:', JSON.stringify(data, null, 2));
      console.log(`   Found ${data.data?.length || 0} learners`);
    } else {
      const errorText = await getAllResponse.text();
      console.log(
        '❌ GET all request failed:',
        getAllResponse.status,
        errorText
      );
      throw new Error(`GET all failed with status ${getAllResponse.status}`);
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

testRoutes();
