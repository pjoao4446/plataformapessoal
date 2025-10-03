import { FC, ReactNode } from 'react';
import { useBackgroundContext } from '../../context/BackgroundContext';
import heroBg from '../../assets/images/backgroundtelainicio4.png';
import {
  BannerSection,
  BannerContainer
} from './styles';

interface PageBannerProps {
  children: ReactNode;
  customBackground?: string;
}

export const PageBanner: FC<PageBannerProps> = ({ children, customBackground }) => {
  const { backgroundImage } = useBackgroundContext();
  
  const finalBackground = customBackground || backgroundImage || heroBg;

  return (
    <BannerSection $backgroundImage={finalBackground}>
      <BannerContainer>
        {children}
      </BannerContainer>
    </BannerSection>
  );
};
