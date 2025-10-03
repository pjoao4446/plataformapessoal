// ARQUIVO: src/containers/LoginPage/index.tsx (VERSÃO FINAL COM MENSAGEM FLASH)

import { useState, useEffect } from 'react'; // 1. IMPORTE O 'useEffect'
import { useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import logoImage from '../../assets/images/LogoPretaSbg.png';
import { AnimatedPage } from '../../components/AnimatedPage';

import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { AuthLink } from '../../components/AuthLink';
import { useAuth } from '../../context/AuthContext';

import { 
  Wrapper, 
  LoginCard, 
  LeftColumn, 
  RightColumn,
  Logo, 
  Subtitle,
  Form,
  LinksWrapper,
  Spinner,
  SuccessMessage
} from './styles';

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // 2. CRIAMOS UM ESTADO LOCAL PARA CONTROLAR A MENSAGEM
  const [message, setMessage] = useState('');

  // 3. A MÁGICA ACONTECE AQUI, NO useEffect
  useEffect(() => {
    // Verificamos se há uma mensagem no estado da rota
    if (location.state?.message) {
      // Se houver, copiamos para o nosso estado local
      setMessage(location.state.message);
      // E imediatamente limpamos o estado do histórico do navegador
      window.history.replaceState({}, '');
    }
  }, [location.state]); // O hook só executa se o estado da rota mudar

  async function handleLogin(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      navigate('/inicio');
    } catch (e) {
      alert('Falha no login');
    } finally {
      setIsLoading(false);
    }
  }
  
  return (
    <AnimatedPage>
      <Wrapper>
        <LoginCard>
          <LeftColumn>
            <Logo src={logoImage} alt="Logo da Sentios Academy" />
            <Subtitle>Acesse Sua Plataforma</Subtitle>
            
            {/* 4. RENDERIZAMOS A MENSAGEM A PARTIR DO NOSSO ESTADO LOCAL */}
            {message && <SuccessMessage>{message}</SuccessMessage>}

            <Form onSubmit={handleLogin}>
              <Input 
                icon={<FiMail />}
                type="email" 
                placeholder="Email do Agente"
                required value={email} onChange={(e:any) => setEmail(e.target.value)}
              />
              <Input 
                icon={<FiLock />}
                type="password" 
                placeholder="Senha Secreta"
                required value={password} onChange={(e:any) => setPassword(e.target.value)}
              />
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner><FaSpinner /></Spinner> : 'ACESSAR ACADEMY'}
              </Button>
            </Form>

            <LinksWrapper>
              <span>Não tem cadastro? <AuthLink to="/register">Crie sua conta.</AuthLink></span>
              
            </LinksWrapper>
            <AuthLink to="/forgot-password">Esqueceu a senha?</AuthLink>
          </LeftColumn>
          <RightColumn />
        </LoginCard>
      </Wrapper>
    </AnimatedPage>
  );
}