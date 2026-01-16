import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { query, runInTransaction as pgRunInTransaction } from './postgres.js';

// Configuração do banco de dados
const USE_POSTGRES = process.env.USE_POSTGRES === 'true' || process.env.DB_HOST;

// Configuração SQLite (mantida para compatibilidade)
const dbDirectory = path.join(process.cwd(), 'data');
const dbPath = path.join(dbDirectory, 'app.sqlite');

if (!fs.existsSync(dbDirectory)) {
  fs.mkdirSync(dbDirectory, { recursive: true });
}

export const db = USE_POSTGRES ? null : new Database(dbPath);

if (!USE_POSTGRES) {
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');
}

// Função para executar queries (compatível com ambos os bancos)
export async function executeQuery(sql, params = []) {
  if (USE_POSTGRES) {
    const result = await query(sql, params);
    return {
      rows: result.rows,
      rowCount: result.rowCount,
      lastInsertRowid: result.rows[0]?.id || null
    };
  } else {
    // SQLite
    if (sql.trim().toUpperCase().startsWith('SELECT')) {
      const rows = db.prepare(sql).all(...params);
      return { rows, rowCount: rows.length, lastInsertRowid: null };
    } else {
      const info = db.prepare(sql).run(...params);
      return { 
        rows: [], 
        rowCount: info.changes, 
        lastInsertRowid: info.lastInsertRowid 
      };
    }
  }
}

// Função para executar transações
export function runInTransaction(callback) {
  if (USE_POSTGRES) {
    return pgRunInTransaction(callback);
  } else {
    // SQLite
    const begin = db.prepare('BEGIN');
    const commit = db.prepare('COMMIT');
    const rollback = db.prepare('ROLLBACK');
    try {
      begin.run();
      const result = callback(db);
      commit.run();
      return result;
    } catch (error) {
      rollback.run();
      throw error;
    }
  }
}

// Função para preparar statements (compatibilidade)
export function prepare(sql) {
  if (USE_POSTGRES) {
    // Converter sintaxe SQLite (?) para PostgreSQL ($1, $2, etc.)
    let pgSql = sql;
    let paramIndex = 1;
    pgSql = sql.replace(/\?/g, () => `$${paramIndex++}`);
    
    return {
      get: async (...params) => {
        try {
          const result = await query(pgSql, params);
          return result.rows[0] || null;
        } catch (error) {
          console.error('Erro na query get:', error);
          console.error('SQL:', pgSql);
          console.error('Params:', params);
          throw error;
        }
      },
      all: async (...params) => {
        try {
          const result = await query(pgSql, params);
          return result.rows;
        } catch (error) {
          console.error('Erro na query all:', error);
          console.error('SQL:', pgSql);
          console.error('Params:', params);
          throw error;
        }
      },
      run: async (...params) => {
        try {
          const result = await query(pgSql, params);
          return {
            changes: result.rowCount,
            lastInsertRowid: result.rows[0]?.id || null
          };
        } catch (error) {
          console.error('Erro na query run:', error);
          console.error('SQL:', pgSql);
          console.error('Params:', params);
          throw error;
        }
      }
    };
  } else {
    return db.prepare(sql);
  }
}

// Função para executar comandos DDL
export function exec(sql) {
  if (USE_POSTGRES) {
    return query(sql);
  } else {
    return db.exec(sql);
  }
}

// Exportar configuração do banco
export { USE_POSTGRES };

console.log(`🗄️  Usando banco de dados: ${USE_POSTGRES ? 'PostgreSQL' : 'SQLite'}`);