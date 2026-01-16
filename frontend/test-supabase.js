import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Obter diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ler arquivo .env
try {
  const envContent = readFileSync(join(__dirname, '.env'), 'utf-8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  const supabaseUrl = envVars.VITE_SUPABASE_URL;
  const supabaseAnonKey = envVars.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Erro: Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas no .env');
    process.exit(1);
  }

  // Verificar se a URL ainda é placeholder
  if (supabaseUrl.includes('seu-projeto')) {
    console.error('❌ Erro: Você precisa atualizar VITE_SUPABASE_URL no arquivo .env com a URL real do seu projeto Supabase!');
    console.error('   Acesse: Dashboard Supabase > Project Settings > API > Project URL');
    process.exit(1);
  }

  console.log('🔌 Conectando ao Supabase...');
  console.log('📍 URL:', supabaseUrl);
  console.log('🔑 Key:', supabaseAnonKey.substring(0, 20) + '...\n');

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Testar inserção na tabela "contas"
  console.log('📝 Tentando inserir dados na tabela "contas"...');
  
  const testData = {
    nome: 'Conta Teste',
    saldo: 1000.00,
    tipo: 'corrente'
  };

  console.log('📦 Dados a inserir:', testData);

  const { data, error } = await supabase
    .from('contas')
    .insert([testData])
    .select();

  if (error) {
    console.error('\n❌ Erro ao inserir dados:');
    console.error('   Mensagem:', error.message);
    console.error('   Código:', error.code);
    console.error('   Detalhes:', error.details);
    console.error('\n💡 Dica: Verifique se:');
    console.error('   - A tabela "contas" existe no Supabase');
    console.error('   - As colunas "nome", "saldo", "tipo" existem');
    console.error('   - As políticas RLS (Row Level Security) permitem inserção');
    process.exit(1);
  }

  console.log('\n✅ Dados inseridos com sucesso!');
  console.log('📊 Registro criado:', JSON.stringify(data, null, 2));
  
} catch (error) {
  console.error('\n❌ Erro ao executar teste:', error.message);
  if (error.stack) {
    console.error('Stack:', error.stack);
  }
  process.exit(1);
}

