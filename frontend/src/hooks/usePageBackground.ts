import { useState, useEffect } from 'react';

export const usePageBackground = (pageId: string) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPageBackground = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/settings/background/${pageId}`);
        if (response.ok) {
          const data = await response.json();
          if (data.backgroundUrl) {
            setBackgroundImage(data.backgroundUrl);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar imagem de fundo da página:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pageId) {
      fetchPageBackground();
    }
  }, [pageId]);

  const updatePageBackground = (newImageUrl: string) => {
    setBackgroundImage(newImageUrl);
  };

  return {
    backgroundImage,
    loading,
    updatePageBackground
  };
};





