import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'app.sqlite');
const db = new Database(dbPath);

const cols = db.prepare('PRAGMA table_info(courses)').all();
console.log('Courses table columns:');
cols.forEach(col => {
  console.log(`- ${col.name}: ${col.type} (nullable: ${col.notnull === 0})`);
});

