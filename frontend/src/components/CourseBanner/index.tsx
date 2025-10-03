import { FC } from 'react';
import { CircularProgressBar } from '../CircularProgressBar';
import { PageBanner } from '../PageBanner';
import {
  BannerLeft,
  BannerRight,
  BannerTitle,
  BannerSubtitle,
  CourseMeta,
  MetaTag,
  ProgressContainer,
  ProgressLabel
} from './styles';

interface CourseBannerProps {
  title: string;
  subtitle?: string;
  bannerImage?: string;
  progress: number;
  meta?: {
    segment?: string;
    level?: string;
    provider?: string;
    duration?: string;
  };
}

export const CourseBanner: FC<CourseBannerProps> = ({
  title,
  subtitle,
  bannerImage,
  progress,
  meta
}) => {
  return (
    <PageBanner customBackground={bannerImage}>
      <BannerLeft>
        <BannerTitle>
          {title.split(' ').map((word, index) => 
            index === title.split(' ').length - 1 ? (
              <span key={index}>{word}</span>
            ) : (
              `${word} `
            )
          )}
        </BannerTitle>
        {subtitle && <BannerSubtitle>{subtitle}</BannerSubtitle>}
        {meta && (
          <CourseMeta>
            {meta.segment && <MetaTag>{meta.segment}</MetaTag>}
            {meta.level && <MetaTag>{meta.level}</MetaTag>}
            {meta.provider && <MetaTag>{meta.provider}</MetaTag>}
            {meta.duration && <MetaTag>{meta.duration}</MetaTag>}
          </CourseMeta>
        )}
      </BannerLeft>
      
      <BannerRight>
        <ProgressContainer>
          <CircularProgressBar 
            percentage={progress} 
            size={180}
            strokeWidth={12}
            color="#00FFFF"
            backgroundColor="rgba(255, 255, 255, 0.1)"
            showPercentageText={true}
          />
          <ProgressLabel>CONCLUSÃO DO CURSO</ProgressLabel>
        </ProgressContainer>
      </BannerRight>
    </PageBanner>
  );
};
