import { db } from '../src/db/index.js';

console.log('Criando tabelas de progresso...');

try {
  // Tabela para armazenar módulos dos cursos
  db.exec(`
    CREATE TABLE IF NOT EXISTS course_modules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      order_index INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
    )
  `);

  // Tabela para armazenar progresso geral do curso por usuário
  db.exec(`
    CREATE TABLE IF NOT EXISTS course_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      progress_percentage INTEGER DEFAULT 0,
      completed_modules INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
      UNIQUE(user_id, course_id)
    )
  `);

  // Tabela para armazenar progresso individual de cada módulo por usuário
  db.exec(`
    CREATE TABLE IF NOT EXISTS module_progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      course_id INTEGER NOT NULL,
      module_id INTEGER NOT NULL,
      completed BOOLEAN DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
      FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE,
      FOREIGN KEY (module_id) REFERENCES course_modules (id) ON DELETE CASCADE,
      UNIQUE(user_id, course_id, module_id)
    )
  `);

  console.log('✅ Tabelas de progresso criadas com sucesso!');

  // Criar alguns módulos de exemplo para cursos existentes
  const courses = db.prepare('SELECT id, title FROM courses LIMIT 5').all();
  
  for (const course of courses) {
    // Verificar se já existem módulos para este curso
    const existingModules = db.prepare('SELECT COUNT(*) as count FROM course_modules WHERE course_id = ?').get(course.id);
    
    if (existingModules.count === 0) {
      // Criar módulos de exemplo
      const modules = [
        { title: 'Introdução', description: 'Conceitos básicos e introdução ao tema', order: 1 },
        { title: 'Fundamentos', description: 'Fundamentos essenciais para o aprendizado', order: 2 },
        { title: 'Prática', description: 'Exercícios práticos e aplicação dos conceitos', order: 3 },
        { title: 'Projeto Final', description: 'Desenvolvimento de um projeto completo', order: 4 }
      ];

      for (const module of modules) {
        db.prepare(`
          INSERT INTO course_modules (course_id, title, description, order_index)
          VALUES (?, ?, ?, ?)
        `).run(course.id, module.title, module.description, module.order);
      }

      console.log(`📚 Módulos criados para o curso: ${course.title}`);
    }
  }

  console.log('🎉 Migração concluída com sucesso!');

} catch (error) {
  console.error('❌ Erro na migração:', error);
  process.exit(1);
}

