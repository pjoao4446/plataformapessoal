import { FC, ReactNode } from 'react';
import { BackgroundEditor } from '../BackgroundEditor';
import { usePageBackground } from '../../hooks/usePageBackground';
import heroBg from '../../assets/images/backgroundtelainicio4.png';
import {
  BannerSection,
  BannerContainer
} from './styles';

interface PageBannerWithEditorProps {
  pageId: string;
  children: ReactNode;
  customBackground?: string;
}

export const PageBannerWithEditor: FC<PageBannerWithEditorProps> = ({ 
  pageId, 
  children, 
  customBackground 
}) => {
  const { backgroundImage, updatePageBackground } = usePageBackground(pageId);
  
  const finalBackground = customBackground || backgroundImage || heroBg;

  return (
    <BannerSection $backgroundImage={finalBackground}>
      <BannerContainer>
        {children}
      </BannerContainer>
      <BackgroundEditor pageId={pageId} onBackgroundChange={updatePageBackground} />
    </BannerSection>
  );
};
