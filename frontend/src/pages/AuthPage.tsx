import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useTheme } from '../context/ThemeContext';
import { getTheme } from '../styles/theme';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { theme } = useTheme();
  const themeColors = getTheme(theme).colors;
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Mostrar loading enquanto verifica autenticação
  if (authLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: themeColors.background,
        }}
      >
        <Loader2
          style={{
            width: '3rem',
            height: '3rem',
            color: themeColors.neon.purple,
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Se já estiver logado, redirecionar (isso será tratado pelo PublicRoute, mas mantemos como fallback)
  if (user) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) {
          setError(signInError.message || 'Erro ao fazer login. Verifique suas credenciais.');
          setLoading(false);
          return;
        }

        // Login bem-sucedido - o AuthContext vai atualizar automaticamente
        navigate('/');
      } else {
        // Registro
        if (!name.trim()) {
          setError('Nome completo é obrigatório');
          setLoading(false);
          return;
        }

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name.trim(),
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message || 'Erro ao criar conta. Tente novamente.');
          setLoading(false);
          return;
        }

        // Registro bem-sucedido
        alert('Conta criada com sucesso! Verifique seu e-mail para confirmar (se necessário).');
        setIsLogin(true);
        setName('');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: `linear-gradient(135deg, ${themeColors.background} 0%, ${themeColors.surface} 100%)`,
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Efeito de fundo com gradiente animado */}
      <div
        style={{
          position: 'absolute',
          top: '-50%',
          left: '-50%',
          width: '200%',
          height: '200%',
          background: `radial-gradient(circle, ${themeColors.neon.purple}15 0%, transparent 70%)`,
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />

      {/* Card principal com glassmorphism */}
      <div
        style={{
          width: '100%',
          maxWidth: '420px',
          backgroundColor: theme === 'dark' 
            ? 'rgba(21, 23, 37, 0.8)' 
            : 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '1.5rem',
          border: `1px solid ${themeColors.border}`,
          padding: '2.5rem',
          boxShadow: `0 20px 60px ${theme === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)'}`,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '4rem',
              height: '4rem',
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${themeColors.neon.purple}, ${themeColors.neon.cyan})`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem',
              boxShadow: `0 0 30px ${themeColors.neon.purple}40`,
            }}
          >
            {isLogin ? (
              <LogIn style={{ width: '2rem', height: '2rem', color: 'white' }} />
            ) : (
              <UserPlus style={{ width: '2rem', height: '2rem', color: 'white' }} />
            )}
          </div>
          <h1
            style={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              color: themeColors.text,
              margin: 0,
              marginBottom: '0.5rem',
            }}
          >
            {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
          </h1>
          <p
            style={{
              fontSize: '0.875rem',
              color: themeColors.textSecondary,
              margin: 0,
            }}
          >
            {isLogin 
              ? 'Entre para continuar sua jornada' 
              : 'Comece sua jornada conosco'}
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {!isLogin && (
            <Input
              label="Nome Completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Seu nome completo"
              required
              disabled={loading}
            />
          )}

          <Input
            label="E-mail"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            required
            disabled={loading}
          />

          <Input
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={isLogin ? "Sua senha" : "Mínimo 6 caracteres"}
            required
            disabled={loading}
            minLength={isLogin ? undefined : 6}
          />

          {error && (
            <div
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: `${themeColors.status.error}20`,
                border: `1px solid ${themeColors.status.error}`,
                borderRadius: '0.75rem',
                color: themeColors.status.error,
                fontSize: '0.875rem',
              }}
            >
              {error}
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            style={{ width: '100%', marginTop: '0.5rem' }}
          >
            {loading ? (
              <>
                <Loader2 style={{ width: '1.25rem', height: '1.25rem', animation: 'spin 1s linear infinite' }} />
                {isLogin ? 'Entrando...' : 'Criando conta...'}
              </>
            ) : (
              isLogin ? 'Entrar' : 'Criar conta'
            )}
          </Button>
        </form>

        {/* Toggle Login/Registro */}
        <div
          style={{
            marginTop: '1.5rem',
            paddingTop: '1.5rem',
            borderTop: `1px solid ${themeColors.border}`,
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '0.875rem', color: themeColors.textSecondary, margin: 0 }}>
            {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setName('');
              }}
              disabled={loading}
              style={{
                background: 'none',
                border: 'none',
                color: themeColors.neon.purple,
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                textDecoration: 'underline',
                padding: 0,
                fontSize: '0.875rem',
              }}
            >
              {isLogin ? 'Cadastre-se' : 'Fazer login'}
            </button>
          </p>
        </div>
      </div>

      {/* Estilos CSS para animações */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}

