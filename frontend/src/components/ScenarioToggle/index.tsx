import type { FC } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';

export type ScenarioType = 'real' | 'projected';

export interface ScenarioToggleProps {
  value: ScenarioType;
  onChange: (value: ScenarioType) => void;
}

/**
 * ScenarioToggle - Componente Segmented Control compacto estilo iOS
 * Design System: VertexGuard Premium Dark/Light
 */
export const ScenarioToggle: FC<ScenarioToggleProps> = ({ value, onChange }) => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  const buttonStyle = (isActive: boolean, isFirst: boolean, isLast: boolean) => {
    const baseStyle: React.CSSProperties = {
      padding: '0.375rem 0.75rem',
      border: `1px solid ${themeColors.border}`,
      backgroundColor: isActive 
        ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)')
        : 'transparent',
      color: isActive ? themeColors.text : themeColors.textSecondary,
      cursor: 'pointer',
      fontWeight: isActive ? '600' : '500',
      fontSize: '0.8125rem',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };

    // Bordas arredondadas apenas nas extremidades
    if (isFirst) {
      baseStyle.borderTopLeftRadius = '0.5rem';
      baseStyle.borderBottomLeftRadius = '0.5rem';
      baseStyle.borderRight = 'none';
    }
    if (isLast) {
      baseStyle.borderTopRightRadius = '0.5rem';
      baseStyle.borderBottomRightRadius = '0.5rem';
    }
    if (!isFirst && !isLast) {
      baseStyle.borderRight = 'none';
    }

    return baseStyle;
  };

  return (
    <div
      style={{
        display: 'flex',
        borderRadius: '0.5rem',
        border: `1px solid ${themeColors.border}`,
        backgroundColor: theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.03)' 
          : 'rgba(0, 0, 0, 0.02)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => onChange('real')}
        style={buttonStyle(value === 'real', true, false)}
        onMouseEnter={(e) => {
          if (value !== 'real') {
            e.currentTarget.style.backgroundColor = theme === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.03)';
          }
        }}
        onMouseLeave={(e) => {
          if (value !== 'real') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        Real
      </button>
      <button
        type="button"
        onClick={() => onChange('projected')}
        style={buttonStyle(value === 'projected', false, true)}
        onMouseEnter={(e) => {
          if (value !== 'projected') {
            e.currentTarget.style.backgroundColor = theme === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.03)';
          }
        }}
        onMouseLeave={(e) => {
          if (value !== 'projected') {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
      >
        Previsto
      </button>
    </div>
  );
};

