import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { MainLayout } from '../components/layout';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { useAuth } from '../context/AuthContext';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';

// Auth Page
import { AuthPage } from '../pages/AuthPage';

// Main Dashboard
import { DashboardPage } from '../containers/DashboardPage';

// Goals Pages
import { GoalsFinancePage } from '../containers/GoalsFinancePage';
import { GoalsCareerPage } from '../containers/GoalsCareerPage';
import { GoalsBusinessPage } from '../containers/GoalsBusinessPage';
import { GoalsEducationPage } from '../containers/GoalsEducationPage';
import { GoalsReadingPage } from '../containers/GoalsReadingPage';
import { GoalsHealthPage } from '../containers/GoalsHealthPage';

// Operational Pages
import { FinancePage } from '../containers/FinancePage';
import { TasksPage } from '../containers/TasksPage';
import { ProfessionalPage } from '../containers/ProfessionalPage';

// Legacy Pages (mantidas para compatibilidade)
import { TelaInicio } from '../containers/TelaInicio';
import { GestaoFinanceiraPage } from '../containers/GestaoFinanceiraPage';
import { GestaoAtividadesPage } from '../containers/GestaoAtividadesPage';

// NotFound
import { NotFoundPage } from '../containers/NotFoundPage';

// Componente para redirecionar usuários logados que tentam acessar /login
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export function AppRoutes() {
  const location = useLocation();

  return (
    <Routes location={location} key={location.pathname}>
      {/* Authentication Route - SEM Layout, redireciona se já logado */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <AuthPage />
          </PublicRoute>
        }
      />
      
      {/* Redirecionar /register para /login */}
      <Route path="/register" element={<Navigate to="/login" replace />} />
      
      {/* Protected Routes - COM MainLayout */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Routes>
                {/* Main Dashboard */}
                <Route path="/" element={<DashboardPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                
                {/* Goals Routes */}
                <Route path="/goals/finance" element={<GoalsFinancePage />} />
                <Route path="/goals/career" element={<GoalsCareerPage />} />
                <Route path="/goals/business" element={<GoalsBusinessPage />} />
                <Route path="/goals/education" element={<GoalsEducationPage />} />
                <Route path="/goals/reading" element={<GoalsReadingPage />} />
                <Route path="/goals/health" element={<GoalsHealthPage />} />
                
                {/* Operational Routes */}
                <Route path="/finance" element={<FinancePage />} />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/professional" element={<ProfessionalPage />} />
                
                {/* Legacy Routes - Mantidas para compatibilidade */}
                <Route path="/inicio" element={<TelaInicio />} />
                <Route path="/gestao-pessoal/financeira" element={<GestaoFinanceiraPage />} />
                <Route path="/gestao-pessoal/atividades" element={<GestaoAtividadesPage />} />
                <Route path="/financeiro" element={<GestaoFinanceiraPage />} />
                <Route path="/atividades" element={<GestaoAtividadesPage />} />
                
                {/* 404 - Catch all */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </MainLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
