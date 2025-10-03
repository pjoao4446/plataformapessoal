import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import path from 'path';
import fs from 'fs';

const email = process.argv[2];
const role = process.argv[3];
const password = process.argv[4] || null;

if (!email || !role) {
  console.error('Usage: node scripts/update-user-role.js <email> <role: aluno|professor|admin> [newPassword]');
  process.exit(1);
}

const allowed = ['aluno', 'professor', 'admin'];
if (!allowed.includes(role)) {
  console.error('Invalid role. Allowed:', allowed.join(','));
  process.exit(1);
}

const dbDirectory = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDirectory, 'app.sqlite');
if (!fs.existsSync(dbDirectory)) {
  console.error('DB directory not found:', dbDirectory);
  process.exit(1);
}

const db = new Database(dbPath);
const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
if (!user) {
  console.error('User not found for email:', email);
  process.exit(1);
}

let password_hash = user.password_hash;
if (password) {
  password_hash = await bcrypt.hash(password, 10);
}

db.prepare('UPDATE users SET role = ?, password_hash = ? WHERE id = ?').run(role, password_hash, user.id);

const updated = db.prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(user.id);
console.log(JSON.stringify({ ok: true, user: updated }));





