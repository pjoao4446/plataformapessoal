import { useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard,
  Wallet,
  Briefcase,
  Building2,
  GraduationCap,
  BookOpen,
  Dumbbell,
  DollarSign,
  CheckSquare,
  Sparkles,
  ChevronRight,
  Target,
  UtensilsCrossed
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { ThemeToggle } from '../ui/ThemeToggle';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface MainMenuGroup {
  label: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  items: NavItem[];
}

const mainMenuGroups: MainMenuGroup[] = [
  {
    label: 'Gestão financeira',
    icon: Wallet,
    items: [
      {
        label: 'Gestão meta financeira',
        path: '/goals/finance',
        icon: Target,
      },
      {
        label: 'Gestão operacional financeira',
        path: '/finance',
        icon: DollarSign,
      },
    ],
  },
  {
    label: 'Gestão profissional',
    icon: Briefcase,
    items: [
      {
        label: 'Gestão meta profissional',
        path: '/goals/career',
        icon: Target,
      },
      {
        label: 'Gestão operacional profissional',
        path: '/professional',
        icon: Building2,
      },
    ],
  },
  {
    label: 'Gestão empresarial',
    icon: Building2,
    items: [
      {
        label: 'Gestão meta empresarial',
        path: '/goals/business',
        icon: Target,
      },
    ],
  },
  {
    label: 'Gestão de aprendizado',
    icon: GraduationCap,
    items: [
      {
        label: 'Gestão meta educação',
        path: '/goals/education',
        icon: GraduationCap,
      },
      {
        label: 'Gestão meta livros',
        path: '/goals/reading',
        icon: BookOpen,
      },
    ],
  },
  {
    label: 'Gestão do físico',
    icon: Dumbbell,
    items: [
      {
        label: 'Gestão meta treinos',
        path: '/goals/health',
        icon: Dumbbell,
      },
      {
        label: 'Gestão meta alimentação',
        path: '/goals/nutrition',
        icon: UtensilsCrossed,
      },
    ],
  },
  {
    label: 'Gestão de atividades',
    icon: CheckSquare,
    items: [
      {
        label: 'Gestão operacional atividades',
        path: '/tasks',
        icon: CheckSquare,
      },
    ],
  },
];

/**
 * Sidebar Component - Navegação Lateral com suporte a Dark/Light Mode
 * Menu lateral PRETO no dark mode, BRANCO no light mode
 */
export function Sidebar() {
  const location = useLocation();
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Verificar se algum item está ativo
  const isItemActive = (path: string) => location.pathname === path;
  const checkGroupActive = (group: MainMenuGroup) => {
    return group.items.some(item => isItemActive(item.path));
  };

  // Toggle grupo expandido
  const toggleGroup = (groupLabel: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupLabel)) {
        newSet.delete(groupLabel);
      } else {
        newSet.add(groupLabel);
      }
      return newSet;
    });
  };


  const sidebarStyles: React.CSSProperties = {
    width: '18rem',
    backgroundColor: themeColors.sidebar, // PRETO no dark, BRANCO no light
    borderRight: `1px solid ${themeColors.border}`,
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 50,
    margin: 0,
    padding: 0,
    overflow: 'visible', // Permite que submenus apareçam fora da sidebar
  };

  const getNavItemStyles = (isActive: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.625rem 0.75rem',
    borderRadius: '0.5rem',
    transition: 'all 0.2s',
    color: isActive ? themeColors.text : themeColors.textSecondary,
    backgroundColor: isActive 
      ? (theme === 'dark' ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.1)')
      : 'transparent',
    borderLeft: isActive ? `2px solid ${themeColors.neon.purple}` : 'none',
    textDecoration: 'none',
    cursor: 'pointer',
  });

  const getHoverStyles = (isActive: boolean) => ({
    onMouseEnter: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isActive) {
        e.currentTarget.style.backgroundColor = theme === 'dark' 
          ? 'rgba(255, 255, 255, 0.05)' 
          : 'rgba(0, 0, 0, 0.05)';
        e.currentTarget.style.color = themeColors.text;
      }
    },
    onMouseLeave: (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (!isActive) {
        e.currentTarget.style.backgroundColor = 'transparent';
        e.currentTarget.style.color = themeColors.textSecondary;
      }
    },
  });

  return (
    <aside style={sidebarStyles}>
      {/* Logo/Brand */}
      <div style={{ padding: '1.5rem', borderBottom: `1px solid ${themeColors.border}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '0.5rem',
              background: `linear-gradient(to bottom right, ${themeColors.neon.purple}, ${themeColors.neon.cyan})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Sparkles style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: themeColors.text, margin: 0 }}>
              LifeOS
            </h1>
            <p style={{ fontSize: '0.75rem', color: themeColors.textMuted, margin: 0 }}>
              Gestão de Vida
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, position: 'relative', overflow: 'visible' }}>
        <nav style={{ height: '100%', padding: '1rem', position: 'relative', overflow: 'visible' }}>
          <div style={{ height: '100%', overflowY: 'auto', overflowX: 'visible', position: 'relative' }}>
            {/* Menu Principal */}
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ padding: '0.5rem 0.75rem' }}>
                <h2 style={{
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  color: themeColors.textMuted,
                  textTransform: 'none',
                  letterSpacing: '0.05em',
                  margin: 0,
                }}>
                  Menu principal
                </h2>
              </div>
              <NavLink
                to="/"
                style={getNavItemStyles(isItemActive('/'))}
                {...getHoverStyles(isItemActive('/'))}
              >
                <LayoutDashboard style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
                <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Dashboard</span>
              </NavLink>
            </div>

            {/* Grupos Principais */}
            {mainMenuGroups.map((group) => {
              const GroupIcon = group.icon;
              const isExpanded = expandedGroups.has(group.label);
              const hasActiveItem = checkGroupActive(group);

              return (
                <div 
                  key={group.label}
                  ref={(el) => {
                    groupRefs.current[group.label] = el;
                  }}
                  style={{ marginBottom: '1rem', position: 'relative' }}
                >
                  {/* Header do Grupo Principal */}
                  <div
                    onClick={() => toggleGroup(group.label)}
                    style={{
                      padding: '0.625rem 0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isExpanded || hasActiveItem
                        ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
                        : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <GroupIcon style={{ width: '1.25rem', height: '1.25rem', color: hasActiveItem ? themeColors.neon.purple : themeColors.textMuted }} />
                      <h2 style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: hasActiveItem ? themeColors.text : themeColors.textMuted,
                        textTransform: 'none',
                        letterSpacing: '0.05em',
                        margin: 0,
                      }}>
                        {group.label}
                      </h2>
                    </div>
                    <ChevronRight 
                      style={{ 
                        width: '1rem', 
                        height: '1rem', 
                        color: themeColors.textMuted,
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
                      }} 
                    />
                  </div>

                  {/* Itens Expandidos */}
                  {isExpanded && (
                    <div style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                      {group.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = isItemActive(item.path);
                        return (
                          <NavLink
                            key={item.path}
                            to={item.path}
                            style={{
                              ...getNavItemStyles(isActive),
                              marginLeft: '0.5rem',
                              marginBottom: '0.25rem',
                            }}
                            {...getHoverStyles(isActive)}
                          >
                            <Icon style={{ width: '1rem', height: '1rem', flexShrink: 0 }} />
                            <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.label}</span>
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </nav>
      </div>

      {/* CSS para animação do submenu */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>

      {/* Footer com Theme Toggle */}
      <div style={{ padding: '1rem', borderTop: `1px solid ${themeColors.border}` }}>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ThemeToggle />
        </div>
      </div>
    </aside>
  );
}
