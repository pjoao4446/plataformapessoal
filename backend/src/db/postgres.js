import pkg from 'pg';
const { Pool } = pkg;

// Configuração do PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'plataforma_estudos',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
  max: 20, // Máximo de conexões no pool
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Função para executar queries
export const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query executada', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Erro na query:', error);
    throw error;
  }
};

// Função para executar transações
export const runInTransaction = async (callback) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Função para obter um cliente do pool
export const getClient = () => pool.connect();

// Função para fechar todas as conexões
export const closePool = () => pool.end();

// Função para testar a conexão
export const testConnection = async () => {
  try {
    const result = await query('SELECT NOW()');
    console.log('✅ Conexão com PostgreSQL estabelecida:', result.rows[0]);
    return true;
  } catch (error) {
    console.error('❌ Erro ao conectar com PostgreSQL:', error);
    return false;
  }
};

export default pool;


