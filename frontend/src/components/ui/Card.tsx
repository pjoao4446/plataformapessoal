import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';

export interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'neon';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

/**
 * Card Component - Base do Design System Premium Dark/Light
 * Com suporte completo a Dark/Light Mode
 */
export function Card({ 
  children, 
  className, 
  variant = 'default',
  hover = true,
  padding = 'md'
}: CardProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  // Estilos base inline como fallback
  const baseStyles: React.CSSProperties = {
    backgroundColor: themeColors.surface,
    border: `1px solid ${themeColors.border}`,
    borderRadius: '1.5rem',
    transition: 'all 0.3s ease-in-out',
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    default: {},
    glass: {
      backgroundColor: theme === 'dark' 
        ? 'rgba(21, 23, 37, 0.8)' 
        : 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(4px)',
      boxShadow: theme === 'dark'
        ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
        : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
    neon: {
      position: 'relative',
      overflow: 'hidden',
    },
  };

  const paddingStyles: Record<string, React.CSSProperties> = {
    none: { padding: 0 },
    sm: { padding: '1rem' },
    md: { padding: '1.5rem' },
    lg: { padding: '2rem' },
  };

  const combinedStyles: React.CSSProperties = {
    ...baseStyles,
    ...variantStyles[variant],
    ...paddingStyles[padding],
  };

  // Classes Tailwind (serão aplicadas se Tailwind estiver funcionando)
  const baseClasses = 'transition-all duration-300';
  
  const variantClasses = {
    default: '',
    glass: 'backdrop-blur-sm',
    neon: 'relative overflow-hidden',
  };
  
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };
  
  const hoverClasses = hover 
    ? 'hover:shadow-lg' 
    : '';

  return (
    <div 
      style={combinedStyles}
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        hoverClasses,
        className
      )}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.borderColor = themeColors.borderStrong;
        e.currentTarget.style.boxShadow = theme === 'dark'
          ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)'
          : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.borderColor = themeColors.border;
        e.currentTarget.style.boxShadow = 'none';
      } : undefined}
    >
      {variant === 'neon' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: theme === 'dark' ? 0.1 : 0.05,
            background: `linear-gradient(135deg, ${themeColors.neon.purple}33, ${themeColors.neon.cyan}33)`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
