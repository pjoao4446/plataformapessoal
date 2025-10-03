import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function authMiddleware(req, res, next) {
  console.log('🔐 Verificando autenticação...');
  
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    console.log('❌ Token não fornecido');
    return res.status(401).json({ 
      error: 'Token de acesso necessário',
      details: 'Faça login para continuar'
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido para usuário:', decoded.email);
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Token inválido:', error.message);
    return res.status(401).json({ 
      error: 'Token inválido',
      details: 'Faça login novamente'
    });
  }
}

export function requireRole(allowedRoles) {
  return (req, res, next) => {
    console.log('👤 Verificando permissões...');
    console.log('👤 Usuário:', req.user?.email);
    console.log('👤 Role atual:', req.user?.role);
    console.log('👤 Roles permitidos:', allowedRoles);
    
    if (!req.user) {
      console.log('❌ Usuário não autenticado');
      return res.status(401).json({ 
        error: 'Usuário não autenticado',
        details: 'Faça login para continuar'
      });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      console.log('❌ Permissão negada');
      return res.status(403).json({ 
        error: 'Permissão negada',
        details: 'Você não tem permissão para realizar esta ação'
      });
    }
    
    console.log('✅ Permissão concedida');
    next();
  };
}
