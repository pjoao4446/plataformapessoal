import type { FC } from 'react';
import logoImage from '../../assets/images/logoajustadamenu.png';
// Renomeei os imports para refletir a mudança para "Footer"
import { FooterWrapper, ContainerContent, ContainerContentLeft, ContainerContentRight, Logo, Nav, NavLink } from './styles';

export const Rodape: FC = () => {
  return (
    // Usando os componentes com nomes corretos
    <FooterWrapper>
      <ContainerContent>
        <ContainerContentLeft>
          <Logo src={logoImage} alt="Logo da Sentios Academy" />
        </ContainerContentLeft>
        <ContainerContentRight>
          <Nav>
            <NavLink to="/termos-de-servico">Termos de Serviço</NavLink>
            <NavLink to="/politica-de-privacidade">Política de Privacidade</NavLink>
            <NavLink to="/contato">Contato</NavLink>
          </Nav>
        </ContainerContentRight>      
      </ContainerContent>
    </FooterWrapper>
  );
};