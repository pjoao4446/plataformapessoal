// ARQUIVO: src/containers/RegisterPage/index.tsx (VERSÃO COMPLETA E CORRIGIDA)

import { useState } from 'react'; // Importamos o useState
import { useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';
import { FaSpinner } from 'react-icons/fa';
import logoImage from '@/assets/images/LogoPretaSbg.png';
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
  Spinner // Importamos o Spinner
} from './styles';

export function RegisterPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false); // Estado de carregamento
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [role, setRole] = useState<'aluno' | 'professor' | 'admin'>('aluno');

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    setIsLoading(true);
    try {
      if (password !== confirm) throw new Error('Senhas não conferem');
      await register(name, email, password, role);
      navigate('/inicio');
    } catch (e:any) {
      alert(e.message || 'Falha no registro');
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
            <Subtitle>Registre-se na Plataforma</Subtitle>

            <Form onSubmit={handleRegister}>
              <Input 
                icon={<FiUser />}
                type="text"
                placeholder="Nome completo"
                required value={name} onChange={(e:any) => setName(e.target.value)}
              />
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
              <Input 
                icon={<FiLock />}
                type="password" 
                placeholder="Confirme a senha"
                required value={confirm} onChange={(e:any) => setConfirm(e.target.value)}
              />
              <div style={{ margin: '8px 0' }}>
                <label>Perfil: </label>
                <select value={role} onChange={(e:any) => setRole(e.target.value)}>
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? <Spinner><FaSpinner /></Spinner> : 'REGISTRAR'}
              </Button>
            </Form>
            <LinksWrapper>
              <span>Já tem uma conta? <AuthLink to="/login">Faça Login</AuthLink></span>
            </LinksWrapper>
          </LeftColumn>
          <RightColumn />
        </LoginCard>
      </Wrapper>
    </AnimatedPage>
  );
}