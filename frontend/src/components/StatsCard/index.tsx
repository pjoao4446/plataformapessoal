import type { FC } from 'react';
import { 
  StatsCardWrapper,
  StatsCardIcon,
  StatsCardValue,
  StatsCardLabel
} from './styles';

type StatsCardProps = {
  icon?: string;
  iconAlt?: string;
  value: string | number;
  label: string;
  color?: string;
};

export const StatsCard: FC<StatsCardProps> = ({ 
  icon, 
  iconAlt, 
  value, 
  label, 
  color = '#00FFFF' 
}) => {
  return (
    <StatsCardWrapper>
      {icon && iconAlt && (
        <StatsCardIcon src={icon} alt={iconAlt} color={color} />
      )}
      <StatsCardValue color={color}>{value}</StatsCardValue>
      <StatsCardLabel>{label}</StatsCardLabel>
    </StatsCardWrapper>
  );
};
