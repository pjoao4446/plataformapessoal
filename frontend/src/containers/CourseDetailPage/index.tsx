import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

const ModuleCard = styled.div`
  background: #111;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
`;

type Course = { id: number; title: string; subtitle?: string | null; description?: string | null; image_path?: string | null };
type Module = { id: number; course_id: number; title: string; position: number };
type Lesson = { id: number; module_id: number; title: string; video_url?: string | null; summary?: string | null };
type Quiz = { id: number; lesson_id: number; question: string; options?: string[] };

export function CourseDetailPage() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:4000/courses/${id}`);
        if (!res.ok) throw new Error('not ok');
        const data = await res.json();
        setCourse(data.course);
        setModules(data.modules);
        setLessons(data.lessons);
        setQuizzes(data.quizzes.map((q: any) => ({ ...q, options: q.options ?? undefined })));
      } catch (e) {
        setError('Falha ao carregar curso');
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  return (
    <Page>
      <Header />
      <Content>
        {loading && <p>Carregando...</p>}
        {error && <p>{error}</p>}
        {course && (
          <div>
            <h2>{course.title}</h2>
            {course.image_path && (
              <div style={{ margin: '12px 0' }}>
                <img src={`http://localhost:4000${course.image_path}`} alt={course.title} style={{ maxWidth: '100%', borderRadius: 8 }} />
              </div>
            )}
            {course.subtitle && <h4 style={{ color: '#aaa' }}>{course.subtitle}</h4>}
            {course.description && <p>{course.description}</p>}
          </div>
        )}
        {modules.map((m) => (
          <ModuleCard key={m.id}>
            <h3>{m.title}</h3>
            {lessons.filter((l) => l.module_id === m.id).map((l) => (
              <div key={l.id} style={{ marginLeft: 16, marginTop: 8 }}>
                <strong>{l.title}</strong>
                {l.video_url && (
                  <div style={{ marginTop: 8 }}>
                    <a href={l.video_url} target="_blank" rel="noreferrer">Assistir Vídeo</a>
                  </div>
                )}
                {l.summary && <p style={{ marginTop: 8 }}>{l.summary}</p>}
                {quizzes.filter((q) => q.lesson_id === l.id).map((q) => (
                  <div key={q.id} style={{ marginLeft: 16, marginTop: 8 }}>
                    <em>{q.question}</em>
                    {q.options && (
                      <ul>
                        {q.options.map((opt, idx) => (
                          <li key={idx}>{opt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </ModuleCard>
        ))}
      </Content>
    </Page>
  );
}


