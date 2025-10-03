import { db } from '../src/db/index.js';

// Ensure users table has the latest schema (rebuild if needed)
const userCols = db.prepare("PRAGMA table_info(users)").all();
const hasUsers = userCols.length > 0;
const hasPasswordHash = userCols.some((c) => c.name === 'password_hash');
const hasRole = userCols.some((c) => c.name === 'role');
const hasPhone = userCols.some((c) => c.name === 'phone');
const hasBio = userCols.some((c) => c.name === 'bio');
const hasLocation = userCols.some((c) => c.name === 'location');
const hasWebsite = userCols.some((c) => c.name === 'website');
const hasLinkedin = userCols.some((c) => c.name === 'linkedin');
const hasGithub = userCols.some((c) => c.name === 'github');
const hasAvatar = userCols.some((c) => c.name === 'avatar_path');
const hasUpdatedAt = userCols.some((c) => c.name === 'updated_at');

if (hasUsers && (!hasPasswordHash || !hasRole || !hasPhone || !hasBio || !hasLocation || !hasWebsite || !hasLinkedin || !hasGithub || !hasAvatar || !hasUpdatedAt)) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('aluno','professor','admin')) DEFAULT 'aluno',
      phone TEXT,
      bio TEXT,
      location TEXT,
      website TEXT,
      linkedin TEXT,
      github TEXT,
      avatar_path TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
  // Copy over existing data where possible; initialize new fields
  if (userCols.some((c) => c.name === 'name') && userCols.some((c) => c.name === 'email')) {
    const existingCols = userCols.map(c => c.name).join(', ');
    const selectCols = userCols.map(c => c.name).concat(['phone', 'bio', 'location', 'website', 'linkedin', 'github', 'avatar_path', 'updated_at']).join(', ');
    const defaultValues = userCols.map(c => c.name).concat(['NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'datetime(\'now\')']).join(', ');
    
    db.exec(`INSERT INTO users_new (${selectCols})
             SELECT ${defaultValues}
             FROM users`);
  }
  db.exec(`DROP TABLE users;`);
  db.exec(`ALTER TABLE users_new RENAME TO users;`);
}

// Ensure courses table has the latest schema (rebuild if needed)
const courseCols = db.prepare("PRAGMA table_info(courses)").all();
const hasCourses = courseCols.length > 0;
const hasSubtitle = courseCols.some((c) => c.name === 'subtitle');
const hasType = courseCols.some((c) => c.name === 'type');
const hasSegment = courseCols.some((c) => c.name === 'segment');
const hasLevel = courseCols.some((c) => c.name === 'level');
const hasProvider = courseCols.some((c) => c.name === 'provider');
const hasImagePath = courseCols.some((c) => c.name === 'image_path');
if (hasCourses && (!hasSubtitle || !hasType || !hasSegment || !hasLevel || !hasProvider || !hasImagePath)) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS courses_new (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT,
      description TEXT,
      type TEXT NOT NULL CHECK (type IN ('modulo_essencial','trilha_especializacao')) DEFAULT 'modulo_essencial',
      segment TEXT NOT NULL CHECK (segment IN ('infraestrutura','desenvolvimento','dados')) DEFAULT 'infraestrutura',
      level TEXT NOT NULL CHECK (level IN ('fundamentos','intermediario','avancado')) DEFAULT 'fundamentos',
      provider TEXT CHECK (provider IN ('aws','azure','gcp')),
      image_path TEXT,
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );
  `);
  // Copy over existing data where possible
  if (courseCols.some((c) => c.name === 'title')) {
    db.exec(`INSERT INTO courses_new (id, title, subtitle, description, type, segment, level, provider, image_path, created_by, created_at)
             SELECT id, title, '' as subtitle, description, 'modulo_essencial' as type, 'infraestrutura' as segment, 'fundamentos' as level, NULL as provider, '' as image_path, created_by, created_at
             FROM courses`);
  }
  db.exec(`DROP TABLE courses;`);
  db.exec(`ALTER TABLE courses_new RENAME TO courses;`);
}

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('aluno','professor','admin')) DEFAULT 'aluno',
    phone TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    linkedin TEXT,
    github TEXT,
    avatar_path TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    subtitle TEXT,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('modulo_essencial','trilha_especializacao')) DEFAULT 'modulo_essencial',
    segment TEXT NOT NULL CHECK (segment IN ('infraestrutura','desenvolvimento','dados')) DEFAULT 'infraestrutura',
    level TEXT NOT NULL CHECK (level IN ('fundamentos','intermediario','avancado')) DEFAULT 'fundamentos',
    provider TEXT CHECK (provider IN ('aws','azure','gcp')),
    image_path TEXT,
    created_by INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  );

  CREATE TABLE IF NOT EXISTS modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS lessons (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    video_url TEXT,
    summary TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS quizzes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    lesson_id INTEGER NOT NULL,
    question TEXT NOT NULL,
    options_json TEXT NOT NULL,
    correct_option_index INTEGER NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS password_resets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT UNIQUE NOT NULL,
    expires_at TEXT NOT NULL,
    used_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

// Create certifications table
db.exec(`
  CREATE TABLE IF NOT EXISTS certifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    image_path TEXT,
    url TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  );
`);

console.log('Migration complete.');


