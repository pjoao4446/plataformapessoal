import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { useTheme } from '../../context/ThemeContext';
import { PageTitleProvider } from '../../context/PageTitleContext';
import { getTheme } from '../../styles/theme';

interface MainLayoutProps {
  children: ReactNode;
}

/**
 * MainLayout - Layout Principal da Aplicação
 * Com suporte a Dark/Light Mode
 * Inclui Sidebar fixa e TopBar fixa
 */
export function MainLayout({ children }: MainLayoutProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  return (
    <PageTitleProvider>
      <div 
        style={{
          display: 'flex',
          height: '100vh',
          width: '100vw',
          margin: 0,
          padding: 0,
          backgroundColor: themeColors.background,
          overflow: 'hidden',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {/* Sidebar Fixa */}
        <Sidebar />
        
        {/* Área de Conteúdo Principal - Compensando a sidebar fixa */}
        <main 
          style={{
            flex: 1,
            marginLeft: '18rem',
            height: '100vh',
            overflowY: 'auto',
            overflowX: 'hidden',
            backgroundColor: themeColors.background,
            WebkitOverflowScrolling: 'touch',
            width: 'calc(100vw - 18rem)',
            maxWidth: 'calc(100vw - 18rem)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* TopBar Fixa */}
          <TopBar />
          
          {/* Conteúdo Principal - Padding-top para não ficar escondido atrás da TopBar */}
          <div
            style={{
              flex: 1,
              paddingTop: '1rem', // Espaçamento adicional para garantir que o conteúdo não fique escondido
            }}
          >
            {children}
          </div>
        </main>
      </div>
    </PageTitleProvider>
  );
}
