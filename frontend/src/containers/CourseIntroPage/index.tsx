import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Header } from '../../components/Header';

const Page = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
`;

const Content = styled.div`
  width: 80%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 24px 0 48px;
`;

const CourseHeader = styled.div`
  margin-bottom: 40px;
`;

const CourseImage = styled.img`
  width: 100%;
  max-width: 800px;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 24px;
`;

const CourseTitle = styled.h1`
  font-size: 3rem;
  margin-bottom: 16px;
  color: ${(p) => p.theme.colors.accentCyan};
  font-weight: 700;
`;

const CourseSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #aaa;
  margin-bottom: 24px;
`;

const CourseDescription = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 32px;
  color: #ccc;
`;

const CourseMeta = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
  flex-wrap: wrap;
`;

const MetaTag = styled.span`
  background: linear-gradient(135deg, #333 0%, #444 100%);
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 1rem;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TopicsSection = styled.div`
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 32px;
  margin-bottom: 40px;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  margin-bottom: 24px;
  color: #fff;
`;

const TopicsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TopicItem = styled.li`
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #ccc;
  font-size: 1.1rem;
  
  &:last-child {
    border-bottom: none;
  }
  
  &::before {
    content: "✓";
    color: ${(p) => p.theme.colors.accentCyan};
    font-weight: bold;
    margin-right: 12px;
  }
`;

const ActionSection = styled.div`
  background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
`;

const StartButton = styled.button`
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, #00cccc 100%);
  border: none;
  color: #000;
  font-weight: bold;
  border-radius: 12px;
  padding: 20px 40px;
  cursor: pointer;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(0, 255, 255, 0.4);
  }
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #aaa;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  color: #ff6b6b;
`;

type Course = {
  id: number;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  image_path?: string | null;
  type: 'modulo_essencial' | 'trilha_especializacao';
  segment: 'infraestrutura' | 'desenvolvimento' | 'dados';
  level: 'fundamentos' | 'intermediario' | 'avancado';
  provider?: 'aws' | 'azure' | 'gcp' | null;
  topics?: string[];
};

export function CourseIntroPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/courses/${id}`);
        if (!res.ok) throw new Error('Curso não encontrado');
        const data = await res.json();
        setCourse(data.course);
      } catch (e) {
        setError('Falha ao carregar curso');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const handleStartCourse = () => {
    navigate(`/curso/${id}/conteudo`);
  };

  if (loading) {
    return (
      <Page>
        <Header />
        <Content>
          <LoadingMessage>Carregando curso...</LoadingMessage>
        </Content>
      </Page>
    );
  }

  if (error || !course) {
    return (
      <Page>
        <Header />
        <Content>
          <ErrorMessage>{error || 'Curso não encontrado'}</ErrorMessage>
        </Content>
      </Page>
    );
  }

  return (
    <Page>
      <Header />
      <Content>
        <CourseHeader>
          {course.image_path && (
            <CourseImage 
              src={`http://localhost:4000${course.image_path}`} 
              alt={course.title} 
            />
          )}
          <CourseTitle>{course.title}</CourseTitle>
          {course.subtitle && <CourseSubtitle>{course.subtitle}</CourseSubtitle>}
          {course.description && <CourseDescription>{course.description}</CourseDescription>}
          
          <CourseMeta>
            <MetaTag>
              {course.type === 'modulo_essencial' ? 'Módulo Essencial' : 'Trilha de Especialização'}
            </MetaTag>
            <MetaTag>{course.segment.charAt(0).toUpperCase() + course.segment.slice(1)}</MetaTag>
            <MetaTag>{course.level.charAt(0).toUpperCase() + course.level.slice(1)}</MetaTag>
            {course.provider && <MetaTag>{course.provider.toUpperCase()}</MetaTag>}
          </CourseMeta>
        </CourseHeader>

        <TopicsSection>
          <SectionTitle>O que você vai aprender</SectionTitle>
          <TopicsList>
            {course.topics && course.topics.length > 0 ? (
              course.topics.map((topic, index) => (
                <TopicItem key={index}>{topic}</TopicItem>
              ))
            ) : (
              <>
                <TopicItem>Fundamentos essenciais do curso</TopicItem>
                <TopicItem>Conceitos práticos e aplicações</TopicItem>
                <TopicItem>Exercícios e projetos práticos</TopicItem>
                <TopicItem>Simulados e avaliações</TopicItem>
              </>
            )}
          </TopicsList>
        </TopicsSection>

        <ActionSection>
          <h2 style={{ marginBottom: '24px', color: '#fff' }}>Pronto para começar?</h2>
          <p style={{ marginBottom: '32px', color: '#aaa', fontSize: '1.1rem' }}>
            Clique no botão abaixo para acessar o conteúdo completo do curso
          </p>
          <StartButton onClick={handleStartCourse}>
            🚀 Iniciar Curso
          </StartButton>
        </ActionSection>
      </Content>
    </Page>
  );
}
