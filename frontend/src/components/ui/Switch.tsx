import { InputHTMLAttributes, forwardRef } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { cn } from '../../utils/cn';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  className?: string;
}

/**
 * Switch Component - Componente de switch/toggle reutilizável
 * Suporte completo a Dark/Light Mode
 */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(
  ({ label, error, className, checked, onChange, disabled, ...props }, ref) => {
    const { theme } = useTheme();
    const themeColors = getTheme(theme).colors;

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled && onChange) {
        const syntheticEvent = {
          target: { checked: !checked } as HTMLInputElement,
          currentTarget: { checked: !checked } as HTMLInputElement,
        } as React.ChangeEvent<HTMLInputElement>;
        onChange(syntheticEvent);
      }
    };

    return (
      <div style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            color: themeColors.text,
            marginBottom: error ? '0.5rem' : 0,
          }}
        >
          <div
            onClick={handleClick}
            onMouseDown={(e) => e.preventDefault()}
            style={{
              position: 'relative',
              width: '2.75rem',
              height: '1.5rem',
              borderRadius: '9999px',
              backgroundColor: checked
                ? themeColors.neon.purple
                : theme === 'dark'
                ? 'rgba(255, 255, 255, 0.2)'
                : 'rgba(0, 0, 0, 0.2)',
              transition: 'all 0.2s',
              opacity: disabled ? 0.5 : 1,
              cursor: disabled ? 'not-allowed' : 'pointer',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '0.125rem',
                left: checked ? '1.375rem' : '0.125rem',
                width: '1.25rem',
                height: '1.25rem',
                borderRadius: '50%',
                backgroundColor: 'white',
                transition: 'all 0.2s',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
              }}
            />
          </div>
          {label && (
            <label
              htmlFor={props.id || 'switch-input'}
              onClick={handleClick}
              style={{
                cursor: disabled ? 'not-allowed' : 'pointer',
                userSelect: 'none',
              }}
            >
              <span>{label}</span>
              {props.required && (
                <span style={{ color: themeColors.status.error, marginLeft: '0.25rem' }}>
                  *
                </span>
              )}
            </label>
          )}
        </div>
        <input
          ref={ref}
          id={props.id || 'switch-input'}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
          style={{ display: 'none' }}
          className={cn(className)}
        />
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

Switch.displayName = 'Switch';

