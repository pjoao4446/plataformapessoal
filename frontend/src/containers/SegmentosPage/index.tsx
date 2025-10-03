// ARQUIVO: src/containers/SegmentosPage/index.tsx

import type { FC } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useState, useMemo, useCallback, useEffect } from 'react';

import { AnimatedPage } from '../../components/AnimatedPage';
import { Header } from '../../components/Header';
import { Rodape } from '../../components/Rodape';
import { CircularProgressBar } from '../../components/CircularProgressBar';
import { StatsCard } from '../../components/StatsCard';
import { MainContent } from '../../components/MainContent';
import { PageBannerWithEditor } from '../../components/PageBannerWithEditor';

import { 
  SegmentoWrapper,
  SegmentoBanner,
  BannerContent,
  BannerLeftColumn,
  BannerRightColumn,
  PageSubtitle,
  PageTitle,
  PageDescription,
  ContentSection,
  ContainerContent,
  SectionTitle,
  ProgressBarContainer,
  ProgressStatsGrid,
  ProgressCircularCard,
  ProgressStatsCard,
  CoursesGrid,
  EmblemWrapper,
  EmblemBackground,
  TextContainer,
  EloTitle,
  EloSubtitle,
  Infolink,
  EmblemImage,
  LevelNavBar,
  LevelButton,
  ModulesCarousel,
  ModulesGrid,
  ModuleCardContainer,
  ModuleCard,
  SpecializationSection,
  CloudProviderNavBar,
  CloudProviderButton,
  CertificationLinesContainer,
  CertificationLine,
  CertsGrid,
  CertificationCard,
  NoContentMessage,
  EmptyModuleCard,
  EmptyCertificationCard,
} from './styles';

import awsImage from '../../assets/images/curso1.png';
import dockerImage from '../../assets/images/curso1.png';
import reactImage from '../../assets/images/curso1.png';
import emblem1 from '../../assets/images/emblemadiamante.png';
import emblem2 from '../../assets/images/emblemamestre.png';
import emblem3 from '../../assets/images/emblemaplatina.png';

// AWS Certification Images
import awsCloudPractitioner from '../../assets/images/awscloudpractitioner.png';
import awsAIPractitioner from '../../assets/images/awsaipractitioner.png';
import awsSAAssociate from '../../assets/images/awssaassociate.png';
import awsDeveloperAssociate from '../../assets/images/awsdeveloperassociate.png';
import awsCloudOpsAssociate from '../../assets/images/awscloudopsassociate.png';
import awsDataEngineerAssociate from '../../assets/images/awsdataengineerassociate.png';
import awsMachineLearningAssociate from '../../assets/images/awsmachinelearningassociate.png';
import awsSAProfessional from '../../assets/images/awssaprofessional.png';
import awsDevOpsProfessional from '../../assets/images/awsdevopsprofessional.png';
import awsNetworkingSpecialty from '../../assets/images/awsredesespecialista.png';
import awsSecuritySpecialty from '../../assets/images/awssegurancaespecialista.png';
import awsMLSpecialty from '../../assets/images/awsmachinelearningespecialista.png';
import awsLogo from '../../assets/images/aws-logo.png';
import azureLogo from '../../assets/images/azure-logo.png'; 
import gcpLogo from '../../assets/images/gcp-logo.png'; 


import cloudpractitioner from '../../assets/images/awscloudpractitioner.png';
import aipractitioner from '../../assets/images/awsaipractitioner.png'; 
import saassociate from '../../assets/images/awssaassociate.png'; 
import developerassociate from '../../assets/images/awsdeveloperassociate.png';
import machinelearningassociate from '../../assets/images/awsmachinelearningassociate.png'; 
import dataengineerassociate from '../../assets/images/awsdataengineerassociate.png'; 
import cloudopsassociate from '../../assets/images/awscloudopsassociate.png';
import saprofessional from '../../assets/images/awssaprofessional.png'; 
import devopsprofessional from '../../assets/images/awsdevopsprofessional.png'; 
import redesespecialista from '../../assets/images/awsredesespecialista.png';
import segurancaespecialista from '../../assets/images/awssegurancaespecialista.png'; 
import machinelearningespecialista from '../../assets/images/awsmachinelearningespecialista.png'; 


// --- NOVAS INTERFACES DE TIPAGEM AQUI ---
interface EloInfo {
  name: string;
  icon: string;
  hoverColor: string;
}

interface ProgressInfo {
  currentElo: { name: string; icon: string; };
  nextElo: { name: string; icon: string; };
  percentage: number;
  level: number;
  xp: number;
  ranking: number;
}

// Para cursos simples (como nos segmentos de Desenvolvimento e Dados atualmente)
interface SimpleCourse {
  id: string;
  title: string;
  description: string;
  image: string;
  link?: string; // Adicionado link para consistência futura
}

// Para módulos dentro de um nível (Infraestrutura)
interface Module {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
}

// Para certificações dentro de uma linha
interface Certification {
  id: string;
  title: string;
  icon: string;
  link: string;
}

// Para uma linha de certificação (ex: Foundation, Associate)
interface CertificationLine {
  id: string;
  title: string;
  certs: Certification[];
}

// Para uma trilha de especialização em nuvem (ex: AWS, Azure)
interface SpecializationTrack {
  id: string; // Ex: 'aws', 'azure-pro-spec'
  provider: string; // Ex: 'AWS', 'Azure'
  status: 'available' | 'soon';
  logo?: string; // Logo do provedor de nuvem
  certificationLines: CertificationLine[];
}

// Para um nível completo (ex: Fundamentos, Intermediário)
interface LevelContent {
  id: 'fundamentos' | 'intermediario' | 'avancado';
  title: string;
  modules: Module[];
  specializationTracks: SpecializationTrack[];
}

// Tipos para os diferentes segmentos
interface SegmentoInfraestrutura {
  title: string;
  description: string;
  elo: EloInfo;
  progress: ProgressInfo;
  levels: LevelContent[]; // Infraestrutura usa a nova estrutura de níveis
}

interface SegmentoPadrao {
  title: string;
  description: string;
  elo: EloInfo;
  progress: ProgressInfo;
  courses: SimpleCourse[]; // Desenvolvimento e Dados usam a estrutura antiga de cursos
}

// O tipo principal que mapeia todos os segmentos
type SegmentosData = {
  infraestrutura: SegmentoInfraestrutura;
  desenvolvimento: SegmentoPadrao;
  dados: SegmentoPadrao;
};
// --- FIM DAS NOVAS INTERFACES DE TIPAGEM ---


// --- DADOS DINÂMICOS DO REPOSITÓRIO ---
// Dados estáticos apenas para configuração de segmentos (elos, progresso, etc.)
const segmentosConfig = {
  infraestrutura: {
    title: 'Infraestrutura',
    description: 'Explore desde os fundamentos de redes até as complexidades de cloud computing e automação com uma trilha completa em Infraestrutura e DevOps.',
    elo: { name: 'DIAMANTE', icon: emblem1, hoverColor: '#00FFFF' },
    progress: { 
      currentElo: { name: 'DIAMANTE', icon: emblem1 }, 
      nextElo: { name: 'MESTRE', icon: emblem2 }, 
      percentage: 30,
      level: 15,
      xp: 2450,
      ranking: 42
    }
  },
  desenvolvimento: {
    title: 'Desenvolvimento',
    description: 'Uma trilha completa que começa com algoritmos e lógica, passa por cursos dedicados a cada linguagem de programação popular, e avança para temas como engenharia e arquitetura de software.',
    elo: { name: 'MESTRE', icon: emblem2, hoverColor: '#FFD700' },
    progress: { 
      currentElo: { name: 'MESTRE', icon: emblem2 }, 
      nextElo: { name: 'ORACLE', icon: emblem3 }, 
      percentage: 35,
      level: 12,
      xp: 1890,
      ranking: 28
    }
  },
  dados: {
    title: 'Ciência de Dados',
    description: 'Universo de cursos que inclui desde a estrutura de dados e bancos de dados até especialidades como engenharia de dados, ambientes analíticos, Inteligência Artificial e Machine Learning.',
    elo: { name: 'PLATINA', icon: emblem3, hoverColor: '#E5E4E2' },
    progress: { 
      currentElo: { name: 'PLATINA', icon: emblem3 }, 
      nextElo: { name: 'DIAMANTE', icon: emblem1 }, 
      percentage: 80,
      level: 8,
      xp: 1200,
      ranking: 156
    }
  }
};
// --- FIM DOS DADOS DINÂMICOS ---


export const SegmentosPage: FC = () => {
  const { segmentoId } = useParams<{ segmentoId?: 'infraestrutura' | 'desenvolvimento' | 'dados' }>(); // segmentoId pode ser undefined no início

  // --- TODOS OS HOOKS DECLARADOS NO TOPO E INCONDICIONALMENTE ---

  // 1. currentSegmentData useMemo:
  // Inicializa com null e trata a busca do segmento.
  const currentSegmentData = useMemo(() => {
    if (!segmentoId || !segmentosConfig[segmentoId]) {
      return null;
    }
    return segmentosConfig[segmentoId];
  }, [segmentoId]); // Depende apenas de segmentoId

  // 2. activeLevelId useState:
  // Sempre inicia com 'fundamentos' para infraestrutura, outros segmentos não usam níveis
  const [activeLevelId, setActiveLevelId] = useState<'fundamentos' | 'intermediario' | 'avancado'>('fundamentos');

  // 3. activeCloudProviderId useState:
  // Declarado incondicionalmente.
  const [activeCloudProviderId, setActiveCloudProviderId] = useState<'aws' | 'azure' | 'gcp'>('aws');

  // Dynamic courses fetched from backend
  type ApiCourse = { id: number; title: string; subtitle?: string | null; description?: string | null; type: 'modulo_essencial' | 'trilha_especializacao'; segment: 'infraestrutura' | 'desenvolvimento' | 'dados'; level: 'fundamentos' | 'intermediario' | 'avancado'; provider?: 'aws' | 'azure' | 'gcp' | null; image_path?: string | null };
  const [apiCourses, setApiCourses] = useState<ApiCourse[]>([]);
  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('http://localhost:4000/courses');
        const data = await res.json();
        setApiCourses(data || []);
      } catch (e) {
        setApiCourses([]);
      }
    }
    load();
  }, []);

  // Filter courses by current segment and active level
  const currentSegmentCourses = useMemo(() => {
    if (!segmentoId) return [];
    return apiCourses.filter(c => c.segment === segmentoId);
  }, [apiCourses, segmentoId]);

  const essentialModules = useMemo(() => {
    return currentSegmentCourses.filter(c => c.type === 'modulo_essencial' && c.level === activeLevelId);
  }, [currentSegmentCourses, activeLevelId]);

  const specializationTracks = useMemo(() => {
    return currentSegmentCourses.filter(c => c.type === 'trilha_especializacao' && c.level === activeLevelId);
  }, [currentSegmentCourses, activeLevelId]);

  // Funções de callback para evitar re-renderizações desnecessárias
  const handleLevelChange = useCallback((levelId: 'fundamentos' | 'intermediario' | 'avancado') => {
    setActiveLevelId(levelId);
    // Ao mudar de nível, resetamos o provedor de nuvem ativo para 'aws'
    setActiveCloudProviderId('aws');
  }, []);

  const handleCloudProviderChange = useCallback((providerId: 'aws' | 'azure' | 'gcp') => {
    setActiveCloudProviderId(providerId);
  }, []);

  // 4. activeLevelContent useMemo:
  // Para infraestrutura, sempre retorna um objeto com os níveis dinâmicos
  const activeLevelContent = useMemo<LevelContent | null>(() => {
    if (segmentoId === 'infraestrutura') {
      return {
        id: activeLevelId,
        title: activeLevelId.charAt(0).toUpperCase() + activeLevelId.slice(1),
        modules: [], // Será preenchido dinamicamente
        specializationTracks: [] // Será preenchido dinamicamente
      };
    }
    return null;
  }, [activeLevelId, segmentoId]);

    // 5. activeSpecializationTrack useMemo:
  // Para trilhas de especialização dinâmicas agrupadas por provider
  const activeSpecializationTrack = useMemo<SpecializationTrack | null>(() => {
    if (segmentoId === 'infraestrutura' && specializationTracks.length > 0) {
      // Agrupa por provider usando o campo provider do banco
      const awsTracks = specializationTracks.filter(c => c.provider === 'aws');
      const azureTracks = specializationTracks.filter(c => c.provider === 'azure');
      const gcpTracks = specializationTracks.filter(c => c.provider === 'gcp');

      const tracks = [];
      if (awsTracks.length > 0) tracks.push({ id: 'aws', provider: 'AWS', status: 'available' as const, courses: awsTracks });
      if (azureTracks.length > 0) tracks.push({ id: 'azure', provider: 'Azure', status: 'available' as const, courses: azureTracks });
      if (gcpTracks.length > 0) tracks.push({ id: 'gcp', provider: 'GCP', status: 'available' as const, courses: gcpTracks });

      return tracks.find(track => track.id === activeCloudProviderId) || null;
    }
    return null;
  }, [specializationTracks, activeCloudProviderId, segmentoId]); 

  // --- EARLY RETURN AGORA VEM DEPOIS DE TODOS OS HOOKS DECLARADOS ---
  if (!currentSegmentData) { 
    return <div>Segmento não encontrado ou URL inválida!</div>; 
  }
  // --- FIM DA SEÇÃO DE HOOKS E EARLY RETURN ---

  // Variáveis derivadas de currentSegmentData (que agora sabemos que NÃO é null)
  const { progress, elo } = currentSegmentData;

  return (
    <AnimatedPage>
      <SegmentoWrapper>
        <Header />
        <MainContent>
          <PageBannerWithEditor pageId={`segment-${segmentoId}`}>
            <BannerLeftColumn>
              <PageSubtitle>SEGMENTO:</PageSubtitle>
              <PageTitle>{currentSegmentData.title}</PageTitle>
              <PageDescription>{currentSegmentData.description}</PageDescription>
            </BannerLeftColumn>
            <BannerRightColumn>
              <EmblemWrapper $scaleFactor={1}> {/* <-- Ajustado para scaleFactor */}
                <EmblemBackground>
                  <TextContainer>
                    <EloTitle>{currentSegmentData.title}</EloTitle>
                    <EloSubtitle>{elo.name}</EloSubtitle>
                    <Infolink>Entenda sobre o Elo</Infolink>
                  </TextContainer>
                </EmblemBackground>
                <EmblemImage 
                  src={elo.icon} 
                  alt={`Emblema de ${elo.name}`} 
                  $hoverColor={elo.hoverColor} 
                />
              </EmblemWrapper>
            </BannerRightColumn>
          </PageBannerWithEditor>
          
          <ContentSection>
            <SectionTitle>SEU PROGRESSO</SectionTitle>
            <ProgressBarContainer>
              <ProgressStatsGrid>
                {/* Primeiro card - Barra de progresso circular com ícone do elo */}
                <ProgressCircularCard>
                  <CircularProgressBar
                    percentage={progress.percentage}
                    icon={progress.currentElo.icon}
                    iconAlt={`Ícone do Elo ${progress.currentElo.name}`}
                    size={140}
                    strokeWidth={12}
                    color={elo.hoverColor}
                  />
                </ProgressCircularCard>
                
                {/* Segundo card - Nível */}
                <ProgressStatsCard>
                  <StatsCard
                    value={progress.level}
                    label="NÍVEL"
                    color={elo.hoverColor}
                  />
                </ProgressStatsCard>
                
                {/* Terceiro card - XP */}
                <ProgressStatsCard>
                  <StatsCard
                    value={progress.xp}
                    label="XP"
                    color={elo.hoverColor}
                  />
                </ProgressStatsCard>
              </ProgressStatsGrid>
            </ProgressBarContainer>

            {/* Renderiza a barra de navegação de níveis SOMENTE para o segmento de infraestrutura */}
            {segmentoId === 'infraestrutura' && (
              <ContainerContent>
                <LevelNavBar>
                  {['fundamentos', 'intermediario', 'avancado'].map(level => (
                    <LevelButton 
                      key={level} 
                      className={activeLevelId === level ? 'active' : ''}
                      onClick={() => handleLevelChange(level as any)}
                    >
                      {level.toUpperCase()}
                    </LevelButton>
                  ))}
                </LevelNavBar>
              </ContainerContent>
            )}

            {/* --- Renderização de conteúdo para o segmento de INFRAESTRUTURA ou outros --- */}
            {segmentoId === 'infraestrutura' && activeLevelContent ? (
              <ContainerContent>
                {/* Seção de Módulos Essenciais */}
                <SectionTitle style={{ marginBottom: '2rem' }}>MÓDULOS ESSENCIAIS</SectionTitle>
                <ModulesGrid key={`modules-${activeLevelId}`}>
                  {essentialModules.length > 0 ? (
                    essentialModules.map(course => (
                      <ModuleCardContainer key={`${activeLevelId}-${course.id}`}>
                        <Link to={`/curso/${course.id}`}>
                          <ModuleCard>
                            <img src={course.image_path ? `http://localhost:4000${course.image_path}` : reactImage} alt={course.title} />
                            <div className="content-area">
                              <h4>{course.title}</h4>
                              <p>{course.subtitle || course.description || ''}</p>
                              <Link to={`/curso/${course.id}`} className="module-button">
                                Acessar Módulo
                              </Link>
                            </div>
                          </ModuleCard>
                        </Link>
                      </ModuleCardContainer>
                    ))
                  ) : (
                    /* Mostrar card bonito "Em breve" para níveis intermediário e avançado */
                    <ModuleCardContainer>
                      {(activeLevelId === 'intermediario' || activeLevelId === 'avancado') ? (
                        <EmptyModuleCard>
                          <div className="icon">📚</div>
                          <h4>Em Breve</h4>
                          <p>Módulos essenciais para o nível {activeLevelId.charAt(0).toUpperCase() + activeLevelId.slice(1)} serão adicionados em breve!</p>
                        </EmptyModuleCard>
                      ) : (
                        <EmptyModuleCard>
                          <div className="icon">📚</div>
                          <h4>Em Breve</h4>
                          <p>Módulos essenciais para este nível serão adicionados em breve!</p>
                        </EmptyModuleCard>
                      )}
                    </ModuleCardContainer>
                  )}
                </ModulesGrid>

                {/* Seção de Trilhas de Especialização */}
                  <SpecializationSection>
                    <SectionTitle style={{ marginTop: '4rem', marginBottom: '2rem' }}>
                      TRILHAS DE ESPECIALIZAÇÃO
                    </SectionTitle>

                  {/* Navegação por Provider */}
                    <CloudProviderNavBar>
                    <CloudProviderButton
                      className={activeCloudProviderId === 'aws' ? 'active' : ''}
                      onClick={() => handleCloudProviderChange('aws')}
                    >
                      AWS
                    </CloudProviderButton>
                    <CloudProviderButton
                      className={activeCloudProviderId === 'azure' ? 'active' : ''}
                      onClick={() => handleCloudProviderChange('azure')}
                    >
                      AZURE
                    </CloudProviderButton>
                        <CloudProviderButton
                      className={activeCloudProviderId === 'gcp' ? 'active' : ''}
                      onClick={() => handleCloudProviderChange('gcp')}
                    >
                      GCP
                        </CloudProviderButton>
                    </CloudProviderNavBar>

                  {/* Conteúdo por Provider */}
                  {/* Renderizar cursos dinâmicos primeiro */}
                  {activeSpecializationTrack && activeSpecializationTrack.courses.length > 0 ? (
                    <CertificationLinesContainer>
                      <CertificationLine>
                        <h3>Certificações {activeCloudProviderId.toUpperCase()} - {activeLevelId.charAt(0).toUpperCase() + activeLevelId.slice(1)}</h3>
                        <CertsGrid>
                          {activeSpecializationTrack.courses.map(course => (
                            <CertificationCard key={course.id}>
                              <img 
                                src={course.image_path ? `http://localhost:4000${course.image_path}` : awsCloudPractitioner} 
                                alt={course.title} 
                                style={{ height: '150px', width: '125px' }}
                              />
                              <p style={{ fontSize: '15px' }}>{course.title}</p>
                              <Link to={`/curso/${course.id}`}>Acesse o Curso</Link>
                            </CertificationCard>
                          ))}
                        </CertsGrid>
                      </CertificationLine>
                    </CertificationLinesContainer>
                  ) : activeCloudProviderId === 'aws' ? (
                      <CertificationLinesContainer>
                      {/* Fundamentos - Practitioners */}
                      {activeLevelId === 'fundamentos' && (
                        <CertificationLine>
                          <h3>Certificações Fundamentais</h3>
                          <CertsGrid>
                            {/* Cloud Practitioner - Disponível */}
                            <CertificationCard>
                              <img 
                                src={awsCloudPractitioner} 
                                alt="AWS Cloud Practitioner" 
                                style={{ height: '150px', width: '125px' }}
                              />
                              <p style={{ fontSize: '15px' }}>Cloud Practitioner Foundation</p>
                              <Link to="/curso/aws-clf">Acesse o Curso</Link>
                            </CertificationCard>
                            
                            {/* AI Practitioner - Em breve */}
                            <CertificationCard style={{ opacity: 0.5 }}>
                              <img 
                                src={awsAIPractitioner} 
                                alt="AWS AI Practitioner" 
                                style={{ height: '150px', width: '125px' }}
                              />
                              <p style={{ fontSize: '15px', color: '#666' }}>AI Practitioner Foundation</p>
                              <span style={{ color: '#666' }}>Em breve</span>
                            </CertificationCard>
                          </CertsGrid>
                        </CertificationLine>
                      )}

                      {/* Intermediário - Associates */}
                      {activeLevelId === 'intermediario' && (
                        <CertificationLine>
                          <h3>Certificações Associate</h3>
                          <CertsGrid>
                            <CertificationCard style={{ opacity: 0.5 }}>
                              <img src={awsSAAssociate} alt="Solutions Architect Associate" style={{ height: '150px', width: '125px' }}/>
                              <p style={{ fontSize: '15px', color: '#666' }}>Solutions Architect Associate</p>
                              <span style={{ color: '#666' }}>Em breve</span>
                            </CertificationCard>
                            <CertificationCard style={{ opacity: 0.5 }}>
                              <img src={awsDeveloperAssociate} alt="Developer Associate" style={{ height: '150px', width: '125px' }}/>
                              <p style={{ fontSize: '15px', color: '#666' }}>Developer Associate</p>
                              <span style={{ color: '#666' }}>Em breve</span>
                            </CertificationCard>
                            <CertificationCard style={{ opacity: 0.5 }}>
                              <img src={awsCloudOpsAssociate} alt="CloudOps Engineer Associate" style={{ height: '150px', width: '125px' }}/>
                              <p style={{ fontSize: '15px', color: '#666' }}>CloudOps Engineer Associate</p>
                              <span style={{ color: '#666' }}>Em breve</span>
                            </CertificationCard>
                            <CertificationCard style={{ opacity: 0.5 }}>
                              <img src={awsDataEngineerAssociate} alt="Data Engineer Associate" style={{ height: '150px', width: '125px' }}/>
                              <p style={{ fontSize: '15px', color: '#666' }}>Data Engineer Associate</p>
                              <span style={{ color: '#666' }}>Em breve</span>
                            </CertificationCard>
                            <CertificationCard style={{ opacity: 0.5 }}>
                              <img src={awsMachineLearningAssociate} alt="Machine Learning Associate" style={{ height: '150px', width: '125px' }}/>
                              <p style={{ fontSize: '15px', color: '#666' }}>Machine Learning Associate</p>
                              <span style={{ color: '#666' }}>Em breve</span>
                            </CertificationCard>
                          </CertsGrid>
                        </CertificationLine>
                      )}

                      {/* Avançado - Professional e Specialty */}
                      {activeLevelId === 'avancado' && (
                        <>
                          <CertificationLine>
                            <h3>Certificações Professional</h3>
                            <CertsGrid>
                              <CertificationCard style={{ opacity: 0.5 }}>
                                <img src={awsSAProfessional} alt="Solutions Architect Professional" style={{ height: '150px', width: '125px' }}/>
                                <p style={{ fontSize: '15px', color: '#666' }}>Solutions Architect Professional</p>
                                <span style={{ color: '#666' }}>Em breve</span>
                              </CertificationCard>
                              <CertificationCard style={{ opacity: 0.5 }}>
                                <img src={awsDevOpsProfessional} alt="DevOps Engineer Professional" style={{ height: '150px', width: '125px' }}/>
                                <p style={{ fontSize: '15px', color: '#666' }}>DevOps Engineer Professional</p>
                                <span style={{ color: '#666' }}>Em breve</span>
                              </CertificationCard>
                            </CertsGrid>
                          </CertificationLine>
                          <CertificationLine>
                            <h3>Certificações Especialista</h3>
                            <CertsGrid>
                              <CertificationCard style={{ opacity: 0.5 }}>
                                <img src={awsNetworkingSpecialty} alt="Advanced Networking Specialty" style={{ height: '150px', width: '125px' }}/>
                                <p style={{ fontSize: '15px', color: '#666' }}>Advanced Networking Specialty</p>
                                <span style={{ color: '#666' }}>Em breve</span>
                              </CertificationCard>
                              <CertificationCard style={{ opacity: 0.5 }}>
                                <img src={awsSecuritySpecialty} alt="Security Specialty" style={{ height: '150px', width: '125px' }}/>
                                <p style={{ fontSize: '15px', color: '#666' }}>Security Specialty</p>
                                <span style={{ color: '#666' }}>Em breve</span>
                              </CertificationCard>
                              <CertificationCard style={{ opacity: 0.5 }}>
                                <img src={awsMLSpecialty} alt="Machine Learning Specialty" style={{ height: '150px', width: '125px' }}/>
                                <p style={{ fontSize: '15px', color: '#666' }}>Machine Learning Specialty</p>
                                <span style={{ color: '#666' }}>Em breve</span>
                                  </CertificationCard>
                            </CertsGrid>
                          </CertificationLine>
                        </>
                      )}
                      </CertificationLinesContainer>
                  ) : (
                    /* Azure e GCP - Em breve */
                    <CertificationLinesContainer>
                      <CertificationLine>
                        <h3>{activeCloudProviderId.toUpperCase()} - Cursos para esta trilha serão adicionados em breve!</h3>
                        <CertsGrid>
                          <EmptyCertificationCard>
                            <div className="icon">🏆</div>
                            <h4>Em Breve</h4>
                            <p>Certificações {activeCloudProviderId.toUpperCase()} serão adicionadas em breve!</p>
                          </EmptyCertificationCard>
                        </CertsGrid>
                      </CertificationLine>
                    </CertificationLinesContainer>
                  )}
                  </SpecializationSection>
              </ContainerContent>
            ) : (
              // --- Conteúdo para outros segmentos (Desenvolvimento, Dados) com mesma lógica de infraestrutura ---
              <ContainerContent>
                {/* Renderiza a barra de navegação de níveis para todos os segmentos */}
                <LevelNavBar>
                  {['fundamentos', 'intermediario', 'avancado'].map(level => (
                    <LevelButton 
                      key={level} 
                      className={activeLevelId === level ? 'active' : ''}
                      onClick={() => handleLevelChange(level as any)}
                    >
                      {level.toUpperCase()}
                    </LevelButton>
                  ))}
                </LevelNavBar>

                {/* Seção de Módulos Essenciais */}
                <SectionTitle style={{ marginTop: '2rem', marginBottom: '2rem' }}>MÓDULOS ESSENCIAIS</SectionTitle>
                <ModulesGrid key={`modules-${activeLevelId}-${segmentoId}`}>
                  {currentSegmentCourses.filter(c => c.type === 'modulo_essencial').length > 0 ? (
                    currentSegmentCourses.filter(c => c.type === 'modulo_essencial').map(course => (
                      <ModuleCardContainer key={`${activeLevelId}-${course.id}`}>
                        <Link to={`/curso/${course.id}`}>
                          <ModuleCard>
                            <img src={course.image_path ? `http://localhost:4000${course.image_path}` : reactImage} alt={course.title} />
                            <div className="content-area">
                              <h4>{course.title}</h4>
                              <p>{course.subtitle || course.description || ''}</p>
                              <Link to={`/curso/${course.id}`} className="module-button">
                                Acessar Módulo
                              </Link>
                            </div>
                          </ModuleCard>
                        </Link>
                      </ModuleCardContainer>
                    ))
                  ) : (
                    /* Mostrar card bonito "Em breve" para todos os níveis */
                    <ModuleCardContainer>
                      <EmptyModuleCard>
                        <div className="icon">📚</div>
                        <h4>Em Breve</h4>
                        <p>Módulos essenciais para {segmentoId === 'desenvolvimento' ? 'Desenvolvimento' : 'Ciência de Dados'} serão adicionados em breve!</p>
                      </EmptyModuleCard>
                    </ModuleCardContainer>
                  )}
                </ModulesGrid>

                {/* Seção de Trilhas de Especialização */}
                <SpecializationSection>
                  <SectionTitle style={{ marginTop: '4rem', marginBottom: '2rem' }}>
                    TRILHAS DE ESPECIALIZAÇÃO
                  </SectionTitle>

                  {/* Navegação por Provider */}
                  <CloudProviderNavBar>
                    <CloudProviderButton
                      className={activeCloudProviderId === 'aws' ? 'active' : ''}
                      onClick={() => handleCloudProviderChange('aws')}
                    >
                      AWS
                    </CloudProviderButton>
                    <CloudProviderButton
                      className={activeCloudProviderId === 'azure' ? 'active' : ''}
                      onClick={() => handleCloudProviderChange('azure')}
                    >
                      AZURE
                    </CloudProviderButton>
                    <CloudProviderButton
                      className={activeCloudProviderId === 'gcp' ? 'active' : ''}
                      onClick={() => handleCloudProviderChange('gcp')}
                    >
                      GCP
                    </CloudProviderButton>
                  </CloudProviderNavBar>

                  {/* Conteúdo por Provider - Todos "Em breve" para desenvolvimento e dados */}
                  <CertificationLinesContainer>
                    <CertificationLine>
                      <h3>{activeCloudProviderId.toUpperCase()} - Cursos para {segmentoId === 'desenvolvimento' ? 'Desenvolvimento' : 'Ciência de Dados'} serão adicionados em breve!</h3>
                      <CertsGrid>
                        <EmptyCertificationCard>
                          <div className="icon">🏆</div>
                          <h4>Em Breve</h4>
                          <p>Certificações {activeCloudProviderId.toUpperCase()} para {segmentoId === 'desenvolvimento' ? 'Desenvolvimento' : 'Ciência de Dados'} serão adicionadas em breve!</p>
                        </EmptyCertificationCard>
                      </CertsGrid>
                    </CertificationLine>
                  </CertificationLinesContainer>
                </SpecializationSection>
              </ContainerContent>
            )}
          </ContentSection>
        </MainContent>
        <Rodape />
      </SegmentoWrapper>
    </AnimatedPage>
  );
};