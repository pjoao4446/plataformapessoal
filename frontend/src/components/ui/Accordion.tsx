import { ReactNode, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { cn } from '../../utils/cn';

export interface AccordionProps {
  title: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  className?: string;
}

/**
 * Accordion Component - Componente de acordeão para expandir/colapsar conteúdo
 * Suporte completo a Dark/Light Mode
 */
export function Accordion({ 
  title, 
  children, 
  defaultOpen = false, 
  isOpen: controlledIsOpen,
  onToggle,
  className 
}: AccordionProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  
  const toggle = () => {
    if (onToggle) {
      onToggle();
    } else {
      setInternalIsOpen(!internalIsOpen);
    }
  };
  
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  return (
    <div
      style={{
        border: `1px solid ${themeColors.border}`,
        borderRadius: '1rem',
        backgroundColor: themeColors.surface,
        overflow: 'hidden',
        transition: 'all 0.3s ease-in-out',
      }}
      className={cn('transition-all duration-300', className)}
    >
      {/* Header - Sempre visível */}
      <button
        onClick={toggle}
        style={{
          width: '100%',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: themeColors.text,
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = theme === 'dark' 
            ? 'rgba(255, 255, 255, 0.03)' 
            : 'rgba(0, 0, 0, 0.02)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
        }}
      >
        <div style={{ flex: 1, textAlign: 'left' }}>{title}</div>
        <ChevronDown
          style={{
            width: '1.25rem',
            height: '1.25rem',
            transition: 'transform 0.3s ease-in-out',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            color: themeColors.textSecondary,
          }}
        />
      </button>

      {/* Content - Expansível */}
      <div
        style={{
          maxHeight: isOpen ? '1000px' : '0',
          overflow: 'hidden',
          transition: 'max-height 0.3s ease-in-out, padding 0.3s ease-in-out',
          padding: isOpen ? '0 1.5rem 1.5rem 1.5rem' : '0 1.5rem',
        }}
      >
        {isOpen && (
          <div style={{ paddingTop: '1rem' }}>{children}</div>
        )}
      </div>
    </div>
  );
}

