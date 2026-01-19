import { useState } from 'react';
import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { PageContainer } from '../../components/layout/PageContainer';
import {
  BookOpen,
  Star,
  BookMarked,
  Heart,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import type { Book } from '../../mocks/database';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

/**
 * GoalsReadingPage - Página de Biblioteca de Livros
 * Visual de grid com cards de livros físicos
 * Design System: VertexGuard Premium Dark/Light
 */
export const GoalsReadingPage: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pagesInput, setPagesInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Buscar livros do Supabase
  useEffect(() => {
    if (user) {
      fetchBooks();
    }
  }, [user]);

  const fetchBooks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Por enquanto, deixar vazio pois pode não haver tabela de livros
      // Se houver, buscar assim:
      // const { data } = await supabase
      //   .from('books')
      //   .select('*')
      //   .eq('user_id', user.id);
      // setBooks(data || []);
      setBooks([]);
    } catch (err) {
      console.error('Erro ao carregar livros:', err);
    } finally {
      setLoading(false);
    }
  };


  // Obter cor do placeholder baseado no título
  const getPlaceholderColor = (title: string): string => {
    const colors = [
      themeColors.neon.purple,
      themeColors.neon.cyan,
      themeColors.neon.emerald,
      themeColors.neon.orange,
      themeColors.neon.pink,
    ];
    const index = title.length % colors.length;
    return colors[index];
  };

  // Obter ícone do status
  const getStatusIcon = (status: Book['status']) => {
    switch (status) {
      case 'reading':
        return BookOpen;
      case 'completed':
        return BookMarked;
      case 'wishlist':
        return Heart;
      default:
        return BookOpen;
    }
  };

  // Obter cor do status
  const getStatusColor = (status: Book['status']): string => {
    switch (status) {
      case 'reading':
        return themeColors.neon.cyan;
      case 'completed':
        return themeColors.neon.emerald;
      case 'wishlist':
        return themeColors.neon.orange;
      default:
        return themeColors.textMuted;
    }
  };

  // Obter label do status
  const getStatusLabel = (status: Book['status']): string => {
    switch (status) {
      case 'reading':
        return 'Lendo';
      case 'completed':
        return 'Concluído';
      case 'wishlist':
        return 'Desejado';
      default:
        return status;
    }
  };

  // Abrir modal para atualizar páginas
  const handleBookClick = (book: Book) => {
    setSelectedBook(book);
    setPagesInput(book.pagesRead.toString());
    setIsModalOpen(true);
  };

  // Salvar páginas lidas
  const handleSavePages = () => {
    if (!selectedBook) return;
    
    const newPages = parseInt(pagesInput) || 0;
    const updatedBooks = books.map(book => {
      if (book.id !== selectedBook.id) return book;
      
      const updatedBook: Book = {
        ...book,
        pagesRead: Math.min(newPages, book.totalPages),
        status: newPages >= book.totalPages ? 'completed' : book.status === 'wishlist' ? 'reading' : book.status,
      };
      
      return updatedBook;
    });
    
    setBooks(updatedBooks);
    setIsModalOpen(false);
    setSelectedBook(null);
    setPagesInput('');
  };

  // Calcular progresso
  const getProgress = (book: Book): number => {
    return book.totalPages > 0 ? Math.round((book.pagesRead / book.totalPages) * 100) : 0;
  };

  // Agrupar livros por status
  const booksByStatus = {
    reading: books.filter(b => b.status === 'reading'),
    completed: books.filter(b => b.status === 'completed'),
    wishlist: books.filter(b => b.status === 'wishlist'),
  };

  return (
    <PageContainer>
      {/* Estatísticas Rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookOpen style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.cyan }} />
            <div>
              <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0 }}>Lendo</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                {booksByStatus.reading.length}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <BookMarked style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.emerald }} />
            <div>
              <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0 }}>Concluídos</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                {booksByStatus.completed.length}
              </p>
            </div>
          </div>
        </Card>
        <Card padding="md">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Heart style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.orange }} />
            <div>
              <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0 }}>Desejados</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
                {booksByStatus.wishlist.length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Grid de Livros */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {books.map(book => {
          const StatusIcon = getStatusIcon(book.status);
          const statusColor = getStatusColor(book.status);
          const progress = getProgress(book);
          const placeholderColor = getPlaceholderColor(book.title);

          return (
            <div
              key={book.id}
              style={{
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={() => handleBookClick(book)}
              onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = `0 8px 16px ${statusColor}33`;
              }}
              onMouseLeave={(e: React.MouseEvent<HTMLDivElement>) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <Card padding="none">
              {/* Capa do Livro */}
              <div
                style={{
                  aspectRatio: '2/3',
                  backgroundColor: placeholderColor,
                  background: book.coverUrl
                    ? `url(${book.coverUrl}) center/cover`
                    : `linear-gradient(135deg, ${placeholderColor}, ${placeholderColor}CC)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                {!book.coverUrl && (
                  <BookOpen style={{ width: '3rem', height: '3rem', color: 'white', opacity: 0.7 }} />
                )}
                {/* Badge de Status */}
                <div
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    padding: '0.25rem 0.5rem',
                    borderRadius: '9999px',
                    backgroundColor: `${statusColor}CC`,
                    backdropFilter: 'blur(4px)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    fontSize: '0.75rem',
                    fontWeight: '600',
                    color: 'white',
                  }}
                >
                  <StatusIcon style={{ width: '0.75rem', height: '0.75rem' }} />
                  {getStatusLabel(book.status)}
                </div>
                {/* Rating para livros completos */}
                {book.status === 'completed' && book.rating && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '0.5rem',
                      left: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '9999px',
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        style={{
                          width: '0.75rem',
                          height: '0.75rem',
                          color: i < book.rating! ? themeColors.neon.orange : themeColors.textMuted,
                          fill: i < book.rating! ? themeColors.neon.orange : 'none',
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Informações do Livro */}
              <div style={{ padding: '1rem' }}>
                <h3
                  style={{
                    fontSize: '0.875rem',
                    fontWeight: '600',
                    color: themeColors.text,
                    marginBottom: '0.25rem',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {book.title}
                </h3>
                <p
                  style={{
                    fontSize: '0.75rem',
                    color: themeColors.textSecondary,
                    marginBottom: '0.75rem',
                    margin: 0,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {book.author}
                </p>

                {/* Barra de Progresso */}
                {book.status !== 'wishlist' && (
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary }}>
                        {book.pagesRead} / {book.totalPages} págs
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '600', color: statusColor }}>
                        {progress}%
                      </span>
                    </div>
                    <div
                      style={{
                        width: '100%',
                        height: '0.375rem',
                        backgroundColor: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          backgroundColor: statusColor,
                          borderRadius: '9999px',
                          transition: 'width 0.3s ease',
                          width: `${progress}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
              </Card>
            </div>
          );
        })}
      </div>

      {/* Modal para Atualizar Páginas */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedBook(null);
          setPagesInput('');
        }}
        title={selectedBook ? `Atualizar Progresso: ${selectedBook.title}` : 'Atualizar Progresso'}
        size="sm"
      >
        {selectedBook && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, marginBottom: '0.5rem', margin: 0 }}>
                Páginas lidas de {selectedBook.totalPages} total
              </p>
              <Input
                type="number"
                min="0"
                max={selectedBook.totalPages}
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
                placeholder="0"
                autoFocus
              />
            </div>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedBook(null);
                  setPagesInput('');
                }}
              >
                Cancelar
              </Button>
              <Button variant="primary" onClick={handleSavePages}>
                Salvar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </PageContainer>
  );
};
