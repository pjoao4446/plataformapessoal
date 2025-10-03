import { useState, useEffect } from 'react';

export const useBackgroundImage = () => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/settings/background');
        if (response.ok) {
          const data = await response.json();
          if (data.backgroundUrl) {
            // Se a URL não começar com http, adicionar o prefixo do servidor
            const imageUrl = data.backgroundUrl.startsWith('http') 
              ? data.backgroundUrl 
              : `http://localhost:4000${data.backgroundUrl}`;
            setBackgroundImage(imageUrl);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar imagem de fundo:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBackgroundImage();
  }, []);

  const updateBackgroundImage = (newImageUrl: string) => {
    setBackgroundImage(newImageUrl);
  };

  return {
    backgroundImage,
    loading,
    updateBackgroundImage
  };
};
