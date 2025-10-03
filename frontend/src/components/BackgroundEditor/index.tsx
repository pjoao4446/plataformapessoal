import { FC, useState } from 'react';
import { FiEdit3, FiUpload, FiX } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { Modal } from '../Modal';
import {
  EditorButton,
  UploadModal,
  UploadArea,
  UploadContent,
  UploadIcon,
  UploadText,
  UploadInput,
  PreviewContainer,
  PreviewImage,
  ButtonGroup,
  SaveButton,
  CancelButton
} from './styles';

interface BackgroundEditorProps {
  pageId: string;
  onBackgroundChange?: (newImageUrl: string) => void;
}

export const BackgroundEditor: FC<BackgroundEditorProps> = ({ pageId, onBackgroundChange }) => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Só mostra o editor se o usuário for admin
  if (!user || user.role !== 'admin') {
    return null;
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSave = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('background', selectedFile);

      formData.append('pageId', pageId);
      
      const response = await fetch('http://localhost:4000/api/settings/background', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        if (onBackgroundChange) {
          onBackgroundChange(data.backgroundUrl);
        }
        // Não recarregar a página, apenas fechar o modal
        handleCancel();
      } else {
        console.error('Erro ao salvar imagem de fundo');
      }
    } catch (error) {
      console.error('Erro ao fazer upload:', error);
    } finally {
      setIsUploading(false);
      handleCancel();
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <>
      <EditorButton
        onClick={() => setIsModalOpen(true)}
        title="Editar imagem de fundo desta página"
      >
        <FiEdit3 size={14} />
        Alterar imagem de fundo
      </EditorButton>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title="🎨 Editar Imagem de Fundo"
      >
        <UploadModal>
          {!previewUrl ? (
            <UploadArea>
              <UploadContent>
                <UploadIcon>
                  <FiUpload size={48} />
                </UploadIcon>
                <UploadText>
                  <strong>Clique para selecionar</strong> ou arraste uma imagem aqui
                </UploadText>
                <p style={{ fontSize: '0.9rem', color: '#888', marginTop: '8px' }}>
                  Formatos aceitos: JPG, PNG, WebP (máx. 5MB)
                </p>
              </UploadContent>
              <UploadInput
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
              />
            </UploadArea>
          ) : (
            <PreviewContainer>
              <PreviewImage src={previewUrl} alt="Preview da nova imagem de fundo" />
              <ButtonGroup>
                <CancelButton onClick={handleCancel}>
                  <FiX size={16} />
                  Cancelar
                </CancelButton>
                <SaveButton onClick={handleSave} disabled={isUploading}>
                  <FiUpload size={16} />
                  {isUploading ? 'Salvando...' : 'Salvar Imagem'}
                </SaveButton>
              </ButtonGroup>
            </PreviewContainer>
          )}
        </UploadModal>
      </Modal>
    </>
  );
};
