import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

interface PageTitle {
  title: string;
  subtitle: string;
}

/**
 * Hook para obter título e subtítulo da página baseado na rota atual
 */
export function usePageTitle(): PageTitle {
  const location = useLocation();

  return useMemo(() => {
    const path = location.pathname;

    // Mapeamento de rotas para títulos
    const routeMap: Record<string, PageTitle> = {
      '/': { title: 'Dashboard', subtitle: 'Visão Geral' },
      '/dashboard': { title: 'Dashboard', subtitle: 'Visão Geral' },
      
      // Goals Routes
      '/goals/finance': { title: 'Metas Financeiras', subtitle: 'Liberdade Financeira' },
      '/goals/career': { title: 'Carreira', subtitle: 'PDI e Feedback Vault' },
      '/goals/business': { title: 'Projetos & Negócios', subtitle: 'Empreendedorismo' },
      '/goals/education': { title: 'Educação & Skills', subtitle: 'Árvore de Conhecimento' },
      '/goals/reading': { title: 'Leitura', subtitle: 'Livros e Conhecimento' },
      '/goals/health': { title: 'Treinos & Saúde', subtitle: 'Musculação e Corrida' },
      
      // Operational Routes
      '/finance': { title: 'Gestão Financeira', subtitle: 'Fluxo de Caixa' },
      '/tasks': { title: 'Hábitos Diários', subtitle: 'To-do list e Hábitos' },
      
      // Legacy Routes
      '/inicio': { title: 'Início', subtitle: 'Dashboard' },
      '/gestao-pessoal/financeira': { title: 'Gestão Financeira', subtitle: 'Fluxo de Caixa' },
      '/gestao-pessoal/atividades': { title: 'Gestão de Atividades', subtitle: 'To-do list e Hábitos' },
      '/financeiro': { title: 'Gestão Financeira', subtitle: 'Fluxo de Caixa' },
      '/atividades': { title: 'Gestão de Atividades', subtitle: 'To-do list e Hábitos' },
    };

    // Retorna o título mapeado ou um padrão
    return routeMap[path] || { title: 'Página', subtitle: 'LifeOS' };
  }, [location.pathname]);
}

