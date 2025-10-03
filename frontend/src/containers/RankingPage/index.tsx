import { type FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { Header } from '../../components/Header';
import { Rodape } from '../../components/Rodape';
import { AnimatedPage } from '../../components/AnimatedPage';
import { MainContent } from '../../components/MainContent';
import { PageBannerWithEditor } from '../../components/PageBannerWithEditor';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import heroBg from '../../assets/images/backgroundtelainicio4.png';

// Importar ícones dos elos
import emblemDiamante from '../../assets/images/emblemadiamante.png';
import emblemMestre from '../../assets/images/emblemamestre.png';
import emblemPlatina from '../../assets/images/emblemaplatina.png';

const RankingWrapper = styled.main`
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: ${(p) => p.theme.colors.background};
`;

const RankingBanner = styled.section`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #24053be1 70%, #1b042c7a) 70%, url(${heroBg});
  background-position: center; 
  height: 440px;
  width: 100%;
  box-shadow: 0px 0px 5px rgba(124, 49, 147, 0.42);
  z-index: 5;
`;

const ContainerContentRow = styled.section`
  width: 80%;
  max-width: 1700px;
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ContainerContentLeft = styled.div`
  width: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ContainerContentRight = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  flex: 1;
`;

const WelcomeTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3rem);
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  
  span {
    color: ${props => props.theme.colors.primary};
  }
`;

const WelcomeSubtitle = styled.h2`
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 600;
  color: ${props => props.theme.colors.text};
  margin-top: 0.5rem;
`;

const PageDescription = styled.p`
  font-size: clamp(1rem, 2vw, 1.2rem);
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 1rem;
  text-align: left;
`;

const GamificationButton = styled(Link)`
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, ${(p) => p.theme.colors.primary} 100%);
  color: #000;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: bold;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  text-transform: uppercase;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${(p) => p.theme.colors.accentCyan}50;
  }
`;

const ContentSection = styled.section`
  width: 100%;
  padding: 3rem 0;
`;

const ContainerContent = styled.div`
  width: 80%;
  max-width: 1700px;
  margin: 0 auto;
`;

const TopPlayersSection = styled.div`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 2rem;
  text-align: left;
`;

const TopPlayersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const TopPlayerCard = styled.div`
  background: ${(p) => p.theme.colors.surfaceDark};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    border-color: ${(p) => p.theme.colors.accentCyan};
  }
  
  &.rank-1 {
    background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
    color: #000;
  }
`;

const TopLabel = styled.div`
  position: absolute;
  top: 0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: ${(p) => p.theme.colors.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  z-index: 5;
  white-space: nowrap;
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: center;
`;

const EloIcon = styled.img`
  width: 80px;
  height: 80px;
  margin: 0 auto 0.5rem;
  display: block;
`;

const PlayerAvatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, ${(p) => p.theme.colors.primary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #000;
  font-weight: bold;
  margin: 3rem auto 1rem;
  box-shadow: 0 0 20px ${(p) => p.theme.colors.accentCyan}50;
  position: relative;
  overflow: visible;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const CrownIcon = styled.div`
  position: absolute;
  top: -55px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 3.5rem;
  z-index: 10;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
`;

const PlayerName = styled.h3`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const PlayerElo = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const PlayerXP = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
`;

const RankingSection = styled.div`
  margin-bottom: 3rem;
`;

const RankingTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  text-align: left;
`;

const RankingList = styled.div`
  background: ${(p) => p.theme.colors.surfaceDark};
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
`;

const RankingItem = styled.div`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255,255,255,0.05);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  &.current-user {
    background: rgba(124, 49, 147, 0.2);
    border-left: 4px solid ${(p) => p.theme.colors.primary};
  }
`;

const RankPosition = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${(p) => p.theme.colors.surface};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 1.1rem;
  margin-right: 1rem;
  
  &.rank-1 { background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%); color: #000; }
  &.rank-2 { background: linear-gradient(135deg, #C0C0C0 0%, #A0A0A0 100%); color: #000; }
  &.rank-3 { background: linear-gradient(135deg, #CD7F32 0%, #B8860B 100%); color: #000; }
`;

const RankingAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, ${(p) => p.theme.colors.primary} 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  color: #000;
  font-weight: bold;
  margin-right: 1rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const RankingInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const RankingName = styled.div`
  font-weight: bold;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

const RankingDetails = styled.div`
  font-size: 0.9rem;
  opacity: 0.8;
  display: flex;
  gap: 1rem;
`;

const RankingActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ProfileButton = styled(Link)`
  background: ${(p) => p.theme.colors.surface};
  color: ${(p) => p.theme.colors.text};
  border: 1px solid rgba(255,255,255,0.1);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${(p) => p.theme.colors.accentCyan};
    color: #000;
    border-color: ${(p) => p.theme.colors.accentCyan};
  }
`;


interface UserWithRanking {
  id: number;
  name: string;
  email: string;
  avatar_path?: string;
  elo: string;
  xp: number;
  position: number;
  segment: string;
}

export const RankingPage: FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserWithRanking[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:4000/ranking/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getFirstAndLastName = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length === 1) return names[0];
    if (names.length === 2) return name;
    return `${names[0]} ${names[names.length - 1]}`;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getEloIcon = (elo: string) => {
    switch (elo) {
      case 'DIAMANTE': return emblemDiamante;
      case 'MESTRE': return emblemMestre;
      case 'PLATINA': return emblemPlatina;
      case 'OURO': return emblemDiamante; // Usando diamante para ouro por enquanto
      default: return emblemDiamante;
    }
  };

  // Organizar dados para exibição
  const topPlayers = users.slice(0, 4).map((user, index) => ({
    ...user,
    topLabel: index === 0 ? 'TOP 1 GERAL' : 
              index === 1 ? 'TOP 1 INFRAESTRUTURA' : 
              index === 2 ? 'TOP 1 CIÊNCIA DE DADOS' : 'TOP 1 DESENVOLVIMENTO',
    eloIcon: getEloIcon(user.elo)
  }));

  // Garantir que sempre tenhamos pelo menos 10 usuários em cada ranking
  const getRankingWithMinUsers = (segment: string, minUsers: number = 10) => {
    const segmentUsers = users.filter(u => u.segment === segment);
    
    if (segmentUsers.length >= minUsers) {
      return segmentUsers.slice(0, minUsers);
    }
    
    // Se não temos usuários suficientes, usar todos os usuários disponíveis
    return users.slice(0, minUsers);
  };

  const rankings = {
    geral: users.slice(0, 10),
    infraestrutura: getRankingWithMinUsers('INFRAESTRUTURA'),
    dados: getRankingWithMinUsers('CIÊNCIA DE DADOS'),
    desenvolvimento: getRankingWithMinUsers('DESENVOLVIMENTO')
  };

  if (loading) {
    return (
      <AnimatedPage>
        <RankingWrapper>
          <Header />
          <MainContent>
            <ContentSection>
              <ContainerContent>
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ fontSize: '1.5rem', color: '#666' }}>Carregando ranking...</div>
                </div>
              </ContainerContent>
            </ContentSection>
          </MainContent>
        </RankingWrapper>
      </AnimatedPage>
    );
  }

  return (
    <AnimatedPage>
      <RankingWrapper>
        <Header />
        <MainContent>
          <PageBannerWithEditor pageId="ranking">
            <ContainerContentRow>
              <ContainerContentLeft>
                {/* Espaço para futura foto do top 1 */}
              </ContainerContentLeft>
              <ContainerContentRight>
                <WelcomeTitle>RANKING DOS <span>AGENTES</span></WelcomeTitle>
                <WelcomeSubtitle>COMPETIÇÃO DE ELOS</WelcomeSubtitle>
                <PageDescription>Veja quem são os melhores agentes da plataforma e onde você se posiciona na competição</PageDescription>
                <GamificationButton to="/gamificacao">
                  Entenda a Gamificação de Elos
                </GamificationButton>
              </ContainerContentRight>
            </ContainerContentRow>
          </PageBannerWithEditor>

          <ContentSection>
            <ContainerContent>
              {/* Seção dos Top 1 */}
              <TopPlayersSection>
                <SectionTitle>TOP 1 DE CADA ELO</SectionTitle>
                <TopPlayersGrid>
                  {topPlayers.map((player, index) => (
                    <TopPlayerCard key={player.id} className={index === 0 ? 'rank-1' : ''}>
                      <TopLabel>{player.topLabel}</TopLabel>
                      <PlayerAvatar>
                        {player.avatar_path ? (
                          <img src={`http://localhost:4000${player.avatar_path}`} alt={player.name} />
                        ) : (
                          getInitials(player.name)
                        )}
                        {index === 0 && <CrownIcon>👑</CrownIcon>}
                      </PlayerAvatar>
                      <EloIcon src={player.eloIcon} alt={`Ícone ${player.elo}`} />
                      <PlayerName>{getFirstAndLastName(player.name)}</PlayerName>
                      <PlayerElo>{player.elo}</PlayerElo>
                      <PlayerXP>{player.xp.toLocaleString()} XP</PlayerXP>
                    </TopPlayerCard>
                  ))}
                </TopPlayersGrid>
              </TopPlayersSection>

              {/* Rankings por Segmento */}
              {Object.entries(rankings).map(([segment, players]) => (
                <RankingSection key={segment}>
                  <RankingTitle>
                    RANKING {segment.toUpperCase()}
                  </RankingTitle>
                  <RankingList>
                    {players.map((player, index) => (
                      <RankingItem key={player.id} className={player.id === user?.id ? 'current-user' : ''}>
                        <RankPosition className={`rank-${index + 1}`}>
                          {index + 1}
                        </RankPosition>
                        <RankingAvatar>
                          {player.avatar_path ? (
                            <img src={`http://localhost:4000${player.avatar_path}`} alt={player.name} />
                          ) : (
                            getInitials(player.name)
                          )}
                        </RankingAvatar>
                        <RankingInfo>
                          <RankingName>{getFirstAndLastName(player.name)}</RankingName>
                          <RankingDetails>
                            <span>{player.elo}</span>
                            <span>{player.xp.toLocaleString()} XP</span>
                          </RankingDetails>
                        </RankingInfo>
                        <RankingActions>
                          <ProfileButton to={`/perfil/${player.id}`}>
                            Ver Perfil
                          </ProfileButton>
                        </RankingActions>
                      </RankingItem>
                    ))}
                  </RankingList>
                </RankingSection>
              ))}
            </ContainerContent>
          </ContentSection>
        </MainContent>
        <Rodape />
      </RankingWrapper>
    </AnimatedPage>
  );
};
