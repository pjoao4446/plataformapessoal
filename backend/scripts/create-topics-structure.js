import { db } from '../src/db/index.js';

console.log('Creating topics structure...');

// Create topics table
db.exec(`
  CREATE TABLE IF NOT EXISTS topics (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    module_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    content_type TEXT CHECK (content_type IN ('text', 'video')) DEFAULT 'text',
    text_content TEXT,
    video_path TEXT,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE
  );
`);

// Create course_modules table if it doesn't exist (for progress tracking)
db.exec(`
  CREATE TABLE IF NOT EXISTS course_modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_id INTEGER NOT NULL,
    module_id INTEGER NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (module_id) REFERENCES modules(id) ON DELETE CASCADE,
    UNIQUE(course_id, module_id)
  );
`);

// Create topic_progress table for tracking user progress on topics
db.exec(`
  CREATE TABLE IF NOT EXISTS topic_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    topic_id INTEGER NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT 0,
    completed_at TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (topic_id) REFERENCES topics(id) ON DELETE CASCADE,
    UNIQUE(user_id, topic_id)
  );
`);

// Add indexes for better performance
db.exec(`
  CREATE INDEX IF NOT EXISTS idx_topics_module_id ON topics(module_id);
  CREATE INDEX IF NOT EXISTS idx_topics_position ON topics(position);
  CREATE INDEX IF NOT EXISTS idx_course_modules_course_id ON course_modules(course_id);
  CREATE INDEX IF NOT EXISTS idx_course_modules_module_id ON course_modules(module_id);
  CREATE INDEX IF NOT EXISTS idx_topic_progress_user_id ON topic_progress(user_id);
  CREATE INDEX IF NOT EXISTS idx_topic_progress_topic_id ON topic_progress(topic_id);
`);

console.log('Topics structure created successfully!');
console.log('Tables created:');
console.log('- topics: For storing course topics with content');
console.log('- course_modules: For linking modules to courses');
console.log('- topic_progress: For tracking user progress on topics');

