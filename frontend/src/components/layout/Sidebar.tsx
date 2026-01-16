import { useState, useRef, useEffect } from 'react';
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
  ChevronRight
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { getTheme } from '../../styles/theme';
import { ThemeToggle } from '../ui/ThemeToggle';

interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
}

interface NavGroup {
  label: string;
  items: NavItem[];
  hasSubmenu?: boolean; // Indica se o grupo deve ter submenu ao hover
}

const navGroups: NavGroup[] = [
  {
    label: 'Menu Principal',
    items: [
      {
        label: 'Dashboard',
        path: '/',
        icon: LayoutDashboard,
      },
    ],
    hasSubmenu: false,
  },
  {
    label: 'Gestão de Metas',
    items: [
      {
        label: 'Financeira',
        path: '/goals/finance',
        icon: Wallet,
      },
      {
        label: 'Profissional',
        path: '/goals/career',
        icon: Briefcase,
      },
      {
        label: 'Empresarial',
        path: '/goals/business',
        icon: Building2,
      },
      {
        label: 'Educacional',
        path: '/goals/education',
        icon: GraduationCap,
      },
      {
        label: 'Leitura',
        path: '/goals/reading',
        icon: BookOpen,
      },
      {
        label: 'Treinos & Saúde',
        path: '/goals/health',
        icon: Dumbbell,
      },
    ],
    hasSubmenu: true,
  },
  {
    label: 'Operacional',
    items: [
      {
        label: 'Gestão Financeira',
        path: '/finance',
        icon: DollarSign,
      },
      {
        label: 'Gestão de Atividades',
        path: '/tasks',
        icon: CheckSquare,
      },
    ],
    hasSubmenu: true,
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
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);
  const [submenuPosition, setSubmenuPosition] = useState<{ top: number; left: number } | null>(null);
  const groupRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Calcular posição do submenu quando hoveredGroup mudar
  useEffect(() => {
    const updatePosition = () => {
      if (hoveredGroup && groupRefs.current[hoveredGroup]) {
        const element = groupRefs.current[hoveredGroup];
        if (element) {
          const rect = element.getBoundingClientRect();
          setSubmenuPosition({
            top: rect.top,
            left: rect.left + rect.width + 8, // 0.5rem = 8px
          });
        }
      } else {
        setSubmenuPosition(null);
      }
    };

    updatePosition();
    
    // Atualizar posição quando a página rolar ou redimensionar
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [hoveredGroup]);

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
        {navGroups.map((group) => {
          const hasSubmenu = group.hasSubmenu ?? false;
          const isHovered = hoveredGroup === group.label;
          const hasActiveItem = group.items.some(item => location.pathname === item.path);

          return (
            <div 
              key={group.label} 
              ref={(el) => {
                if (hasSubmenu) {
                  groupRefs.current[group.label] = el;
                }
              }}
              style={{ marginBottom: '1.5rem', position: 'relative' }}
              onMouseEnter={() => hasSubmenu && setHoveredGroup(group.label)}
              onMouseLeave={() => hasSubmenu && setHoveredGroup(null)}
            >
              {hasSubmenu ? (
                // Grupo com submenu - mostra apenas o título
                <>
                  <div 
                    style={{ 
                      padding: '0.625rem 0.75rem',
                      borderRadius: '0.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: isHovered || hasActiveItem
                        ? (theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)')
                        : 'transparent',
                      transition: 'all 0.2s',
                    }}
                  >
                    <h2 style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: hasActiveItem ? themeColors.text : themeColors.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      margin: 0,
                    }}>
                      {group.label}
                    </h2>
                    <ChevronRight 
                      style={{ 
                        width: '1rem', 
                        height: '1rem', 
                        color: themeColors.textMuted,
                        transition: 'transform 0.2s',
                        transform: isHovered ? 'rotate(90deg)' : 'rotate(0deg)',
                      }} 
                    />
                  </div>

                </>
              ) : (
                // Grupo sem submenu - mostra título e itens normalmente
                <>
                  {/* Group Header */}
                  <div style={{ padding: '0.5rem 0.75rem' }}>
                    <h2 style={{
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      color: themeColors.textMuted,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      margin: 0,
                    }}>
                      {group.label}
                    </h2>
                  </div>

                  {/* Group Items */}
                  <div>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = location.pathname === item.path;
                      const hoverHandlers = getHoverStyles(isActive);
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          style={getNavItemStyles(isActive)}
                          {...hoverHandlers}
                        >
                          <Icon style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
          </div>
          
          {/* Submenu renderizado fora do contexto de overflow */}
          {hoveredGroup && submenuPosition && (() => {
            const group = navGroups.find(g => g.label === hoveredGroup);
            if (!group || !group.hasSubmenu) return null;
            
            return (
              <div
                style={{
                  position: 'fixed',
                  top: `${submenuPosition.top}px`,
                  left: `${submenuPosition.left}px`,
                  minWidth: '12rem',
                  backgroundColor: themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '0.75rem',
                  padding: '0.5rem',
                  boxShadow: theme === 'dark'
                    ? '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)'
                    : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                  zIndex: 1000,
                  animation: 'fadeIn 0.2s ease',
                  pointerEvents: 'auto',
                }}
                onMouseEnter={() => setHoveredGroup(hoveredGroup)}
                onMouseLeave={() => setHoveredGroup(null)}
              >
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      style={{
                        ...getNavItemStyles(isActive),
                        marginBottom: '0.25rem',
                      }}
                      {...getHoverStyles(isActive)}
                    >
                      <Icon style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            );
          })()}
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
