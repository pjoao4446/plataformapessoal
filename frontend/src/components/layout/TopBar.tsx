import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePageTitle } from '../../hooks/usePageTitle';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { getTheme } from '../../styles/theme';
import { Bell, User, LogOut } from 'lucide-react';

/**
 * TopBar - Barra Superior Fixa do Layout
 * Exibe título e subtítulo da página atual dinamicamente
 * Design System: VertexGuard Premium Dark/Light
 */
export function TopBar() {
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const { title, subtitle } = usePageTitle();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        left: 0,
        right: 0,
        height: '4rem', // h-16 = 4rem
        backgroundColor: theme === 'dark'
          ? 'rgba(26, 29, 45, 0.8)'
          : 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${theme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.1)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        zIndex: 40,
        boxShadow: theme === 'dark'
          ? '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px -1px rgba(0, 0, 0, 0.2)'
          : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
      }}
    >
      {/* Título e Subtítulo */}
      <div>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: themeColors.text,
            margin: 0,
            marginBottom: '0.25rem',
            lineHeight: 1.2,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: '0.875rem',
            color: themeColors.textSecondary,
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Área Direita - Placeholder para User Profile e Notificações */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Notificações */}
        <button
          style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            backgroundColor: 'transparent',
            border: `1px solid ${themeColors.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: themeColors.textSecondary,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = theme === 'dark'
              ? 'rgba(255, 255, 255, 0.05)'
              : 'rgba(0, 0, 0, 0.05)';
            e.currentTarget.style.color = themeColors.text;
            e.currentTarget.style.borderColor = themeColors.borderStrong;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = themeColors.textSecondary;
            e.currentTarget.style.borderColor = themeColors.border;
          }}
        >
          <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
        </button>

        {/* User Profile Menu */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = theme === 'dark'
                ? 'rgba(255, 255, 255, 0.05)'
                : 'rgba(0, 0, 0, 0.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: `${themeColors.neon.purple}33`,
                border: `2px solid ${themeColors.neon.purple}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {user?.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt={user.name || user.email}
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <User style={{ width: '1.25rem', height: '1.25rem', color: themeColors.neon.purple }} />
              )}
            </div>
            {user && (
              <div style={{ textAlign: 'left', display: 'none' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, margin: 0 }}>
                  {user.name || user.email.split('@')[0]}
                </p>
                <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: 0 }}>
                  {user.email}
                </p>
              </div>
            )}
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <>
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  zIndex: 49,
                }}
                onClick={() => setShowMenu(false)}
              />
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 0.5rem)',
                  right: 0,
                  minWidth: '12rem',
                  backgroundColor: themeColors.surface,
                  border: `1px solid ${themeColors.border}`,
                  borderRadius: '0.75rem',
                  boxShadow: `0 10px 30px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'}`,
                  zIndex: 50,
                  padding: '0.5rem',
                }}
              >
                {user && (
                  <div style={{ padding: '0.75rem', borderBottom: `1px solid ${themeColors.border}` }}>
                    <p style={{ fontSize: '0.875rem', fontWeight: '500', color: themeColors.text, margin: 0 }}>
                      {user.name || 'Usuário'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: themeColors.textSecondary, margin: '0.25rem 0 0 0' }}>
                      {user.email}
                    </p>
                  </div>
                )}
                <button
                  onClick={handleLogout}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: themeColors.status.error,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    marginTop: '0.5rem',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = theme === 'dark'
                      ? 'rgba(239, 68, 68, 0.1)'
                      : 'rgba(239, 68, 68, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <LogOut style={{ width: '1rem', height: '1rem' }} />
                  Sair
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

