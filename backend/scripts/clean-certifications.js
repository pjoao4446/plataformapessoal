import { db } from '../src/db/index.js';

console.log('🧹 Removendo certificações dos módulos essenciais...');

// Remover cursos de certificação que estão como módulos essenciais (IDs 4-23)
const idsToRemove = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];

for (const id of idsToRemove) {
  try {
    // Primeiro, remover quizzes relacionados
    const lessons = db.prepare('SELECT id FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = ?)').all(id);
    const lessonIds = lessons.map(l => l.id);
    
    if (lessonIds.length > 0) {
      db.prepare(`DELETE FROM quizzes WHERE lesson_id IN (${lessonIds.map(() => '?').join(',')})`).run(...lessonIds);
    }
    
    // Remover lessons
    db.prepare('DELETE FROM lessons WHERE module_id IN (SELECT id FROM modules WHERE course_id = ?)').run(id);
    
    // Remover modules
    db.prepare('DELETE FROM modules WHERE course_id = ?').run(id);
    
    // Remover curso
    db.prepare('DELETE FROM courses WHERE id = ?').run(id);
    
    console.log(`✅ Removido curso ID ${id}`);
  } catch (error) {
    console.error(`❌ Erro ao remover curso ID ${id}:`, error);
  }
}

console.log('🎉 Limpeza concluída!');

// Verificar cursos restantes
const remainingCourses = db.prepare('SELECT id, title, type, segment, level FROM courses ORDER BY id').all();
console.log('\nCursos restantes:');
remainingCourses.forEach(c => {
  console.log(`ID: ${c.id} | ${c.title} | ${c.type} | ${c.segment} | ${c.level}`);
});

