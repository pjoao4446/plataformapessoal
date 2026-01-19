import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { usePageTitle as useDefaultPageTitle } from '../hooks/usePageTitle';

interface PageTitleContextValue {
  title: string;
  setTitle: (title: string) => void;
}

const PageTitleContext = createContext<PageTitleContextValue | undefined>(undefined);

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const location = useLocation();
  const defaultTitle = useDefaultPageTitle();
  const [customTitle, setCustomTitle] = useState<string | null>(null);

  // Reset custom title when route changes
  useEffect(() => {
    setCustomTitle(null);
  }, [location.pathname]);

  const title = customTitle || defaultTitle.title;

  return (
    <PageTitleContext.Provider value={{ title, setTitle: setCustomTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export function usePageTitleContext() {
  const context = useContext(PageTitleContext);
  if (context === undefined) {
    throw new Error('usePageTitleContext must be used within a PageTitleProvider');
  }
  return context;
}

