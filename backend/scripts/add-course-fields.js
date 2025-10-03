import { db } from '../src/db/index.js';

console.log('🔄 Adicionando novos campos à tabela courses...');

// Verificar se os novos campos já existem
const courseCols = db.prepare("PRAGMA table_info(courses)").all();
const hasBannerPath = courseCols.some((c) => c.name === 'banner_path');
const hasDuration = courseCols.some((c) => c.name === 'duration');
const hasTopics = courseCols.some((c) => c.name === 'topics_json');

if (!hasBannerPath || !hasDuration || !hasTopics) {
  console.log('📝 Criando nova estrutura da tabela courses...');
  
  // Criar nova tabela com os campos adicionais
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
      banner_path TEXT,
      duration TEXT,
      topics_json TEXT,
      created_by INTEGER,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
    );
  `);
  
  // Copiar dados existentes
  console.log('📋 Copiando dados existentes...');
  db.exec(`
    INSERT INTO courses_new (
      id, title, subtitle, description, type, segment, level, provider, 
      image_path, banner_path, duration, topics_json, created_by, created_at
    )
    SELECT 
      id, title, subtitle, description, type, segment, level, provider,
      image_path, NULL as banner_path, NULL as duration, NULL as topics_json, 
      created_by, created_at
    FROM courses
  `);
  
  // Substituir tabela antiga
  console.log('🔄 Substituindo tabela antiga...');
  db.exec(`DROP TABLE courses;`);
  db.exec(`ALTER TABLE courses_new RENAME TO courses;`);
  
  console.log('✅ Migração concluída com sucesso!');
} else {
  console.log('✅ Todos os campos já existem na tabela courses.');
}

console.log('🎉 Script finalizado!');

