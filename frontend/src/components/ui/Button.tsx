import { ButtonHTMLAttributes, ReactNode } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { cn } from '../../utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: ReactNode;
  className?: string;
}

/**
 * Button Component - Componente de botão reutilizável
 * Suporte completo a Dark/Light Mode
 */
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  const sizeStyles: Record<string, React.CSSProperties> = {
    sm: { padding: '0.5rem 1rem', fontSize: '0.875rem' },
    md: { padding: '0.75rem 1.5rem', fontSize: '1rem' },
    lg: { padding: '1rem 2rem', fontSize: '1.125rem' },
  };

  const variantStyles: Record<string, React.CSSProperties> = {
    primary: {
      backgroundColor: themeColors.neon.purple,
      color: 'white',
      border: 'none',
    },
    secondary: {
      backgroundColor: themeColors.surface,
      color: themeColors.text,
      border: `1px solid ${themeColors.border}`,
    },
    outline: {
      backgroundColor: 'transparent',
      color: themeColors.text,
      border: `1px solid ${themeColors.border}`,
    },
    ghost: {
      backgroundColor: 'transparent',
      color: themeColors.text,
      border: 'none',
    },
    danger: {
      backgroundColor: themeColors.status.error,
      color: 'white',
      border: 'none',
    },
  };

  const baseStyles: React.CSSProperties = {
    ...sizeStyles[size],
    ...variantStyles[variant],
    borderRadius: '0.75rem',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    transition: 'all 0.2s',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
  };

  return (
    <button
      {...props}
      disabled={disabled}
      style={baseStyles}
      className={cn(
        'transition-all duration-200',
        disabled ? 'cursor-not-allowed opacity-50' : '',
        className
      )}
      onMouseEnter={!disabled ? (e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = theme === 'dark' ? '#9333EA' : '#7C3AED';
          e.currentTarget.style.transform = 'translateY(-1px)';
        } else if (variant === 'secondary' || variant === 'outline') {
          e.currentTarget.style.borderColor = themeColors.neon.purple;
          e.currentTarget.style.color = themeColors.neon.purple;
        }
      } : undefined}
      onMouseLeave={!disabled ? (e) => {
        if (variant === 'primary') {
          e.currentTarget.style.backgroundColor = themeColors.neon.purple;
          e.currentTarget.style.transform = 'translateY(0)';
        } else if (variant === 'secondary' || variant === 'outline') {
          e.currentTarget.style.borderColor = variantStyles[variant].border as string;
          e.currentTarget.style.color = variantStyles[variant].color as string;
        }
      } : undefined}
    >
      {children}
    </button>
  );
}




