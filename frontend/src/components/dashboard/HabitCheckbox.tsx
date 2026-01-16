import { FC } from 'react';
import { Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';

interface HabitCheckboxProps {
  label: string;
  checked: boolean;
  onChange?: () => void;
}

/**
 * HabitCheckbox - Checkbox estilizado para hábitos
 * Com suporte a Dark/Light Mode
 */
export const HabitCheckbox: FC<HabitCheckboxProps> = ({
  label,
  checked,
  onChange,
}) => {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;

  return (
    <label 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          width: '1.25rem',
          height: '1.25rem',
          borderRadius: '0.25rem',
          border: `2px solid ${checked ? themeColors.neon.emerald : themeColors.textMuted}`,
          backgroundColor: checked ? themeColors.neon.emerald : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.2s',
        }}
        onClick={onChange}
        onMouseEnter={(e) => {
          if (!checked) {
            e.currentTarget.style.borderColor = themeColors.textSecondary;
          }
        }}
        onMouseLeave={(e) => {
          if (!checked) {
            e.currentTarget.style.borderColor = themeColors.textMuted;
          }
        }}
      >
        {checked && <Check style={{ width: '0.75rem', height: '0.75rem', color: 'white' }} />}
      </div>
      <span
        style={{
          fontSize: '0.875rem',
          transition: 'color 0.2s',
          color: checked ? themeColors.text : themeColors.textSecondary,
          textDecoration: checked ? 'line-through' : 'none',
        }}
      >
        {label}
      </span>
    </label>
  );
};
