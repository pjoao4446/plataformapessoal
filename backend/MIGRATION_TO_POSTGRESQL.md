# Migração do SQLite para PostgreSQL

Este guia explica como migrar a plataforma de estudos do SQLite para PostgreSQL.

## 📋 Pré-requisitos

1. **PostgreSQL instalado** (versão 12 ou superior)
2. **Node.js** com npm
3. **Dados existentes** no SQLite

## 🚀 Passo a Passo

### 1. Instalar PostgreSQL

#### Ubuntu/Debian:
```bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
```

#### macOS:
```bash
brew install postgresql
brew services start postgresql
```

#### Windows:
- Baixe do site oficial: https://www.postgresql.org/download/windows/
- Execute o instalador e siga as instruções

### 2. Configurar PostgreSQL

```bash
# Entrar no PostgreSQL como superusuário
sudo -u postgres psql

# Criar banco de dados
CREATE DATABASE plataforma_estudos;

# Criar usuário (opcional)
CREATE USER plataforma_user WITH PASSWORD 'sua_senha_aqui';

# Dar permissões
GRANT ALL PRIVILEGES ON DATABASE plataforma_estudos TO plataforma_user;

# Sair
\q
```

### 3. Configurar Variáveis de Ambiente

Copie o arquivo de exemplo:
```bash
cp env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Configurações do Banco PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=plataforma_estudos
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

# Configurações do JWT
JWT_SECRET=dev-secret-change-me

# Configurações do Servidor
PORT=4000

# Configurações do Upload
UPLOAD_MAX_SIZE=104857600
```

### 4. Instalar Dependências

```bash
npm install
```

### 5. Executar Setup Automático

```bash
npm run setup-postgres
```

### 6. Criar Schema PostgreSQL

```bash
npm run create-postgres-schema
```

### 7. Migrar Dados do SQLite

```bash
npm run migrate-to-postgres
```

### 8. Testar Migração

```bash
npm run test-postgres
```

### 9. Configurar para Usar PostgreSQL

Adicione no arquivo `.env`:
```env
USE_POSTGRES=true
```

Ou exporte a variável:
```bash
export USE_POSTGRES=true
```

### 10. Iniciar Servidor

```bash
npm run dev
```

## 🔧 Comandos Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run setup-postgres` | Verifica instalação e dependências |
| `npm run create-postgres-schema` | Cria o schema no PostgreSQL |
| `npm run migrate-to-postgres` | Migra dados do SQLite para PostgreSQL |
| `npm run test-postgres` | Testa a conexão e dados |
| `npm run dev` | Inicia servidor em modo desenvolvimento |

## 📊 Estrutura das Tabelas

### Tabelas Principais:
- **users** - Usuários da plataforma
- **courses** - Cursos disponíveis
- **modules** - Módulos dos cursos
- **lessons** - Lições dentro dos módulos
- **topics** - Tópicos de conteúdo
- **quizzes** - Questionários
- **certifications** - Certificações dos usuários

### Tabelas de Progresso:
- **course_progress** - Progresso geral dos cursos
- **module_progress** - Progresso dos módulos
- **topic_progress** - Progresso dos tópicos

### Tabelas Auxiliares:
- **password_resets** - Reset de senhas
- **settings** - Configurações do sistema
- **course_modules** - Estrutura de módulos

## 🔍 Verificações Pós-Migração

### 1. Verificar Dados
```bash
npm run test-postgres
```

### 2. Verificar no Banco
```sql
-- Conectar ao PostgreSQL
psql -U postgres -d plataforma_estudos

-- Verificar contagem de registros
SELECT 
  'users' as tabela, COUNT(*) as registros FROM users
UNION ALL
SELECT 'courses', COUNT(*) FROM courses
UNION ALL
SELECT 'modules', COUNT(*) FROM modules
UNION ALL
SELECT 'topics', COUNT(*) FROM topics;
```

### 3. Testar API
```bash
# Testar healthcheck
curl http://localhost:4000/health

# Testar listagem de cursos
curl http://localhost:4000/courses
```

## ⚠️ Troubleshooting

### Erro de Conexão
```
❌ Erro ao conectar com PostgreSQL
```
**Solução:** Verifique se o PostgreSQL está rodando e as credenciais estão corretas.

### Erro de Permissão
```
❌ permission denied for database
```
**Solução:** Verifique se o usuário tem permissões no banco de dados.

### Erro de Schema
```
❌ relation "table_name" does not exist
```
**Solução:** Execute o comando de criação do schema:
```bash
npm run create-postgres-schema
```

### Dados Não Migrados
```
❌ Tabela está vazia após migração
```
**Solução:** Verifique se o SQLite tem dados e execute novamente:
```bash
npm run migrate-to-postgres
```

## 🔄 Rollback (Voltar ao SQLite)

Se precisar voltar ao SQLite:

1. Remova a variável `USE_POSTGRES` do `.env`
2. Reinicie o servidor:
```bash
npm run dev
```

## 📈 Vantagens do PostgreSQL

1. **Performance** - Melhor para aplicações em produção
2. **Escalabilidade** - Suporta mais usuários simultâneos
3. **Recursos Avançados** - JSON, arrays, full-text search
4. **Concorrência** - Melhor controle de transações
5. **Backup** - Ferramentas robustas de backup
6. **Monitoramento** - Melhor observabilidade

## 🆘 Suporte

Em caso de problemas:

1. Verifique os logs do PostgreSQL
2. Confirme se todas as dependências estão instaladas
3. Verifique as configurações de rede/firewall
4. Consulte a documentação oficial do PostgreSQL

## 📚 Recursos Adicionais

- [Documentação PostgreSQL](https://www.postgresql.org/docs/)
- [Node.js PostgreSQL Driver](https://node-postgres.com/)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)


