import { FC } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

/**
 * ProgressRing - Anel de progresso circular (estilo Apple Watch)
 * Com suporte a Dark/Light Mode
 */
export const ProgressRing: FC<ProgressRingProps> = ({
  progress,
  size = 80,
  strokeWidth = 6,
  color = '#A855F7',
  label,
}) => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
      </svg>
      {label && (
        <span style={{ fontSize: '0.75rem', color: themeColors.textSecondary, textAlign: 'center' }}>
          {label}
        </span>
      )}
    </div>
  );
};
