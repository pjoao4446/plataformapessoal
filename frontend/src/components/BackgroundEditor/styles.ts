import styled from 'styled-components';

export const EditorButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  color: #ffffff;
  padding: 4px 0;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: underline;
  z-index: 10;
  
  &:hover {
    color: ${(p) => p.theme.colors.accentCyan};
    text-decoration: none;
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

export const UploadModal = styled.div`
  width: 100%;
  max-width: 600px;
`;

export const UploadArea = styled.div`
  position: relative;
  border: 2px dashed rgba(0, 255, 255, 0.3);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
  background: rgba(0, 255, 255, 0.05);
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    border-color: rgba(0, 255, 255, 0.5);
    background: rgba(0, 255, 255, 0.1);
  }
`;

export const UploadContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  pointer-events: none;
`;

export const UploadIcon = styled.div`
  color: ${(p) => p.theme.colors.accentCyan};
  opacity: 0.7;
`;

export const UploadText = styled.p`
  font-size: 1.1rem;
  color: ${(p) => p.theme.colors.text};
  margin: 0;
  
  strong {
    color: ${(p) => p.theme.colors.accentCyan};
  }
`;

export const UploadInput = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;

export const PreviewContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PreviewImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
`;

export const SaveButton = styled.button`
  background: linear-gradient(135deg, ${(p) => p.theme.colors.accentCyan} 0%, #00cccc 100%);
  border: none;
  color: #000;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const CancelButton = styled.button`
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: ${(p) => p.theme.colors.text};
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.05);
  }
`;
