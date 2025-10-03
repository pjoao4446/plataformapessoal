// ARQUIVO: src/components/PillarCard/index.tsx (VERSÃO CORRIGIDA)

import type { FC } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. IMPORTE O useNavigate
import { Button } from '../Button';
import { BackgroundImage, CardWrapper, Content, Overlay, Title } from './styles';

type PillarCardProps = {
  title: string;
  backgroundImage: string;
  buttonText: string;
  to: string;
};

export const PillarCard: FC<PillarCardProps> = ({ title, backgroundImage, buttonText, to }) => {
  const navigate = useNavigate(); // 2. CRIE A FUNÇÃO DE NAVEGAÇÃO

  return (
    <CardWrapper>
      <BackgroundImage src={backgroundImage} alt={`Fundo para ${title}`} />
      <Overlay />
      <Content>
        <Title>{title}</Title>
        {/* 3. USE A FUNÇÃO navigate NO onClick DO BOTÃO, PASSANDO O 'to' */}
        <Button onClick={() => navigate(to)}>
          {buttonText}
        </Button>
      </Content>
    </CardWrapper>
  );
};