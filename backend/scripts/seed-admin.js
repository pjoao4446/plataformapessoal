import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] || 'Admin User';

if (!email || !password) {
  console.error('Usage: node scripts/seed-admin.js <email> <password> [name]');
  process.exit(1);
}

const dbDirectory = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDirectory, 'app.sqlite');
if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

const db = new Database(dbPath);

// Ensure tables exist (idempotent)
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('aluno','professor','admin')) DEFAULT 'aluno',
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

const existing = db.prepare('SELECT id, role FROM users WHERE email = ?').get(email);
if (existing) {
  console.log(JSON.stringify({ ok: true, message: 'User already exists', id: existing.id, role: existing.role }));
  process.exit(0);
}

const password_hash = await bcrypt.hash(password, 10);
const info = db
  .prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
  .run(name, email, password_hash, 'admin');

const user = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(info.lastInsertRowid);
console.log(JSON.stringify({ ok: true, user }));





