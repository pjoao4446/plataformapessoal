import { ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageContainer - Container padronizado para todas as páginas
 * Garante espaçamento consistente e largura máxima otimizada
 * Design System: VertexGuard Premium Dark/Light
 */
export function PageContainer({ children, className = '' }: PageContainerProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '1600px',
        margin: '0 auto',
        paddingTop: '1.5rem', // Espaçamento consistente do topo (24px)
        paddingBottom: '1.5rem',
        paddingLeft: '1.5rem',
        paddingRight: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem', // gap-6 = 1.5rem (24px)
        color: themeColors.text,
        boxSizing: 'border-box',
      }}
      className={className}
    >
      {children}
    </div>
  );
}

