/**
 * Seed script: creates one teacher (no class), then one class assigned to that teacher.
 * Run with: npx tsx scripts/seed-teacher-and-class.ts
 *
 * Ensure the API server is running (e.g. npm run dev) on http://localhost:3000
 * Classes assign teachers; teachers do not require a class.
 */

const BASE = process.env.API_URL ?? 'http://localhost:3000';

async function createTeacher(name: string, description: string): Promise<void> {
  const res = await fetch(`${BASE}/v1/teachers`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, description }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Create teacher failed: ${res.status} ${JSON.stringify(data)}`);
  console.log('Teacher created:', name);
}

async function getTeachers(): Promise<{ teacherId: string; name: string }[]> {
  const res = await fetch(`${BASE}/v1/teachers`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Get teachers failed: ${res.status} ${JSON.stringify(data)}`);
  return data.data ?? [];
}

async function createClass(name: string, teacherId: string): Promise<void> {
  const res = await fetch(`${BASE}/v1/classes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, teacherId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Create class failed: ${res.status} ${JSON.stringify(data)}`);
  console.log('Class created:', name, 'with teacher', teacherId);
}

async function main(): Promise<void> {
  const className = process.env.CLASS_NAME ?? 'Seed Class';
  const teacherName = process.env.TEACHER_NAME ?? 'Seed Teacher';
  const teacherDescription = process.env.TEACHER_DESCRIPTION ?? 'Created by seed script';

  console.log('Creating teacher (no class)...');
  await createTeacher(teacherName, teacherDescription);

  const teachers = await getTeachers();
  const teacher = teachers.find((t) => t.name === teacherName);
  if (!teacher) throw new Error(`Could not find created teacher "${teacherName}"`);

  console.log('Creating class and assigning teacher...');
  await createClass(className, teacher.teacherId);

  console.log('Done. Teacher:', teacher.teacherId, '| Class:', className);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
