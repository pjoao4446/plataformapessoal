import { db } from '../src/db/index.js';

console.log('Checking modules table...');

try {
  const modulesColumns = db.prepare("PRAGMA table_info(modules)").all();
  console.log('Modules table columns:');
  modulesColumns.forEach(col => {
    console.log(`- ${col.name}: ${col.type} (nullable: ${col.notnull === 0})`);
  });
} catch (error) {
  console.log('Modules table does not exist:', error.message);
}

try {
  const topicsColumns = db.prepare("PRAGMA table_info(topics)").all();
  console.log('Topics table columns:');
  topicsColumns.forEach(col => {
    console.log(`- ${col.name}: ${col.type} (nullable: ${col.notnull === 0})`);
  });
} catch (error) {
  console.log('Topics table does not exist:', error.message);
}

try {
  const courseModulesColumns = db.prepare("PRAGMA table_info(course_modules)").all();
  console.log('Course_modules table columns:');
  courseModulesColumns.forEach(col => {
    console.log(`- ${col.name}: ${col.type} (nullable: ${col.notnull === 0})`);
  });
} catch (error) {
  console.log('Course_modules table does not exist:', error.message);
}

