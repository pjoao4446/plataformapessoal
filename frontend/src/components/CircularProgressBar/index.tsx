import type { FC } from 'react';
import { 
  CircularProgressWrapper,
  CircularProgressContainer,
  CircularProgressSVG,
  CircularProgressCircle,
  CircularProgressCircleFill,
  CircularProgressContent,
  CircularProgressIcon,
  CircularProgressText,
  CircularProgressPercentage
} from './styles';

type CircularProgressBarProps = {
  percentage: number;
  icon?: string;
  iconAlt?: string;
  size?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  showPercentageText?: boolean;
};

export const CircularProgressBar: FC<CircularProgressBarProps> = ({ 
  percentage, 
  icon, 
  iconAlt, 
  size = 120, 
  strokeWidth = 8,
  color = '#00FFFF',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  showPercentageText = false
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <CircularProgressWrapper>
      <CircularProgressContainer size={size}>
        <CircularProgressSVG width={size} height={size}>
          <CircularProgressCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            backgroundColor={backgroundColor}
          />
          <CircularProgressCircleFill
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            color={color}
          />
        </CircularProgressSVG>
        <CircularProgressContent>
          {icon && <CircularProgressIcon src={icon} alt={iconAlt || ''} />}
          {showPercentageText && (
            <CircularProgressPercentage>{percentage}%</CircularProgressPercentage>
          )}
          {!showPercentageText && !icon && (
            <CircularProgressText>{percentage}%</CircularProgressText>
          )}
        </CircularProgressContent>
      </CircularProgressContainer>
    </CircularProgressWrapper>
  );
};

