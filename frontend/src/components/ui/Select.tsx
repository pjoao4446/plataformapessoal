import { SelectHTMLAttributes, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { cn } from '../../utils/cn';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  className?: string;
}

/**
 * Select Component - Componente de select reutilizável
 * Suporte completo a Dark/Light Mode
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, className, ...props }, ref) => {
    const { theme } = useTheme();
    const themeColors = getTheme(theme).colors;

    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label
            style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: themeColors.text,
              marginBottom: '0.5rem',
            }}
          >
            {label}
            {props.required && (
              <span style={{ color: themeColors.status.error, marginLeft: '0.25rem' }}>
                *
              </span>
            )}
          </label>
        )}
        <select
          ref={ref}
          {...props}
          style={{
            width: '100%',
            padding: '0.75rem 1rem',
            backgroundColor: themeColors.surface,
            border: `1px solid ${error ? themeColors.status.error : themeColors.border}`,
            borderRadius: '0.75rem',
            color: themeColors.text,
            fontSize: '1rem',
            fontFamily: 'inherit',
            cursor: 'pointer',
            transition: 'all 0.2s',
            ...props.style,
          }}
          className={cn(
            'focus:outline-none focus:ring-2',
            error ? 'focus:ring-red-500' : 'focus:ring-purple-500',
            className
          )}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = error 
              ? themeColors.status.error 
              : themeColors.neon.purple;
            e.currentTarget.style.boxShadow = `0 0 0 3px ${error 
              ? `${themeColors.status.error}33` 
              : `${themeColors.neon.purple}33`}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = error 
              ? themeColors.status.error 
              : themeColors.border;
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {props.children}
        </select>
        {error && (
          <p
            style={{
              fontSize: '0.875rem',
              color: themeColors.status.error,
              marginTop: '0.5rem',
              margin: 0,
            }}
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';




