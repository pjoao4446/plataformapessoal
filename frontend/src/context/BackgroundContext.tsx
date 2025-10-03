import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface BackgroundContextType {
  backgroundImage: string | null;
  loading: boolean;
  updateBackgroundImage: (newImageUrl: string) => void;
}

const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

interface BackgroundProviderProps {
  children: ReactNode;
}

export const BackgroundProvider = ({ children }: BackgroundProviderProps) => {
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackgroundImage = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/settings/background');
        if (response.ok) {
          const data = await response.json();
          if (data.backgroundUrl) {
            setBackgroundImage(data.backgroundUrl);
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

  return (
    <BackgroundContext.Provider value={{
      backgroundImage,
      loading,
      updateBackgroundImage
    }}>
      {children}
    </BackgroundContext.Provider>
  );
};

export const useBackgroundContext = () => {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackgroundContext must be used within a BackgroundProvider');
  }
  return context;
};

