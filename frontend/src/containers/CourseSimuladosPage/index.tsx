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

const BackButton = styled.button`
  background: #333;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  border-radius: 8px;
  padding: 12px 24px;
  cursor: pointer;
  margin-bottom: 30px;
  transition: all 0.3s ease;
  
  &:hover {
    background: #444;
  }
`;

const CourseTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 30px;
  color: ${(p) => p.theme.colors.accentCyan};
`;

const SimuladosGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
`;

const SimuladoCard = styled.div`
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 24px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(0, 255, 255, 0.3);
    transform: translateY(-2px);
  }
`;

const SimuladoTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 12px;
  color: #fff;
`;

const SimuladoDescription = styled.p`
  color: #aaa;
  margin-bottom: 20px;
  line-height: 1.5;
`;

const SimuladoMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MetaInfo = styled.span`
  background: #333;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #ccc;
`;

const StartSimuladoButton = styled.button`
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border: none;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(76, 175, 80, 0.4);
  }
`;

const QuestionsSection = styled.div`
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 24px;
  color: #fff;
`;

const QuestionCard = styled.div`
  background: #1a1a1a;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
`;

const QuestionTitle = styled.h3`
  color: ${(p) => p.theme.colors.accentCyan};
  margin-bottom: 15px;
`;

const QuestionText = styled.p`
  font-weight: bold;
  margin-bottom: 15px;
  color: #fff;
`;

const OptionsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const OptionItem = styled.li`
  padding: 8px 0;
  color: #ccc;
  
  &.correct {
    color: #4CAF50;
    font-weight: bold;
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
};

type Quiz = {
  id: number;
  lesson_id: number;
  question: string;
  options: string[];
  correct_option_index: number;
  position: number;
};

export function CourseSimuladosPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
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
        setQuizzes(data.quizzes.map((q: any) => ({ ...q, options: q.options ?? [] })));
      } catch (e) {
        setError('Falha ao carregar curso');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  const handleBackToCourse = () => {
    navigate(`/curso/${id}/conteudo`);
  };

  const handleStartSimulado = () => {
    // Aqui você pode implementar a lógica para iniciar um simulado
    alert('Funcionalidade de simulado será implementada em breve!');
  };

  if (loading) {
    return (
      <Page>
        <Header />
        <Content>
          <LoadingMessage>Carregando simulados...</LoadingMessage>
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
        <BackButton onClick={handleBackToCourse}>
          ← Voltar ao Curso
        </BackButton>

        <CourseTitle>Simulados - {course.title}</CourseTitle>

        <SimuladosGrid>
          <SimuladoCard>
            <SimuladoTitle>Simulado Geral</SimuladoTitle>
            <SimuladoDescription>
              Teste seus conhecimentos com questões de todo o curso
            </SimuladoDescription>
            <SimuladoMeta>
              <MetaInfo>{quizzes.length} questões</MetaInfo>
              <MetaInfo>60 minutos</MetaInfo>
            </SimuladoMeta>
            <StartSimuladoButton onClick={handleStartSimulado}>
              Iniciar Simulado
            </StartSimuladoButton>
          </SimuladoCard>

          <SimuladoCard>
            <SimuladoTitle>Simulado por Módulo</SimuladoTitle>
            <SimuladoDescription>
              Pratique com questões específicas de cada módulo
            </SimuladoDescription>
            <SimuladoMeta>
              <MetaInfo>Por módulo</MetaInfo>
              <MetaInfo>30 minutos</MetaInfo>
            </SimuladoMeta>
            <StartSimuladoButton onClick={handleStartSimulado}>
              Iniciar Simulado
            </StartSimuladoButton>
          </SimuladoCard>

          <SimuladoCard>
            <SimuladoTitle>Simulado Rápido</SimuladoTitle>
            <SimuladoDescription>
              Teste rápido com 10 questões aleatórias
            </SimuladoDescription>
            <SimuladoMeta>
              <MetaInfo>10 questões</MetaInfo>
              <MetaInfo>15 minutos</MetaInfo>
            </SimuladoMeta>
            <StartSimuladoButton onClick={handleStartSimulado}>
              Iniciar Simulado
            </StartSimuladoButton>
          </SimuladoCard>
        </SimuladosGrid>

        <QuestionsSection>
          <SectionTitle>Questões Disponíveis</SectionTitle>
          {quizzes.length > 0 ? (
            quizzes.map(quiz => (
              <QuestionCard key={quiz.id}>
                <QuestionTitle>Questão {quiz.position}</QuestionTitle>
                <QuestionText>{quiz.question}</QuestionText>
                <OptionsList>
                  {quiz.options.map((option, index) => (
                    <OptionItem 
                      key={index}
                      className={index === quiz.correct_option_index ? 'correct' : ''}
                    >
                      {index + 1}. {option}
                      {index === quiz.correct_option_index && ' ✅'}
                    </OptionItem>
                  ))}
                </OptionsList>
              </QuestionCard>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#aaa' }}>
              Nenhuma questão disponível para este curso.
            </div>
          )}
        </QuestionsSection>
      </Content>
    </Page>
  );
}

