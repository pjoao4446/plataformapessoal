import { useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'react-router-dom';
import { Header } from '../../components/Header';

const Page = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${(p) => p.theme.colors.text};
`;

const Content = styled.div`
  width: 80%;
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 0 48px;
`;

const Input = styled.input`
  width: 100%;
  background: #111;
  border: 1px solid rgba(255,255,255,0.08);
  color: ${(p) => p.theme.colors.text};
  border-radius: 6px;
  padding: 10px 12px;
`;

const Button = styled.button`
  background: ${(p) => p.theme.colors.accentCyan};
  border: none;
  color: #000;
  font-weight: bold;
  border-radius: 6px;
  padding: 10px 14px;
  cursor: pointer;
  margin-top: 12px;
`;

export function ResetPasswordPage() {
  const [params] = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [done, setDone] = useState<string | null>(null);
  const token = params.get('token') || '';

  async function submit() {
    if (password !== confirm) {
      alert('Senhas não conferem');
      return;
    }
    const res = await fetch('http://localhost:4000/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    if (res.ok) {
      setDone('Senha redefinida com sucesso! Agora faça login.');
    } else {
      const data = await res.json();
      alert(data.error || 'Falha ao redefinir senha');
    }
  }

  return (
    <Page>
      <Header />
      <Content>
        <h2>Redefinir Senha</h2>
        <Input type="password" placeholder="Nova senha" value={password} onChange={(e:any) => setPassword(e.target.value)} />
        <Input type="password" placeholder="Confirmar senha" value={confirm} onChange={(e:any) => setConfirm(e.target.value)} style={{ marginTop: 8 }} />
        <Button onClick={submit}>Redefinir</Button>
        {done && <p style={{ marginTop: 12 }}>{done}</p>}
      </Content>
    </Page>
  );
}





