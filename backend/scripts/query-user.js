import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const email = process.argv[2];
if (!email) {
  console.error('Usage: node scripts/query-user.js <email>');
  process.exit(1);
}

const dbDirectory = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDirectory, 'app.sqlite');
if (!fs.existsSync(dbDirectory)) {
  console.error('DB directory not found:', dbDirectory);
  process.exit(1);
}
const db = new Database(dbPath);
const row = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE email = ?').get(email);
console.log(JSON.stringify(row || null));


