import { ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * BaseModal - Componente base de Modal para formulários do sistema
 * Estilo VertexGuard Premium com Glassmorphism e Dark Mode
 * Design System: VertexGuard Premium Dark/Light
 */
export function BaseModal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: BaseModalProps) {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  // Fechar modal com ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEscape);
      // Prevenir scroll do body quando modal está aberto
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      window.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Tamanhos do modal
  const sizeStyles: Record<string, { maxWidth: string }> = {
    sm: { maxWidth: '28rem' },
    md: { maxWidth: '32rem' },
    lg: { maxWidth: '42rem' },
    xl: { maxWidth: '56rem' },
  };

  // Animações
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9,
      y: 20,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.9,
      y: 20,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          {/* Overlay com blur */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
            onClick={onClose}
          />

          {/* Container do Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              position: 'relative',
              zIndex: 51,
              width: '100%',
              ...sizeStyles[size],
              backgroundColor: '#1A1D2D',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.75), 0 0 0 1px rgba(255, 255, 255, 0.05)',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.5rem',
                borderBottom: `1px solid ${themeColors.border}`,
                flexShrink: 0,
              }}
            >
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  color: themeColors.text,
                  margin: 0,
                }}
              >
                {title}
              </h2>
              <button
                onClick={onClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  borderRadius: '50%',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: themeColors.textSecondary,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.currentTarget.style.color = themeColors.text;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = themeColors.textSecondary;
                }}
                aria-label="Fechar modal"
              >
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>

            {/* Corpo com Scroll */}
            <div
              style={{
                padding: '1.5rem',
                overflowY: 'auto',
                overflowX: 'hidden',
                flex: 1,
                maxHeight: 'calc(90vh - 8rem)',
                minHeight: 0,
              }}
            >
              {children}
            </div>

            {/* Footer (Opcional) */}
            {footer && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '0.75rem',
                  padding: '1.5rem',
                  borderTop: `1px solid ${themeColors.border}`,
                  flexShrink: 0,
                }}
              >
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

