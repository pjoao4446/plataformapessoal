import { db } from '../src/db/index.js';

console.log('Checking modules data...');

try {
  const modules = db.prepare('SELECT * FROM modules').all();
  console.log('Modules found:', modules.length);
  modules.forEach(module => {
    console.log(`- Module ${module.id}: ${module.title} (Course: ${module.course_id}, Position: ${module.position})`);
  });
} catch (error) {
  console.log('Error fetching modules:', error.message);
}

try {
  const topics = db.prepare('SELECT * FROM topics').all();
  console.log('Topics found:', topics.length);
  topics.forEach(topic => {
    console.log(`- Topic ${topic.id}: ${topic.title} (Module: ${topic.module_id}, Position: ${topic.position})`);
  });
} catch (error) {
  console.log('Error fetching topics:', error.message);
}

try {
  const courses = db.prepare('SELECT * FROM courses').all();
  console.log('Courses found:', courses.length);
  courses.forEach(course => {
    console.log(`- Course ${course.id}: ${course.title}`);
  });
} catch (error) {
  console.log('Error fetching courses:', error.message);
}

