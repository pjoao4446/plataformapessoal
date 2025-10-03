import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { db } from '../db/index.js';
import { authMiddleware, requireRole } from '../middleware/auth.js';

const router = express.Router();

// Configuração do multer para upload de vídeos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(process.cwd(), 'uploads', 'videos');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Gerar nome único para o arquivo
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000000000);
    const ext = path.extname(file.originalname);
    const filename = `video-${timestamp}-${random}${ext}`;
    
    console.log('📁 Nome do arquivo gerado:', filename);
    cb(null, filename);
  }
});

// Filtro de arquivos - apenas vídeos
const fileFilter = (req, file, cb) => {
  console.log('🔍 Verificando arquivo:', file.originalname, 'Tipo:', file.mimetype);
  
  const allowedMimeTypes = [
    'video/mp4',
    'video/avi',
    'video/mov',
    'video/webm',
    'video/mkv',
    'video/quicktime'
  ];
  
  if (allowedMimeTypes.includes(file.mimetype)) {
    console.log('✅ Arquivo aceito:', file.originalname);
    cb(null, true);
  } else {
    console.log('❌ Arquivo rejeitado:', file.originalname, 'Tipo:', file.mimetype);
    cb(new Error('Apenas arquivos de vídeo são permitidos! Formatos aceitos: MP4, AVI, MOV, WebM, MKV'), false);
  }
};

// Configuração do multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB
    files: 1 // Apenas 1 arquivo por vez
  }
});

// Middleware para tratar erros do multer
const handleMulterError = (error, req, res, next) => {
  console.log('❌ Erro do Multer:', error.message);
  
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return res.status(400).json({ 
          error: 'Arquivo muito grande',
          details: 'O vídeo deve ter no máximo 100MB. Formatos recomendados: MP4, AVI, MOV, WebM',
          maxSize: '100MB',
          code: 'FILE_TOO_LARGE'
        });
      case 'LIMIT_FILE_COUNT':
        return res.status(400).json({ 
          error: 'Muitos arquivos',
          details: 'Envie apenas um vídeo por vez',
          code: 'TOO_MANY_FILES'
        });
      case 'LIMIT_UNEXPECTED_FILE':
        return res.status(400).json({ 
          error: 'Campo de arquivo inválido',
          details: 'Use o campo "video" para enviar o arquivo',
          code: 'INVALID_FIELD'
        });
      default:
        return res.status(400).json({ 
          error: 'Erro no upload',
          details: error.message,
          code: 'UPLOAD_ERROR'
        });
    }
  }
  
  if (error.message === 'Apenas arquivos de vídeo são permitidos! Formatos aceitos: MP4, AVI, MOV, WebM, MKV') {
    return res.status(400).json({ 
      error: 'Formato de arquivo inválido',
      details: 'Apenas arquivos de vídeo são permitidos. Formatos aceitos: MP4, AVI, MOV, WebM, MKV',
      acceptedFormats: ['MP4', 'AVI', 'MOV', 'WebM', 'MKV'],
      code: 'INVALID_FORMAT'
    });
  }
  
  next(error);
};

// Rota para upload de vídeo
router.post('/upload', authMiddleware, requireRole(['professor', 'admin']), (req, res, next) => {
  console.log('🎬 Iniciando upload de vídeo...');
  console.log('👤 Usuário:', req.user.email);
  console.log('📋 Body:', req.body);
  
  upload.single('video')(req, res, (err) => {
    if (err) {
      console.error('❌ Erro no multer:', err);
      return handleMulterError(err, req, res, next);
    }
    next();
  });
}, (req, res) => {
  try {
    console.log('📹 Processando upload de vídeo...');
    
    // Verificar se arquivo foi enviado
    if (!req.file) {
      console.log('❌ Nenhum arquivo enviado');
      return res.status(400).json({ 
        error: 'Nenhum arquivo enviado',
        details: 'Selecione um arquivo de vídeo antes de enviar',
        code: 'NO_FILE'
      });
    }
    
    console.log('✅ Arquivo recebido:', req.file.filename);
    console.log('📊 Tamanho:', req.file.size, 'bytes');
    console.log('🎯 Tipo MIME:', req.file.mimetype);
    
    // Verificar se topicId foi fornecido
    const { topicId } = req.body;
    if (!topicId) {
      console.log('❌ ID do tópico não fornecido');
      return res.status(400).json({ 
        error: 'Tópico não especificado',
        details: 'ID do tópico é obrigatório para associar o vídeo',
        code: 'MISSING_TOPIC_ID'
      });
    }
    
    // Converter topicId para número
    const numericTopicId = parseInt(topicId);
    if (isNaN(numericTopicId)) {
      console.log('❌ ID do tópico inválido:', topicId);
      return res.status(400).json({ 
        error: 'ID do tópico inválido',
        details: 'O ID do tópico deve ser um número válido',
        code: 'INVALID_TOPIC_ID'
      });
    }
    
    console.log('🔍 Verificando tópico ID:', numericTopicId);
    
    // Verificar se o tópico existe
    const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(numericTopicId);
    if (!topic) {
      console.log('❌ Tópico não encontrado para ID:', numericTopicId);
      return res.status(404).json({ 
        error: 'Tópico não encontrado',
        details: 'O tópico especificado não existe. Recarregue a página e tente novamente.',
        code: 'TOPIC_NOT_FOUND'
      });
    }
    
    console.log('✅ Tópico encontrado:', topic.title);
    
    // Verificar se já existe um vídeo para este tópico
    if (topic.video_path) {
      console.log('⚠️ Tópico já possui vídeo:', topic.video_path);
      // Continuar e sobrescrever o vídeo existente
    }
    
    // Preparar caminho do vídeo
    const videoPath = `/uploads/videos/${req.file.filename}`;
    console.log('💾 Salvando vídeo no caminho:', videoPath);
    
    // Atualizar o tópico com o caminho do vídeo
    let updateResult;
    try {
      updateResult = db.prepare('UPDATE topics SET video_path = ?, updated_at = datetime(\'now\') WHERE id = ?')
        .run(videoPath, numericTopicId);
      
      console.log('✅ Tópico atualizado. Linhas afetadas:', updateResult.changes);
    } catch (dbError) {
      console.error('❌ Erro no banco de dados:', dbError);
      throw dbError;
    }
    
    if (updateResult.changes === 0) {
      console.log('❌ Nenhuma linha foi atualizada');
      return res.status(500).json({ 
        error: 'Falha ao salvar',
        details: 'Não foi possível salvar o vídeo no banco de dados',
        code: 'DATABASE_UPDATE_FAILED'
      });
    }
    
    console.log('🎉 Upload concluído com sucesso!');
    
    res.json({
      success: true,
      videoPath: videoPath,
      filename: req.file.filename,
      size: req.file.size,
      topicId: numericTopicId,
      message: 'Vídeo enviado com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro ao processar upload:', error);
    console.error('❌ Stack trace:', error.stack);
    
    // Remover arquivo se houver erro
    if (req.file) {
      try {
        fs.unlinkSync(req.file.path);
        console.log('🗑️ Arquivo temporário removido:', req.file.filename);
      } catch (unlinkError) {
        console.error('❌ Erro ao remover arquivo temporário:', unlinkError);
      }
    }
    
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(500).json({ 
        error: 'Erro de integridade',
        details: 'Erro ao salvar no banco de dados. Tente novamente.',
        code: 'DATABASE_CONSTRAINT_ERROR'
      });
    }
    
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: `Ocorreu um erro inesperado: ${error.message}`,
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

// Rota para deletar vídeo
router.delete('/:topicId', authMiddleware, requireRole(['professor', 'admin']), (req, res) => {
  try {
    const topicId = parseInt(req.params.topicId);
    
    if (isNaN(topicId)) {
      return res.status(400).json({ 
        error: 'ID do tópico inválido',
        details: 'O ID do tópico deve ser um número válido',
        code: 'INVALID_TOPIC_ID'
      });
    }
    
    // Buscar o tópico
    const topic = db.prepare('SELECT * FROM topics WHERE id = ?').get(topicId);
    if (!topic) {
      return res.status(404).json({ 
        error: 'Tópico não encontrado',
        details: 'O tópico especificado não existe',
        code: 'TOPIC_NOT_FOUND'
      });
    }
    
    // Remover vídeo do sistema de arquivos se existir
    if (topic.video_path) {
      const videoPath = path.join(process.cwd(), 'uploads', 'videos', path.basename(topic.video_path));
      if (fs.existsSync(videoPath)) {
        fs.unlinkSync(videoPath);
        console.log('🗑️ Vídeo removido:', videoPath);
      }
    }
    
    // Atualizar banco de dados
    const updateResult = db.prepare('UPDATE topics SET video_path = NULL, updated_at = datetime(\'now\') WHERE id = ?')
      .run(topicId);
    
    if (updateResult.changes === 0) {
      return res.status(500).json({ 
        error: 'Falha ao remover vídeo',
        details: 'Não foi possível remover o vídeo do banco de dados',
        code: 'DATABASE_UPDATE_FAILED'
      });
    }
    
    res.json({
      success: true,
      message: 'Vídeo removido com sucesso'
    });
    
  } catch (error) {
    console.error('❌ Erro ao remover vídeo:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: 'Ocorreu um erro inesperado ao remover o vídeo',
      code: 'INTERNAL_SERVER_ERROR'
    });
  }
});

export default router;
