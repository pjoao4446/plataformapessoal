import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

/**
 * ThemeToggle - Componente para alternar entre Dark e Light Mode
 */
export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 1rem',
        backgroundColor: 'transparent',
        border: 'none',
        borderRadius: '0.5rem',
        cursor: 'pointer',
        color: theme === 'dark' ? '#94A3B8' : '#4B5563',
        transition: 'all 0.2s',
        fontSize: '0.875rem',
        fontWeight: '500',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.color = theme === 'dark' ? '#E2E8F0' : '#1F2937';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = theme === 'dark' ? '#94A3B8' : '#4B5563';
      }}
      title={theme === 'dark' ? 'Alternar para Light Mode' : 'Alternar para Dark Mode'}
    >
      {theme === 'dark' ? (
        <>
          <Sun style={{ width: '1rem', height: '1rem' }} />
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <Moon style={{ width: '1rem', height: '1rem' }} />
          <span>Dark Mode</span>
        </>
      )}
    </button>
  );
}






