import { db } from '../src/db/index.js';
import fs from 'fs';
import path from 'path';

// Usar o db importado

// Trilhas de especialização para AWS
const awsTracks = [
  // Fundamentos
  {
    title: 'AWS Cloud Practitioner Foundation',
    subtitle: 'Certificação fundamental da AWS para iniciantes',
    description: 'Aprenda os conceitos básicos da AWS e prepare-se para a certificação Cloud Practitioner.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'fundamentos',
    image_path: '/uploads/aws-cloudpractitioner.png'
  },
  {
    title: 'AWS AI Practitioner Foundation',
    subtitle: 'Fundamentos de IA na AWS',
    description: 'Introdução aos serviços de Inteligência Artificial da AWS.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'fundamentos',
    image_path: '/uploads/aws-aipractitioner.png'
  },
  
  // Intermediário
  {
    title: 'AWS Solutions Architect Associate',
    subtitle: 'Arquiteto de Soluções AWS - Nível Associate',
    description: 'Domine a arquitetura de soluções na AWS com foco em escalabilidade e segurança.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'intermediario',
    image_path: '/uploads/aws-saassociate.png'
  },
  {
    title: 'AWS Developer Associate',
    subtitle: 'Desenvolvedor AWS - Nível Associate',
    description: 'Aprenda a desenvolver aplicações na AWS usando os principais serviços.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'intermediario',
    image_path: '/uploads/aws-developerassociate.png'
  },
  {
    title: 'AWS CloudOps Engineer Associate',
    subtitle: 'Engenheiro de Operações Cloud AWS',
    description: 'Especialize-se em operações e monitoramento na AWS.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'intermediario',
    image_path: '/uploads/aws-cloudopsassociate.png'
  },
  {
    title: 'AWS Data Engineer Associate',
    subtitle: 'Engenheiro de Dados AWS - Nível Associate',
    description: 'Domine o processamento e análise de dados na AWS.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'intermediario',
    image_path: '/uploads/aws-dataengineerassociate.png'
  },
  {
    title: 'AWS Machine Learning Associate',
    subtitle: 'Machine Learning AWS - Nível Associate',
    description: 'Aprenda Machine Learning usando os serviços da AWS.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'intermediario',
    image_path: '/uploads/aws-machinelearningassociate.png'
  },
  
  // Avançado
  {
    title: 'AWS Solutions Architect Professional',
    subtitle: 'Arquiteto de Soluções AWS - Nível Professional',
    description: 'Nível avançado de arquitetura de soluções na AWS.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'avancado',
    image_path: '/uploads/aws-saprofessional.png'
  },
  {
    title: 'AWS DevOps Engineer Professional',
    subtitle: 'Engenheiro DevOps AWS - Nível Professional',
    description: 'Especialização avançada em DevOps na AWS.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'avancado',
    image_path: '/uploads/aws-devopsprofessional.png'
  },
  {
    title: 'AWS Advanced Networking Specialty',
    subtitle: 'Especialista em Redes Avançadas AWS',
    description: 'Especialização em redes complexas na AWS.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'avancado',
    image_path: '/uploads/aws-redesespecialista.png'
  },
  {
    title: 'AWS Security Specialty',
    subtitle: 'Especialista em Segurança AWS',
    description: 'Especialização em segurança avançada na AWS.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'avancado',
    image_path: '/uploads/aws-segurancaespecialista.png'
  },
  {
    title: 'AWS Machine Learning Specialty',
    subtitle: 'Especialista em Machine Learning AWS',
    description: 'Especialização avançada em Machine Learning na AWS.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'avancado',
    image_path: '/uploads/aws-machinelearningespecialista.png'
  }
];

// Trilhas de especialização para Azure
const azureTracks = [
  // Fundamentos
  {
    title: 'Azure Fundamentals AZ-900',
    subtitle: 'Fundamentos do Microsoft Azure',
    description: 'Aprenda os conceitos básicos do Microsoft Azure.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'fundamentos',
    image_path: '/uploads/azure-logo.png'
  },
  
  // Intermediário
  {
    title: 'Azure Administrator Associate AZ-104',
    subtitle: 'Administrador do Microsoft Azure',
    description: 'Especialize-se na administração de recursos do Azure.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'intermediario',
    image_path: '/uploads/azure-logo.png'
  },
  {
    title: 'Azure Developer Associate AZ-204',
    subtitle: 'Desenvolvedor do Microsoft Azure',
    description: 'Aprenda a desenvolver aplicações no Microsoft Azure.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'intermediario',
    image_path: '/uploads/azure-logo.png'
  },
  
  // Avançado
  {
    title: 'Azure Solutions Architect Expert AZ-305',
    subtitle: 'Arquiteto de Soluções Microsoft Azure',
    description: 'Nível expert em arquitetura de soluções no Azure.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'avancado',
    image_path: '/uploads/azure-logo.png'
  }
];

// Trilhas de especialização para GCP
const gcpTracks = [
  // Fundamentos
  {
    title: 'Google Cloud Digital Leader',
    subtitle: 'Líder Digital Google Cloud',
    description: 'Fundamentos do Google Cloud Platform.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'fundamentos',
    image_path: '/uploads/gcp-logo.png'
  },
  
  // Intermediário
  {
    title: 'Google Cloud Associate Engineer',
    subtitle: 'Engenheiro Associado Google Cloud',
    description: 'Especialização em engenharia no Google Cloud.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'intermediario',
    image_path: '/uploads/gcp-logo.png'
  },
  {
    title: 'Google Cloud Professional Developer',
    subtitle: 'Desenvolvedor Profissional Google Cloud',
    description: 'Desenvolvimento profissional no Google Cloud Platform.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'intermediario',
    image_path: '/uploads/gcp-logo.png'
  },
  
  // Avançado
  {
    title: 'Google Cloud Professional Architect',
    subtitle: 'Arquiteto Profissional Google Cloud',
    description: 'Arquitetura profissional no Google Cloud Platform.',
    type: 'trilha_especializacao',
    segment: 'infraestrutura',
    level: 'avancado',
    image_path: '/uploads/gcp-logo.png'
  }
];

async function seedSpecializationTracks() {
  try {
    console.log('🌱 Iniciando seed das trilhas de especialização...');
    
    // Criar diretório de uploads se não existir
    const uploadsDir = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    
    // Copiar imagens para o diretório de uploads
    const sourceImagesDir = path.join(process.cwd(), '..', 'frontend', 'src', 'assets', 'images');
    
    // Lista de imagens AWS
    const awsImages = [
      'aws-cloudpractitioner.png',
      'aws-aipractitioner.png', 
      'aws-saassociate.png',
      'aws-developerassociate.png',
      'aws-cloudopsassociate.png',
      'aws-dataengineerassociate.png',
      'aws-machinelearningassociate.png',
      'aws-saprofessional.png',
      'aws-devopsprofessional.png',
      'aws-redesespecialista.png',
      'aws-segurancaespecialista.png',
      'aws-machinelearningespecialista.png'
    ];
    
    // Copiar imagens AWS
    awsImages.forEach(imageName => {
      const sourcePath = path.join(sourceImagesDir, imageName);
      const destPath = path.join(uploadsDir, imageName);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copiada imagem: ${imageName}`);
      } else {
        console.log(`⚠️  Imagem não encontrada: ${imageName}`);
      }
    });
    
    // Copiar imagens Azure e GCP
    ['azure-logo.png', 'gcp-logo.png'].forEach(imageName => {
      const sourcePath = path.join(sourceImagesDir, imageName);
      const destPath = path.join(uploadsDir, imageName);
      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copiada imagem: ${imageName}`);
      } else {
        console.log(`⚠️  Imagem não encontrada: ${imageName}`);
      }
    });
    
    // Inserir trilhas AWS
    console.log('📚 Inserindo trilhas AWS...');
    for (const track of awsTracks) {
      try {
        const stmt = db.prepare(`
          INSERT INTO courses (title, subtitle, description, type, segment, level, provider, image_path, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `);
        const result = stmt.run(track.title, track.subtitle, track.description, track.type, track.segment, track.level, 'aws', track.image_path);
        console.log(`✅ Criado curso AWS: ${track.title}`);
      } catch (error) {
        console.error(`❌ Erro ao criar curso AWS ${track.title}:`, error);
      }
    }
    
    // Inserir trilhas Azure
    console.log('📚 Inserindo trilhas Azure...');
    for (const track of azureTracks) {
      try {
        const stmt = db.prepare(`
          INSERT INTO courses (title, subtitle, description, type, segment, level, provider, image_path, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `);
        const result = stmt.run(track.title, track.subtitle, track.description, track.type, track.segment, track.level, 'azure', track.image_path);
        console.log(`✅ Criado curso Azure: ${track.title}`);
      } catch (error) {
        console.error(`❌ Erro ao criar curso Azure ${track.title}:`, error);
      }
    }
    
    // Inserir trilhas GCP
    console.log('📚 Inserindo trilhas GCP...');
    for (const track of gcpTracks) {
      try {
        const stmt = db.prepare(`
          INSERT INTO courses (title, subtitle, description, type, segment, level, provider, image_path, created_at) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
        `);
        const result = stmt.run(track.title, track.subtitle, track.description, track.type, track.segment, track.level, 'gcp', track.image_path);
        console.log(`✅ Criado curso GCP: ${track.title}`);
      } catch (error) {
        console.error(`❌ Erro ao criar curso GCP ${track.title}:`, error);
      }
    }
    
    console.log('🎉 Seed das trilhas de especialização concluído!');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
  }
}

seedSpecializationTracks();
