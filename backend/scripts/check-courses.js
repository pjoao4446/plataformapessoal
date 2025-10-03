import { db } from '../src/db/index.js';

const courses = db.prepare('SELECT id, title, type, segment, level, provider FROM courses ORDER BY id').all();

console.log('Cursos no banco:');
courses.forEach(c => {
  console.log(`ID: ${c.id} | ${c.title} | ${c.type} | ${c.segment} | ${c.level} | ${c.provider || 'null'}`);
});

console.log(`\nTotal: ${courses.length} cursos`);

