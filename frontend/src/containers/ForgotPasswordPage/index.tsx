import { useState } from 'react';
import styled from 'styled-components';
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

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState<string | null>(null);
  const [tokenDev, setTokenDev] = useState<string | null>(null);

  async function submit() {
    const res = await fetch('http://localhost:4000/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    setSent('Se o email existir, enviamos instruções para redefinição.');
    if (data.token) setTokenDev(data.token);
  }

  return (
    <Page>
      <Header />
      <Content>
        <h2>Recuperar Senha</h2>
        <p>Informe seu email para receber o link de redefinição.</p>
        <Input placeholder="Seu email" value={email} onChange={(e:any) => setEmail(e.target.value)} />
        <Button onClick={submit}>Enviar</Button>
        {sent && <p style={{ marginTop: 12 }}>{sent}</p>}
        {tokenDev && (
          <div style={{ marginTop: 12 }}>
            <small>Dev: token gerado (use na página de redefinição): {tokenDev}</small>
          </div>
        )}
      </Content>
    </Page>
  );
}





