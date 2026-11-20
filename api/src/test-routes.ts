import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import type { LearnerListResponseDto } from './routes/learners/dto';

const collection = `${process.env.API_URL || 'http://localhost:3000'}/v1/learners`;

async function checkResponse(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const response = await fetch(url, options);
  assert.ok(
    response.ok,
    `${options?.method ?? 'GET'} ${url} returned ${response.status}`
  );
  return response;
}

async function getLearners(url: string) {
  const response = await checkResponse(url);
  const body = (await response.json()) as LearnerListResponseDto;
  assert.ok(Array.isArray(body.data), 'Expected a list of learners');
  return body.data;
}

async function testRoutes() {
  const fixture = {
    studentId: `ROUTE-TEST-${randomUUID()}`,
    name: 'Route Test Student',
    classId: 'TEST-CLASS-001',
  };
  const item = `${collection}/${fixture.studentId}`;
  await checkResponse(collection, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fixture),
  });
  try {
    const found = await getLearners(item);
    assert.equal(found.length, 1);
    assert.equal(found[0].studentId, fixture.studentId);
    assert.equal(found[0].name, fixture.name);
    assert.equal(found[0].classId, fixture.classId);

    const list = await getLearners(collection);
    assert.ok(list.some((learner) => learner.studentId === fixture.studentId));
  } finally {
    await checkResponse(item, { method: 'DELETE' });
  }
  console.log('Learner HTTP smoke check passed.');
}

testRoutes().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
