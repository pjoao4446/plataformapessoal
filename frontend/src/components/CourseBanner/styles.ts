import styled from 'styled-components';

export const BannerLeft = styled.div`
  flex: 1;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-right: 2rem;
`;

export const BannerRight = styled.div`
  width: auto;
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-width: 300px;
`;

export const BannerTitle = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: #fff;
  margin-bottom: 16px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  line-height: 1.2;
  
  span {
    color: ${(p) => p.theme.colors.accentCyan};
  }
`;

export const BannerSubtitle = styled.h2`
  font-size: 1.5rem;
  color: #ffffff;
  margin-bottom: 16px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
  font-weight: 300;
  line-height: 1.3;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
  max-width: 100%;
`;

export const CourseMeta = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
`;

export const MetaTag = styled.span`
  background: rgba(0, 255, 255, 0.2);
  border: 1px solid rgba(0, 255, 255, 0.4);
  color: ${(p) => p.theme.colors.accentCyan};
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(10px);
`;

export const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
`;

export const ProgressLabel = styled.span`
  color: ${(p) => p.theme.colors.accentCyan};
  font-size: 1rem;
  font-weight: bold;
  text-transform: uppercase;
  text-align: center;
  text-shadow: 0 0 8px ${(p) => p.theme.colors.accentCyan};
`;
