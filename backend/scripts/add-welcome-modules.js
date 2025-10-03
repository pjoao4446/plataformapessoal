const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new Database(dbPath);

console.log('🚀 Adicionando módulos "Bem-vindo" aos cursos existentes...');

try {
  // Buscar todos os cursos
  const courses = db.prepare('SELECT * FROM courses').all();
  console.log(`📚 Encontrados ${courses.length} cursos`);

  let addedModules = 0;
  let addedTopics = 0;

  courses.forEach(course => {
    console.log(`\n📖 Processando curso: ${course.title}`);
    
    // Verificar se o curso já tem módulos
    const existingModules = db.prepare('SELECT * FROM modules WHERE course_id = ?').all(course.id);
    console.log(`   📋 Módulos existentes: ${existingModules.length}`);
    
    // Se não tem módulos ou não tem um módulo "Bem-vindo", criar
    const hasWelcomeModule = existingModules.some(module => module.title === 'Bem-vindo');
    
    if (!hasWelcomeModule) {
      // Criar o módulo "Bem-vindo"
      const moduleStmt = db.prepare('INSERT INTO modules (course_id, title, position) VALUES (?, ?, ?)');
      const moduleResult = moduleStmt.run(course.id, 'Bem-vindo', 1);
      const moduleId = moduleResult.lastInsertRowid;
      
      console.log(`   ✅ Módulo "Bem-vindo" criado (ID: ${moduleId})`);
      addedModules++;
      
      // Criar o tópico "Apresentação do Curso"
      const topicStmt = db.prepare('INSERT INTO topics (module_id, title, description, content_type, position) VALUES (?, ?, ?, ?, ?)');
      const topicResult = topicStmt.run(
        moduleId, 
        'Apresentação do Curso', 
        'Vídeo de boas-vindas e apresentação do curso', 
        'video', 
        1
      );
      
      console.log(`   ✅ Tópico "Apresentação do Curso" criado (ID: ${topicResult.lastInsertRowid})`);
      addedTopics++;
      
      // Ajustar posições dos outros módulos se existirem
      if (existingModules.length > 0) {
        console.log(`   🔄 Ajustando posições dos módulos existentes...`);
        existingModules.forEach((module, index) => {
          const updateStmt = db.prepare('UPDATE modules SET position = ? WHERE id = ?');
          updateStmt.run(index + 2, module.id); // +2 porque o "Bem-vindo" está na posição 1
        });
        console.log(`   ✅ Posições ajustadas`);
      }
    } else {
      console.log(`   ⏭️  Módulo "Bem-vindo" já existe`);
    }
  });

  console.log(`\n🎉 Processo concluído!`);
  console.log(`📊 Estatísticas:`);
  console.log(`   - Módulos "Bem-vindo" adicionados: ${addedModules}`);
  console.log(`   - Tópicos "Apresentação do Curso" adicionados: ${addedTopics}`);
  console.log(`   - Total de cursos processados: ${courses.length}`);

} catch (error) {
  console.error('❌ Erro ao processar cursos:', error);
} finally {
  db.close();
}

