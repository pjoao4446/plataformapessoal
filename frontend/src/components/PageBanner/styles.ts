import styled from 'styled-components';

export const BannerSection = styled.section<{ $backgroundImage: string }>`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background: linear-gradient(180deg, #24053be1 70%, #1b042c7a), url(${props => props.$backgroundImage});
  background-position: center;
  background-size: cover;
  height: 440px;
  width: 100%;
  box-shadow: 0px 0px 5px rgba(124, 49, 147, 0.42);
  z-index: 1;
  position: relative;
`;

export const BannerContainer = styled.div`
  width: 80%;
  max-width: 1700px;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
