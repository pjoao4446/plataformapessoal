import type { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { FileSearch } from 'lucide-react';

/**
 * TechnicalValidationTab - Aba de Oportunidades em Technical Validation
 * Será preenchida via integração com ClickUp no futuro
 * Design System: VertexGuard Premium Dark/Light
 */
export const TechnicalValidationTab: FC = () => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
          Oportunidades em Technical Validation
        </h2>
      </div>

      {/* Placeholder - Lista vazia */}
      <Card padding="lg" variant="glass">
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: themeColors.textSecondary }}>
          <FileSearch
            style={{
              width: '4rem',
              height: '4rem',
              color: themeColors.textMuted,
              margin: '0 auto 1.5rem',
              opacity: 0.5,
            }}
          />
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: themeColors.text, margin: 0, marginBottom: '0.5rem' }}>
            Integração com ClickUp em desenvolvimento
          </h3>
          <p style={{ fontSize: '0.875rem', color: themeColors.textMuted, margin: 0, maxWidth: '500px', marginLeft: 'auto', marginRight: 'auto' }}>
            Esta lista será preenchida automaticamente através da integração com ClickUp. 
            As oportunidades em Technical Validation serão sincronizadas em breve.
          </p>
        </div>
      </Card>
    </div>
  );
};


