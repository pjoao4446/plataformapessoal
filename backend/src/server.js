import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { z } from 'zod';
import { db, runInTransaction, prepare, exec, executeQuery } from './db/index.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import videoUploadRouter from './routes/videoUpload.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function createToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

function authMiddleware(req, res, next) {
  console.log('🔐 Verificando autenticação...');
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  console.log('🔑 Token presente:', !!token);
  console.log('🔑 Header Authorization:', header.substring(0, 20) + '...');
  
  if (!token) {
    console.log('❌ Token não encontrado');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido para usuário:', decoded.id);
    req.user = decoded;
    next();
  } catch (e) {
    console.log('❌ Token inválido:', e.message);
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    console.log('👤 Verificando permissões...');
    console.log('👤 Usuário:', req.user ? req.user.id : 'Nenhum');
    console.log('👤 Role do usuário:', req.user ? req.user.role : 'Nenhuma');
    console.log('👤 Roles permitidas:', allowed);
    
    if (!req.user || !allowed.includes(req.user.role)) {
      console.log('❌ Acesso negado');
      return res.status(403).json({ error: 'Forbidden' });
    }
    console.log('✅ Acesso permitido');
    next();
  };
}

const app = express();
app.use(cors());
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// Static uploads
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir));

// Rotas de upload de vídeo
app.use('/api/videos', videoUploadRouter);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || '');
    cb(null, `course-${unique}${ext}`);
  },
});

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || '');
    cb(null, `avatar-${unique}${ext}`);
  },
});

const upload = multer({ storage });
const avatarUpload = multer({ storage: avatarStorage });

// Configuração para upload de vídeos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const videoDir = path.join(uploadsDir, 'videos');
    if (!fs.existsSync(videoDir)) fs.mkdirSync(videoDir, { recursive: true });
    cb(null, videoDir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname || '');
    cb(null, `video-${unique}${ext}`);
  },
});

const videoUpload = multer({ 
  storage: videoStorage,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Apenas arquivos de vídeo são permitidos!'), false);
    }
  }
});

const CourseSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  type: z.enum(['modulo_essencial', 'trilha_especializacao']),
  segment: z.enum(['infraestrutura', 'desenvolvimento', 'dados']),
  level: z.enum(['fundamentos', 'intermediario', 'avancado']),
  provider: z.enum(['aws', 'azure', 'gcp']).optional().nullable(),
  image_path: z.string().optional().nullable(),
  banner_path: z.string().optional().nullable(),
  duration: z.string().optional().nullable(),
  created_by: z.number().int().optional().nullable(),
});

const ModuleSchema = z.object({
  course_id: z.number().int(),
  title: z.string().min(1),
  position: z.number().int().optional(),
});

const LessonSchema = z.object({
  module_id: z.number().int(),
  title: z.string().min(1),
  video_url: z.string().url().optional().nullable(),
  summary: z.string().optional().nullable(),
  position: z.number().int().optional(),
});

const TopicSchema = z.object({
  module_id: z.number().int(),
  title: z.string().min(1),
  description: z.string().optional().nullable(),
  content_type: z.enum(['text', 'video']).optional().default('text'),
  text_content: z.string().optional().nullable(),
  content: z.string().optional().nullable(), // Para conteúdo HTML do editor
  video_path: z.string().optional().nullable(),
  position: z.number().int().optional(),
});

const QuizSchema = z.object({
  lesson_id: z.number().int(),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2),
  correct_option_index: z.number().int().nonnegative(),
  position: z.number().int().optional(),
});

// Healthcheck
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Auth
app.post('/auth/register', async (req, res) => {
  const Body = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(['aluno', 'professor', 'admin']).optional(),
  });
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { name, email, password, role } = parsed.data;
  try {
    const existing = await prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) return res.status(409).json({ error: 'Email já cadastrado' });
    const password_hash = await bcrypt.hash(password, 10);
    const info = await prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)').run(name, email, password_hash, role ?? 'aluno');
    const user = await prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(info.lastInsertRowid);
    const token = createToken({ id: user.id, role: user.role, email: user.email, name: user.name });
    res.status(201).json({ user, token });
  } catch (e) {
    console.error('Erro no registro:', e);
    res.status(500).json({ error: 'Erro ao registrar' });
  }
});

app.post('/auth/login', async (req, res) => {
  const Body = z.object({ email: z.string().email(), password: z.string().min(1) });
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email, password } = parsed.data;
  try {
    const user = await prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: 'Credenciais inválidas' });
    const token = createToken({ id: user.id, role: user.role, email: user.email, name: user.name });
    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, created_at: user.created_at },
      token,
    });
  } catch (e) {
    console.error('Erro no login:', e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/auth/me', authMiddleware, async (req, res) => {
  try {
    const user = await prepare('SELECT id, name, email, role, created_at FROM users WHERE id = ?').get(req.user.id);
    if (!user) return res.status(404).json({ error: 'Not found' });
    res.json({ user });
  } catch (e) {
    console.error('Erro ao buscar usuário:', e);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Ranking endpoints
app.get('/ranking/users', (req, res) => {
  const users = db.prepare(`
    SELECT 
      id, 
      name, 
      email, 
      avatar_path,
      created_at
    FROM users 
    ORDER BY created_at DESC
  `).all();
  
  // Definir usuários específicos como top 1 de cada segmento
  const topUsers = {
    geral: users.find(u => u.name === 'João Paulo') || users[0],
    infraestrutura: users.find(u => u.name === 'Allan Queiroz Macedo') || users[1] || users[0],
    desenvolvimento: users.find(u => u.name === 'Luiz Fernando Oliveira Gonçalves') || users[2] || users[0],
    dados: users.find(u => u.name === 'Nicolle Cristen') || users[3] || users[0]
  };
  
  // Criar array com os top users primeiro
  const topUsersArray = [
    { ...topUsers.geral, segment: 'Geral', elo: 'DIAMANTE', xp: 15000, position: 1 },
    { ...topUsers.infraestrutura, segment: 'INFRAESTRUTURA', elo: 'DIAMANTE', xp: 14000, position: 2 },
    { ...topUsers.desenvolvimento, segment: 'DESENVOLVIMENTO', elo: 'DIAMANTE', xp: 13000, position: 3 },
    { ...topUsers.dados, segment: 'CIÊNCIA DE DADOS', elo: 'DIAMANTE', xp: 12000, position: 4 }
  ];
  
  // Adicionar outros usuários
  const otherUsers = users.filter(user => 
    user.id !== topUsers.geral.id && 
    user.id !== topUsers.infraestrutura.id && 
    user.id !== topUsers.desenvolvimento.id && 
    user.id !== topUsers.dados.id
  ).map((user, index) => {
    const segments = ['INFRAESTRUTURA', 'CIÊNCIA DE DADOS', 'DESENVOLVIMENTO'];
    const segment = segments[index % 3];
    const elo = index < 3 ? 'MESTRE' : index < 6 ? 'PLATINA' : 'OURO';
    const xp = Math.floor(Math.random() * 8000) + 3000;
    
    return {
      ...user,
      segment,
      elo,
      xp,
      position: 5 + index
    };
  });
  
  let usersWithRanking = [...topUsersArray, ...otherUsers];
  
  // Se temos menos de 10 usuários, adicionar usuários mockados
  if (usersWithRanking.length < 10) {
    const mockUsers = [
      { id: 999, name: "Ana Silva", email: "ana@mock.com", avatar_path: null, elo: "OURO", xp: 8500, segment: "INFRAESTRUTURA" },
      { id: 998, name: "Pedro Santos", email: "pedro@mock.com", avatar_path: null, elo: "PRATA", xp: 7200, segment: "CIÊNCIA DE DADOS" },
      { id: 997, name: "Lucia Costa", email: "lucia@mock.com", avatar_path: null, elo: "PRATA", xp: 6800, segment: "DESENVOLVIMENTO" },
      { id: 996, name: "Rafael Lima", email: "rafael@mock.com", avatar_path: null, elo: "BRONZE", xp: 6200, segment: "INFRAESTRUTURA" },
      { id: 995, name: "Fernanda Rocha", email: "fernanda@mock.com", avatar_path: null, elo: "BRONZE", xp: 5800, segment: "CIÊNCIA DE DADOS" },
      { id: 994, name: "Diego Alves", email: "diego@mock.com", avatar_path: null, elo: "BRONZE", xp: 5400, segment: "DESENVOLVIMENTO" },
      { id: 993, name: "Mariana Souza", email: "mariana@mock.com", avatar_path: null, elo: "BRONZE", xp: 5000, segment: "INFRAESTRUTURA" },
      { id: 992, name: "Carlos Oliveira", email: "carlos@mock.com", avatar_path: null, elo: "BRONZE", xp: 4600, segment: "CIÊNCIA DE DADOS" },
      { id: 991, name: "Juliana Ferreira", email: "juliana@mock.com", avatar_path: null, elo: "BRONZE", xp: 4200, segment: "DESENVOLVIMENTO" },
      { id: 990, name: "Gabriel Martins", email: "gabriel@mock.com", avatar_path: null, elo: "BRONZE", xp: 3800, segment: "INFRAESTRUTURA" }
    ];
    
    // Adicionar usuários mockados até completar 10
    const neededUsers = 10 - usersWithRanking.length;
    const additionalMockUsers = mockUsers.slice(0, neededUsers).map((user, index) => ({
      ...user,
      position: usersWithRanking.length + index + 1
    }));
    
    usersWithRanking = [...usersWithRanking, ...additionalMockUsers];
  }
  
  res.json(usersWithRanking);
});

// Password reset
app.post('/auth/forgot-password', (req, res) => {
  const Body = z.object({ email: z.string().email() });
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { email } = parsed.data;
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  // Always return ok to prevent user enumeration
  if (!user) return res.json({ ok: true });
  const token = crypto.randomBytes(24).toString('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30).toISOString(); // 30 minutes
  db.prepare('INSERT INTO password_resets (user_id, token, expires_at) VALUES (?,?,?)').run(user.id, token, expiresAt);
  // In a real app, send email with link containing token. For dev, return token
  res.json({ ok: true, token });
});

app.post('/auth/reset-password', async (req, res) => {
  const Body = z.object({ token: z.string().min(1), password: z.string().min(6) });
  const parsed = Body.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { token, password } = parsed.data;
  const row = db.prepare('SELECT * FROM password_resets WHERE token = ?').get(token);
  if (!row) return res.status(400).json({ error: 'Token inválido' });
  if (row.used_at) return res.status(400).json({ error: 'Token já utilizado' });
  if (new Date(row.expires_at).getTime() < Date.now()) return res.status(400).json({ error: 'Token expirado' });
  const password_hash = await bcrypt.hash(password, 10);
  db.prepare('UPDATE users SET password_hash = ? WHERE id = ?').run(password_hash, row.user_id);
  db.prepare('UPDATE password_resets SET used_at = ? WHERE id = ?').run(new Date().toISOString(), row.id);
  res.json({ ok: true });
});

// Courses
app.get('/courses', (req, res) => {
  const courses = db.prepare('SELECT * FROM courses ORDER BY id DESC').all();
  res.json(courses);
});

app.get('/courses/:id', (req, res) => {
  const id = Number(req.params.id);
  const course = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  if (!course) return res.status(404).json({ error: 'Not found' });
  
  // Buscar módulos da nova tabela course_modules
  const courseModules = db.prepare(`
    SELECT id, title, description, order_index
    FROM course_modules 
    WHERE course_id = ? 
    ORDER BY order_index ASC
  `).all(id);
  
  // Manter compatibilidade com a estrutura antiga
  const modules = db
    .prepare('SELECT * FROM modules WHERE course_id = ? ORDER BY position, id')
    .all(id);
  const moduleIds = modules.map((m) => m.id);
  
  // Buscar tópicos dos módulos
  const topics = moduleIds.length
    ? db
        .prepare(
          `SELECT * FROM topics WHERE module_id IN (${moduleIds
            .map(() => '?')
            .join(',')}) ORDER BY position, id`
        )
        .all(...moduleIds)
    : [];
  
  const lessons = moduleIds.length
    ? db
        .prepare(
          `SELECT * FROM lessons WHERE module_id IN (${moduleIds
            .map(() => '?')
            .join(',')}) ORDER BY position, id`
        )
        .all(...moduleIds)
    : [];
  const lessonIds = lessons.map((l) => l.id);
  const quizzes = lessonIds.length
    ? db
        .prepare(
          `SELECT * FROM quizzes WHERE lesson_id IN (${lessonIds
            .map(() => '?')
            .join(',')}) ORDER BY position, id`
        )
        .all(...lessonIds)
    : [];
  // Adicionar os novos módulos ao objeto course
  course.modules = courseModules;
  res.json({ course, modules, topics, lessons, quizzes });
});

app.post('/courses', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  const parsed = CourseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { title, subtitle, description, type, segment, level, provider, image_path, banner_path, duration, created_by } = parsed.data;
  
  try {
    const result = runInTransaction((dbx) => {
      // Criar o curso
      const courseStmt = dbx.prepare(
        'INSERT INTO courses (title, subtitle, description, type, segment, level, provider, image_path, banner_path, duration, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
      );
      const courseInfo = courseStmt.run(
        title, 
        subtitle ?? null, 
        description ?? null, 
        type, 
        segment, 
        level, 
        provider ?? null, 
        image_path ?? null, 
        banner_path ?? null,
        duration ?? null,
        created_by ?? req.user.id
      );
      
      const courseId = courseInfo.lastInsertRowid;
      
      // Criar o módulo "Bem-vindo" automaticamente
      const moduleStmt = dbx.prepare(
        'INSERT INTO modules (course_id, title, position) VALUES (?, ?, ?)'
      );
      const moduleInfo = moduleStmt.run(courseId, 'Bem-vindo', 1);
      
      // Criar um tópico "Apresentação do Curso" no módulo de bem-vindo
      const topicStmt = dbx.prepare(
        'INSERT INTO topics (module_id, title, description, content_type, position) VALUES (?, ?, ?, ?, ?)'
      );
      topicStmt.run(
        moduleInfo.lastInsertRowid, 
        'Apresentação do Curso', 
        'Vídeo de boas-vindas e apresentação do curso', 
        'video', 
        1
      );
      
      // Retornar o curso criado
      return dbx.prepare('SELECT * FROM courses WHERE id = ?').get(courseId);
    });
    
    res.status(201).json(result);
  } catch (error) {
    console.error('Erro ao criar curso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/courses/:id', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  const id = Number(req.params.id);
  const parsed = CourseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  
  const { title, subtitle, description, type, segment, level, provider, image_path, banner_path, duration } = parsed.data;
  
  const stmt = db.prepare(`
    UPDATE courses 
    SET title = ?, subtitle = ?, description = ?, type = ?, segment = ?, level = ?, 
        provider = ?, image_path = ?, banner_path = ?, duration = ?, updated_at = datetime('now')
    WHERE id = ?
  `);
  
  const info = stmt.run(
    title,
    subtitle ?? null,
    description ?? null,
    type,
    segment,
    level,
    provider ?? null,
    image_path ?? null,
    banner_path ?? null,
    duration ?? null,
    id
  );
  
  if (info.changes === 0) return res.status(404).json({ error: 'Course not found' });
  
  const updatedCourse = db.prepare('SELECT * FROM courses WHERE id = ?').get(id);
  res.json(updatedCourse);
});

app.delete('/courses/:id', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM courses WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

// Modules
app.post('/modules', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  const parsed = ModuleSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { course_id, title, position } = parsed.data;
  const pos = position ?? 0;
  const info = db
    .prepare('INSERT INTO modules (course_id, title, position) VALUES (?,?,?)')
    .run(course_id, title, pos);
  const module = db.prepare('SELECT * FROM modules WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(module);
});

app.delete('/modules/:id', authMiddleware, requireRole(['professor', 'admin']), async (req, res) => {
  const id = Number(req.params.id);
  const info = await prepare('DELETE FROM modules WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

// Topics
app.post('/topics', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  const parsed = TopicSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { module_id, title, description, content_type, text_content, content, video_path, position } = parsed.data;
  const pos = position ?? 0;
  const info = db
    .prepare('INSERT INTO topics (module_id, title, description, content_type, text_content, content, video_path, position) VALUES (?,?,?,?,?,?,?,?)')
    .run(module_id, title, description, content_type, text_content, content, video_path, pos);
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(topic);
});

app.get('/topics/module/:moduleId', (req, res) => {
  const moduleId = Number(req.params.moduleId);
  const topics = db.prepare('SELECT * FROM topics WHERE module_id = ? ORDER BY position, id').all(moduleId);
  res.json(topics);
});

app.get('/topics/:id', (req, res) => {
  const id = Number(req.params.id);
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(id);
  if (!topic) return res.status(404).json({ error: 'Not found' });
  res.json({ topic });
});

app.put('/topics/:id', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  const id = Number(req.params.id);
  const parsed = TopicSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  
  const updateFields = [];
  const values = [];
  
  if (parsed.data.title !== undefined) {
    updateFields.push('title = ?');
    values.push(parsed.data.title);
  }
  if (parsed.data.description !== undefined) {
    updateFields.push('description = ?');
    values.push(parsed.data.description);
  }
  if (parsed.data.content_type !== undefined) {
    updateFields.push('content_type = ?');
    values.push(parsed.data.content_type);
  }
  if (parsed.data.text_content !== undefined) {
    updateFields.push('text_content = ?');
    values.push(parsed.data.text_content);
  }
  if (parsed.data.content !== undefined) {
    updateFields.push('content = ?');
    values.push(parsed.data.content);
  }
  if (parsed.data.video_path !== undefined) {
    updateFields.push('video_path = ?');
    values.push(parsed.data.video_path);
  }
  if (parsed.data.position !== undefined) {
    updateFields.push('position = ?');
    values.push(parsed.data.position);
  }
  
  updateFields.push('updated_at = datetime(\'now\')');
  values.push(id);
  
  const info = db.prepare(`UPDATE topics SET ${updateFields.join(', ')} WHERE id = ?`).run(...values);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  
  const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(id);
  res.json(topic);
});

app.delete('/topics/:id', authMiddleware, requireRole(['professor', 'admin']), async (req, res) => {
  const id = Number(req.params.id);
  const info = await prepare('DELETE FROM topics WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

// Lessons
app.post('/lessons', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  const parsed = LessonSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { module_id, title, video_url, summary, position } = parsed.data;
  const pos = position ?? 0;
  const info = db
    .prepare(
      'INSERT INTO lessons (module_id, title, video_url, summary, position) VALUES (?,?,?,?,?)'
    )
    .run(module_id, title, video_url ?? null, summary ?? null, pos);
  const lesson = db.prepare('SELECT * FROM lessons WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(lesson);
});

app.delete('/lessons/:id', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  const id = Number(req.params.id);
  const info = db.prepare('DELETE FROM lessons WHERE id = ?').run(id);
  if (info.changes === 0) return res.status(404).json({ error: 'Not found' });
  res.status(204).end();
});

// Quizzes
app.post('/quizzes', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  const parsed = QuizSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
  const { lesson_id, question, options, correct_option_index, position } = parsed.data;
  const pos = position ?? 0;
  const options_json = JSON.stringify(options);
  const info = db
    .prepare(
      'INSERT INTO quizzes (lesson_id, question, options_json, correct_option_index, position) VALUES (?,?,?,?,?)'
    )
    .run(lesson_id, question, options_json, correct_option_index, pos);
  const quiz = db.prepare('SELECT * FROM quizzes WHERE id = ?').get(info.lastInsertRowid);
  quiz.options = options;
  delete quiz.options_json;
  res.status(201).json(quiz);
});

app.get('/lessons/:id/quizzes', (req, res) => {
  const id = Number(req.params.id);
  const rows = db
    .prepare('SELECT * FROM quizzes WHERE lesson_id = ? ORDER BY position, id')
    .all(id);
  const quizzes = rows.map((q) => ({ ...q, options: JSON.parse(q.options_json) }));
  quizzes.forEach((q) => delete q.options_json);
  res.json(quizzes);
});

// Bulk create builder: create course with modules, lessons, quizzes in one shot
app.post('/builder/courses', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  const body = req.body;
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Invalid body' });
  try {
    const result = runInTransaction((dbx) => {
      const { title, subtitle, description, type, segment, level, provider, image_path, banner_path, duration, created_by, modules = [] } = body;
      const courseStmt = dbx.prepare(
        'INSERT INTO courses (title, subtitle, description, type, segment, level, provider, image_path, banner_path, duration, created_by) VALUES (?,?,?,?,?,?,?,?,?,?,?)'
      );
      const cInfo = courseStmt.run(
        title, 
        subtitle ?? null, 
        description ?? null, 
        type, 
        segment, 
        level, 
        provider ?? null, 
        image_path ?? null, 
        banner_path ?? null,
        duration ?? null,
        created_by ?? req.user.id
      );
      const courseId = Number(cInfo.lastInsertRowid);

      const moduleStmt = dbx.prepare(
        'INSERT INTO modules (course_id, title, position) VALUES (?,?,?)'
      );
      const lessonStmt = dbx.prepare(
        'INSERT INTO lessons (module_id, title, video_url, summary, position) VALUES (?,?,?,?,?)'
      );
      const quizStmt = dbx.prepare(
        'INSERT INTO quizzes (lesson_id, question, options_json, correct_option_index, position) VALUES (?,?,?,?,?)'
      );

      for (const [mIndex, m] of modules.entries()) {
        const mInfo = moduleStmt.run(courseId, m.title, m.position ?? mIndex);
        const moduleId = Number(mInfo.lastInsertRowid);
        for (const [lIndex, l] of (m.lessons ?? []).entries()) {
          const lInfo = lessonStmt.run(
            moduleId,
            l.title,
            l.video_url ?? null,
            l.summary ?? null,
            l.position ?? lIndex
          );
          const lessonId = Number(lInfo.lastInsertRowid);
          for (const [qIndex, q] of (l.quizzes ?? []).entries()) {
            quizStmt.run(
              lessonId,
              q.question,
              JSON.stringify(q.options ?? []),
              q.correct_option_index ?? 0,
              q.position ?? qIndex
            );
          }
        }
      }

      return { id: courseId };
    });
    res.status(201).json(result);
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: 'Invalid builder payload' });
  }
});

// Upload image
app.post('/uploads/image', authMiddleware, requireRole(['professor', 'admin']), upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
  const publicUrl = `/uploads/${req.file.filename}`;
  res.status(201).json({ path: publicUrl });
});

// Upload avatar
app.post('/uploads/avatar', authMiddleware, avatarUpload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Arquivo não enviado' });
  
  console.log('📁 Arquivo recebido:', req.file.filename);
  console.log('📁 Caminho completo:', req.file.path);
  
  const publicUrl = `/uploads/${req.file.filename}`;
  console.log('🌐 URL pública:', publicUrl);
  
  // Atualizar o avatar_path no banco de dados
  const stmt = db.prepare('UPDATE users SET avatar_path = ?, updated_at = datetime(\'now\') WHERE id = ?');
  const result = stmt.run(publicUrl, req.user.id);
  
  console.log('👤 Usuário ID:', req.user.id);
  console.log('💾 Linhas afetadas:', result.changes);
  
  if (result.changes === 0) {
    return res.status(404).json({ error: 'Usuário não encontrado' });
  }
  
  res.status(201).json({ path: publicUrl });
});

// User endpoints
app.get('/user/profile', authMiddleware, (req, res) => {
  const user = db.prepare('SELECT id, name, email, role, phone, bio, location, website, linkedin, github, avatar_path, created_at, updated_at FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  res.json(user);
});

app.put('/user/profile', authMiddleware, (req, res) => {
  const { name, phone, bio, location, website, linkedin, github, avatar_path } = req.body;
  
  const stmt = db.prepare(`
    UPDATE users 
    SET name = ?, phone = ?, bio = ?, location = ?, website = ?, linkedin = ?, github = ?, avatar_path = ?, updated_at = datetime('now')
    WHERE id = ?
  `);
  
  const result = stmt.run(name, phone, bio, location, website, linkedin, github, avatar_path, req.user.id);
  
  if (result.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
  
  const updatedUser = db.prepare('SELECT id, name, email, role, phone, bio, location, website, linkedin, github, avatar_path, created_at, updated_at FROM users WHERE id = ?').get(req.user.id);
  res.json(updatedUser);
});

app.put('/user/email', authMiddleware, (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email é obrigatório' });
  
  // Verificar se o email já existe
  const existingUser = db.prepare('SELECT id FROM users WHERE email = ? AND id != ?').get(email, req.user.id);
  if (existingUser) return res.status(400).json({ error: 'Email já está em uso' });
  
  const stmt = db.prepare('UPDATE users SET email = ?, updated_at = datetime(\'now\') WHERE id = ?');
  const result = stmt.run(email, req.user.id);
  
  if (result.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
  
  const updatedUser = db.prepare('SELECT id, name, email, role, phone, bio, location, website, linkedin, github, avatar_path, created_at, updated_at FROM users WHERE id = ?').get(req.user.id);
  res.json(updatedUser);
});

app.put('/user/password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Senha atual e nova senha são obrigatórias' });
  
  // Verificar senha atual
  const user = db.prepare('SELECT password_hash FROM users WHERE id = ?').get(req.user.id);
  if (!user) return res.status(404).json({ error: 'Usuário não encontrado' });
  
  const isValidPassword = bcrypt.compareSync(currentPassword, user.password_hash);
  if (!isValidPassword) return res.status(400).json({ error: 'Senha atual incorreta' });
  
  // Atualizar senha
  const hashedPassword = bcrypt.hashSync(newPassword, 10);
  const stmt = db.prepare('UPDATE users SET password_hash = ?, updated_at = datetime(\'now\') WHERE id = ?');
  const result = stmt.run(hashedPassword, req.user.id);
  
  if (result.changes === 0) return res.status(404).json({ error: 'Usuário não encontrado' });
  
  res.json({ message: 'Senha atualizada com sucesso' });
});

// Certifications endpoints
app.get('/certifications', authMiddleware, (req, res) => {
  const certifications = db.prepare('SELECT * FROM certifications WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(certifications);
});

app.post('/certifications', authMiddleware, upload.single('image'), (req, res) => {
  const { name, url } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Nome da certificação é obrigatório' });
  }

  let imagePath = null;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  }

  const result = db.prepare(`
    INSERT INTO certifications (user_id, name, image_path, url, created_at, updated_at)
    VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
  `).run(req.user.id, name, imagePath, url || null);

  const certification = db.prepare('SELECT * FROM certifications WHERE id = ?').get(result.lastInsertRowid);
  res.json(certification);
});

app.delete('/certifications/:id', authMiddleware, (req, res) => {
  const id = Number(req.params.id);
  
  // Verificar se a certificação pertence ao usuário
  const certification = db.prepare('SELECT * FROM certifications WHERE id = ? AND user_id = ?').get(id, req.user.id);
  if (!certification) {
    return res.status(404).json({ error: 'Certificação não encontrada' });
  }

  // Deletar a imagem se existir
  if (certification.image_path) {
    const imagePath = path.join(process.cwd(), 'uploads', path.basename(certification.image_path));
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  const info = db.prepare('DELETE FROM certifications WHERE id = ? AND user_id = ?').run(id, req.user.id);
  
  if (info.changes === 0) {
    return res.status(404).json({ error: 'Certificação não encontrada' });
  }

  res.json({ message: 'Certificação deletada com sucesso' });
});

// Rotas para gerenciar imagem de fundo
app.get('/api/settings/background', (req, res) => {
  try {
    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get('background_image');
    const backgroundUrl = setting ? 
      (setting.value.startsWith('http') ? setting.value : `http://localhost:4000${setting.value}`) : 
      null;
    res.json({ 
      backgroundUrl 
    });
  } catch (error) {
    console.error('Erro ao buscar imagem de fundo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/settings/background/:pageId', (req, res) => {
  try {
    const pageId = req.params.pageId;
    const setting = db.prepare('SELECT value FROM settings WHERE key = ?').get(`background_image_${pageId}`);
    const backgroundUrl = setting ? 
      (setting.value.startsWith('http') ? setting.value : `http://localhost:4000${setting.value}`) : 
      null;
    res.json({ 
      backgroundUrl 
    });
  } catch (error) {
    console.error('Erro ao buscar imagem de fundo da página:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.post('/api/settings/background', authMiddleware, requireRole('admin'), upload.single('background'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    const pageId = req.body.pageId || 'default';
    const backgroundUrl = `/uploads/${req.file.filename}`;
    
    // Criar tabela settings se não existir
    db.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT UNIQUE NOT NULL,
        value TEXT NOT NULL,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      )
    `);

    // Inserir ou atualizar a configuração específica da página
    const settingKey = pageId === 'default' ? 'background_image' : `background_image_${pageId}`;
    const stmt = db.prepare(`
      INSERT INTO settings (key, value, updated_at) 
      VALUES (?, ?, datetime('now'))
      ON CONFLICT(key) DO UPDATE SET 
        value = excluded.value,
        updated_at = datetime('now')
    `);
    
    stmt.run(settingKey, backgroundUrl);

    res.json({ 
      success: true,
      backgroundUrl: `http://localhost:4000${backgroundUrl}`
    });
  } catch (error) {
    console.error('Erro ao salvar imagem de fundo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rotas de progresso do curso
app.get('/api/courses/:id/progress', authMiddleware, (req, res) => {
  const courseId = Number(req.params.id);
  const userId = req.user.id;

  try {
    // Buscar progresso do usuário para este curso
    const progress = db.prepare(`
      SELECT * FROM course_progress 
      WHERE user_id = ? AND course_id = ?
    `).get(userId, courseId);

    // Buscar total de módulos do curso
    const totalModules = db.prepare(`
      SELECT COUNT(*) as count FROM course_modules 
      WHERE course_id = ?
    `).get(courseId);

    if (progress) {
      res.json({
        progress: progress.progress_percentage,
        completedModules: progress.completed_modules,
        totalModules: totalModules?.count || 0
      });
    } else {
      res.json({
        progress: 0,
        completedModules: 0,
        totalModules: totalModules?.count || 0
      });
    }
  } catch (error) {
    console.error('Erro ao buscar progresso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.get('/api/courses/:id/modules', (req, res) => {
  const courseId = Number(req.params.id);

  try {
    const modules = db.prepare(`
      SELECT id, title, description, order_index
      FROM course_modules 
      WHERE course_id = ? 
      ORDER BY order_index ASC
    `).all(courseId);

    res.json(modules);
  } catch (error) {
    console.error('Erro ao buscar módulos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

app.put('/api/courses/:courseId/modules/:moduleId/progress', authMiddleware, (req, res) => {
  const courseId = Number(req.params.courseId);
  const moduleId = Number(req.params.moduleId);
  const userId = req.user.id;
  const { completed } = req.body;

  try {
    // Verificar se já existe progresso para este módulo
    const existingProgress = db.prepare(`
      SELECT * FROM module_progress 
      WHERE user_id = ? AND course_id = ? AND module_id = ?
    `).get(userId, courseId, moduleId);

    if (existingProgress) {
      // Atualizar progresso existente
      db.prepare(`
        UPDATE module_progress 
        SET completed = ?, updated_at = datetime('now')
        WHERE user_id = ? AND course_id = ? AND module_id = ?
      `).run(completed ? 1 : 0, userId, courseId, moduleId);
    } else {
      // Criar novo progresso
      db.prepare(`
        INSERT INTO module_progress (user_id, course_id, module_id, completed, created_at, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `).run(userId, courseId, moduleId, completed ? 1 : 0);
    }

    // Recalcular progresso geral do curso
    const completedCount = db.prepare(`
      SELECT COUNT(*) as count FROM module_progress 
      WHERE user_id = ? AND course_id = ? AND completed = 1
    `).get(userId, courseId);

    const totalCount = db.prepare(`
      SELECT COUNT(*) as count FROM course_modules 
      WHERE course_id = ?
    `).get(courseId);

    const progressPercentage = totalCount.count > 0 
      ? Math.round((completedCount.count / totalCount.count) * 100) 
      : 0;

    // Atualizar ou criar progresso geral do curso
    const existingCourseProgress = db.prepare(`
      SELECT * FROM course_progress 
      WHERE user_id = ? AND course_id = ?
    `).get(userId, courseId);

    if (existingCourseProgress) {
      db.prepare(`
        UPDATE course_progress 
        SET progress_percentage = ?, completed_modules = ?, updated_at = datetime('now')
        WHERE user_id = ? AND course_id = ?
      `).run(progressPercentage, completedCount.count, userId, courseId);
    } else {
      db.prepare(`
        INSERT INTO course_progress (user_id, course_id, progress_percentage, completed_modules, created_at, updated_at)
        VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))
      `).run(userId, courseId, progressPercentage, completedCount.count);
    }

    res.json({
      success: true,
      progress: progressPercentage,
      completedModules: completedCount.count,
      totalModules: totalCount.count
    });

  } catch (error) {
    console.error('Erro ao atualizar progresso:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Middleware para capturar erros do multer
const handleMulterError = (error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    console.log('❌ Erro do Multer:', error.code);
    
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ 
          error: 'Arquivo muito grande',
          details: 'O vídeo deve ter no máximo 100MB. Formatos recomendados: MP4, AVI, MOV, WebM',
          maxSize: '100MB'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ 
          error: 'Muitos arquivos',
          details: 'Envie apenas um vídeo por vez'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          error: 'Campo de arquivo inválido',
          details: 'Use o campo "video" para enviar o arquivo'
        });
      default:
        return res.status(400).json({ 
          error: 'Erro no upload',
          details: error.message
        });
    }
  }
  
  if (error.message === 'Apenas arquivos de vídeo são permitidos!') {
    return res.status(400).json({ 
      error: 'Formato de arquivo inválido',
      details: 'Apenas arquivos de vídeo são permitidos. Formatos aceitos: MP4, AVI, MOV, WebM, MKV',
      acceptedFormats: ['MP4', 'AVI', 'MOV', 'WebM', 'MKV']
    });
  }
  
  next(error);
};

// Rota antiga removida - agora usando /api/videos/upload

app.delete('/api/topics/:id/video', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  try {
    const topicId = req.params.id;

    // Buscar o tópico e o caminho do vídeo
    const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Tópico não encontrado' });
    }

    if (topic.video_path) {
      // Remover o arquivo físico
      const videoFilePath = path.join(process.cwd(), 'uploads', 'videos', path.basename(topic.video_path));
      
      if (fs.existsSync(videoFilePath)) {
        fs.unlinkSync(videoFilePath);
      }

      // Remover o caminho do vídeo do banco
      db.prepare('UPDATE topics SET video_path = NULL, updated_at = datetime("now") WHERE id = ?')
        .run(topicId);
    }

    res.json({
      success: true,
      message: 'Vídeo removido com sucesso'
    });

  } catch (error) {
    console.error('Erro ao deletar vídeo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Servir arquivos de vídeo
app.use('/uploads/videos', express.static(path.join(process.cwd(), 'uploads', 'videos')));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});


