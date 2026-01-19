import { FC } from 'react';
import { useTheme } from '../../../context/ThemeContext';
import { getTheme } from '../../../styles/theme';
import type { CreditCard } from '../../../mocks/database';

interface CreditCardVisualProps {
  card: CreditCard;
  userName?: string;
}

/**
 * CreditCardVisual - Componente de Visualização de Cartão de Crédito
 * Estilo "Carteira Física Digital" com aspecto realista
 */
export const CreditCardVisual: FC<CreditCardVisualProps> = ({ 
  card, 
  userName = 'JOÃO SILVA' 
}) => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getCardGradient = (color: string) => {
    const gradients: Record<string, string> = {
      '#FF7A00': 'linear-gradient(135deg, #FF7A00 0%, #FF9500 50%, #FFB84D 100%)', // Inter - Laranja
      '#820AD1': 'linear-gradient(135deg, #820AD1 0%, #A855F7 50%, #C084FC 100%)', // Nubank - Roxo
      '#000000': 'linear-gradient(135deg, #1F2937 0%, #111827 50%, #000000 100%)', // XP - Preto
    };
    return gradients[color] || `linear-gradient(135deg, ${color} 0%, ${color}CC 50%, ${color}99 100%)`;
  };

  const getMaskedCardNumber = (cardId: string) => {
    const last4 = cardId.slice(-4).padStart(4, '0');
    return `**** **** **** ${last4}`;
  };

  const usagePercent = (card.used / card.limit) * 100;
  const availableCredit = card.limit - card.used;
  const gradient = getCardGradient(card.color || '#820AD1');
  const brand = (card as any).brand || 'mastercard';

  // Determinar cor da barra baseada no uso
  const getLimitBarColor = () => {
    if (usagePercent < 30) {
      return '#10B981'; // Verde - Saudável
    } else if (usagePercent < 70) {
      return '#F59E0B'; // Amarelo/Laranja - Atenção
    } else {
      return '#EF4444'; // Vermelho - Perigo
    }
  };

  const limitBarColor = getLimitBarColor();

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '0.75rem',
        background: gradient,
        color: 'white',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: theme === 'dark'
          ? '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        cursor: 'pointer',
        minHeight: '220px',
        aspectRatio: '1.58 / 1',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
        e.currentTarget.style.boxShadow = theme === 'dark'
          ? '0 30px 60px -10px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.2)'
          : '0 30px 60px -10px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = theme === 'dark'
          ? '0 20px 40px -10px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.1)'
          : '0 20px 40px -10px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Padrão de fundo decorativo */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          right: '-20%',
          width: '200%',
          height: '200%',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
          pointerEvents: 'none',
        }}
      />

      {/* Header do Cartão */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', position: 'relative', zIndex: 1 }}>
        {/* Chip */}
        <div
          style={{
            width: '32px',
            height: '26px',
            backgroundColor: '#FFD700',
            borderRadius: '0.375rem',
            position: 'relative',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.2)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '16px',
              height: '13px',
              backgroundColor: '#FFA500',
              borderRadius: '0.25rem',
            }}
          />
        </div>

        {/* Logo da Bandeira */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
          {brand === 'visa' ? (
            <div style={{ fontSize: '0.875rem', fontWeight: 'bold', letterSpacing: '-0.05em', textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
              VISA
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '0.15rem', alignItems: 'center' }}>
              <div style={{ width: '24px', height: '16px', borderRadius: '0.25rem', backgroundColor: '#EB001B', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
              <div style={{ width: '24px', height: '16px', borderRadius: '0.25rem', backgroundColor: '#F79E1B', marginLeft: '-12px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }} />
            </div>
          )}
        </div>
      </div>

      {/* Número do Cartão */}
      <div style={{ marginTop: '0.5rem', marginBottom: '0.375rem', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.875rem', letterSpacing: '0.15em', fontWeight: '600', margin: 0, textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
          {getMaskedCardNumber(card.id)}
        </p>
      </div>

      {/* Nome do Titular */}
      <div style={{ marginTop: '0.375rem', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: '0.5625rem', opacity: 0.8, margin: '0 0 0.125rem 0', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: '500' }}>
          Titular
        </p>
        <p style={{ fontSize: '0.75rem', fontWeight: '600', margin: 0, textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
          {userName}
        </p>
      </div>

      {/* Barra de Limite dentro do cartão */}
      <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.3)', position: 'relative', zIndex: 1, flexShrink: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.375rem' }}>
          <span style={{ fontSize: '0.5625rem', opacity: 0.9, fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Fatura Atual
          </span>
          <span style={{ fontSize: '0.875rem', fontWeight: 'bold', lineHeight: 1, textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)' }}>
            {formatCurrency(card.used)}
          </span>
        </div>
        
        {/* Barra de Progresso Fina com Cores Condicionais */}
        <div
          style={{
            width: '100%',
            height: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '9999px',
            overflow: 'hidden',
            marginBottom: '0.5rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              width: `${Math.min(usagePercent, 100)}%`,
              height: '100%',
              backgroundColor: limitBarColor,
              borderRadius: '9999px',
              transition: 'all 0.3s',
              boxShadow: `0 0 12px ${limitBarColor}80`,
            }}
          />
        </div>

        {/* Disponível e Limite */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.5625rem' }}>
          <div>
            <span style={{ opacity: 0.85, fontWeight: '500', display: 'block', marginBottom: '0.125rem' }}>
              Disponível
            </span>
            <span style={{ 
              fontSize: '0.75rem', 
              fontWeight: 'bold', 
              color: 'white', 
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              display: 'block',
            }}>
              {formatCurrency(availableCredit)}
            </span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ opacity: 0.85, fontWeight: '500', display: 'block', marginBottom: '0.125rem' }}>
              Limite
            </span>
            <span style={{ opacity: 0.7, fontWeight: '500', fontSize: '0.75rem' }}>
              {formatCurrency(card.limit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

