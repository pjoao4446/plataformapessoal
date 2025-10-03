// ARQUIVO 6: src/containers/DashboardPage/index.tsx (NOVO ARQUIVO)

import type { FC } from 'react';

// Importando componentes
import { Header } from '../../components/Header';
import { Rodape } from '../../components/Rodape';
import { PillarCard } from '../../components/PillarCard';
import { AnimatedPage } from '../../components/AnimatedPage'; 
import { MainContent } from '../../components/MainContent';
import { PageBannerWithEditor } from '../../components/PageBannerWithEditor'; 

// Importando estilos da página
import { 
  DashboardWrapper, 
  EmblemImage,
  PillarsGrid,
  PillarsSection,
  SectionTitle,
  WelcomeSubtitle,
  WelcomeTitle,
  ContainerContentRow,
  ContainerContentLeft,
  ContainerContentRight,
  BannerPageInicio,
  ContainerContentColumn,
  EmblemWrapper,     // Adicionado
  EmblemBackground, // Adicionado
  ContainerContentColumnTop,
  ContainerContentColumnBottom,
  TextContainer,  // Adicionado
  EloTitle,       // Adicionado
  EloSubtitle,    // Adicionado
  InfoLink
} from './styles';

// Importando imagens (substitua pelos seus caminhos corretos)
import infraBg from '../../assets/images/cardinfra.png';
import devBg from '../../assets/images/carddev.png';
import dataBg from '../../assets/images/carddados.png';
import emblem1 from '../../assets/images/emblemadiamante.png';
import emblem2 from '../../assets/images/emblemamestre.png';
import emblem3 from '../../assets/images/emblemaplatina.png';

export const TelaInicio: FC = () => {
  const userName = "JOÃO"; // Futuramente virá do estado de autenticação
  const eloInfraestrutura = "DIAMANTE";
  const eloDesenvolvimento = "MESTRE";
  const eloDados = "PLATINA";

  return (
    <AnimatedPage>
    <DashboardWrapper>
      <Header />
      <MainContent>
      <PageBannerWithEditor pageId="home">
        <ContainerContentLeft>
          <WelcomeTitle>BEM-VINDO, AGENTE <span>{userName}</span>.</WelcomeTitle>
          <WelcomeSubtitle>SUA JORNADA PARA O FUTURO DIGITAL</WelcomeSubtitle>
        </ContainerContentLeft>
        <ContainerContentRight>
            <EmblemWrapper scaleFactor={0.7}> {/* 70% do tamanho base */}
              <EmblemBackground>
                <TextContainer>
                  <EloTitle>Infraestrutura</EloTitle>
                  <EloSubtitle>{eloInfraestrutura}</EloSubtitle> {/* Usando a primeira variável */}
                  <InfoLink>Entenda sobre o Elo</InfoLink>
                </TextContainer>
              </EmblemBackground>
              <EmblemImage src={emblem1} alt="Emblema de Infraestrutura" />
            </EmblemWrapper>

            <EmblemWrapper scaleFactor={0.65}> {/* 60% do tamanho base */}
              <EmblemBackground>
                <TextContainer>
                  <EloTitle>Desenvolvimento</EloTitle>
                  <EloSubtitle>{eloDesenvolvimento}</EloSubtitle> {/* Usando a segunda variável */}
                  <InfoLink>Entenda sobre o Elo</InfoLink>
                </TextContainer>
              </EmblemBackground>
              <EmblemImage src={emblem2} alt="Emblema de Desenvolvimento" />
            </EmblemWrapper>
            
            <EmblemWrapper scaleFactor={0.60}> {/* 50% do tamanho base */}
              <EmblemBackground>
                <TextContainer>
                  <EloTitle>Ciência de Dados</EloTitle>
                  <EloSubtitle>{eloDados}</EloSubtitle> {/* Usando a terceira variável */}
                  <InfoLink>Entenda sobre o Elo</InfoLink>
                </TextContainer>
              </EmblemBackground>
              <EmblemImage src={emblem3} alt="Emblema de Ciência de Dados" />
            </EmblemWrapper>
        </ContainerContentRight>
      </PageBannerWithEditor>
      <PillarsSection>
        <ContainerContentColumn>
          <ContainerContentColumnTop>
            <SectionTitle>COMECE SUA JORNADA!</SectionTitle>
          </ContainerContentColumnTop>
          <ContainerContentColumnBottom>
          <PillarsGrid>
            <PillarCard 
              title="INFRAESTRUTURA" 
              backgroundImage={infraBg}
              buttonText="EXPLORAR CURSOS"
              to="/segmento/infraestrutura"
            />
            <PillarCard 
              title="DESENVOLVIMENTO" 
              backgroundImage={devBg}
              buttonText="VER TRILHAS"
              to="/segmento/desenvolvimento"
            />
            <PillarCard 
              title="CIÊNCIA DE DADOS" 
              backgroundImage={dataBg}
              buttonText="VER TRILHAS"
              to="/segmento/dados"
            />
          </PillarsGrid>
          </ContainerContentColumnBottom>
        </ContainerContentColumn>
      </PillarsSection>
      </MainContent>
      <Rodape />
    </DashboardWrapper>
    </AnimatedPage>
  );
};