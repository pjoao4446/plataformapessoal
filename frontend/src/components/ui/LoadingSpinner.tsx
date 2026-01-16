import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: themeColors.background,
        zIndex: 9999,
      }}
    >
      <div style={{ textAlign: 'center' }}>
        <Loader2
          style={{
            width: '3rem',
            height: '3rem',
            color: themeColors.neon.purple,
            animation: 'spin 1s linear infinite',
          }}
        />
        <p
          style={{
            marginTop: '1rem',
            color: themeColors.textSecondary,
            fontSize: '0.875rem',
          }}
        >
          Carregando...
        </p>
      </div>
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

