const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
console.log('Database path:', dbPath);

const db = new Database(dbPath);

try {
  // Testar se conseguimos acessar a tabela courses
  const courses = db.prepare('SELECT * FROM courses LIMIT 1').all();
  console.log('✅ Tabela courses acessível');
  console.log('Cursos encontrados:', courses.length);
  
  if (courses.length > 0) {
    console.log('Primeiro curso:', courses[0]);
  }
} catch (error) {
  console.error('❌ Erro ao acessar tabela courses:', error);
}

try {
  // Testar se conseguimos acessar a tabela modules
  const modules = db.prepare('SELECT * FROM modules LIMIT 1').all();
  console.log('✅ Tabela modules acessível');
  console.log('Módulos encontrados:', modules.length);
} catch (error) {
  console.error('❌ Erro ao acessar tabela modules:', error);
}

db.close();

