import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Always use backend/data as the DB directory, regardless of where the process is started
const dbDirectory = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDirectory, 'app.sqlite');

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

export const db = new Database(dbPath);

db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function runInTransaction(callback) {
  const begin = db.prepare('BEGIN');
  const commit = db.prepare('COMMIT');
  const rollback = db.prepare('ROLLBACK');
  try {
    begin.run();
    const result = callback(db);
    commit.run();
    return result;
  } catch (error) {
    rollback.run();
    throw error;
  }
}


