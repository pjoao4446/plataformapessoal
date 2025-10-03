import { Routes, Route, useLocation } from 'react-router-dom';

import { LoginPage } from '../containers/LoginPage';
import { RegisterPage } from '../containers/RegisterPage';
import { TelaInicio } from '../containers/TelaInicio';
import { SegmentosPage } from '../containers/SegmentosPage';
import { CourseControlPage } from '../containers/CourseControlPage';
import { CourseIntroPage } from '../containers/CourseIntroPage';
import { CourseContentPage } from '../containers/CourseContentPage';
import { CourseSimuladosPage } from '../containers/CourseSimuladosPage';
import { CoursePage } from '../containers/CoursePage';
import { ProfilePage } from '../containers/ProfilePage';
import { SettingsPage } from '../containers/SettingsPage';
import { RankingPage } from '../containers/RankingPage';
import { ForgotPasswordPage } from '../containers/ForgotPasswordPage';
import { ResetPasswordPage } from '../containers/ResetPasswordPage';

export function AppRoutes() {
  const location = useLocation();

  return (
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/inicio" element={<TelaInicio />} />
        <Route path="/segmento/:segmentoId" element={<SegmentosPage />} />
        <Route path="/cursos" element={<CourseControlPage />} />
        <Route path="/curso/:id" element={<CoursePage />} />
        <Route path="/curso/:id/intro" element={<CourseIntroPage />} />
        <Route path="/curso/:id/conteudo" element={<CourseContentPage />} />
        <Route path="/curso/:id/simulados" element={<CourseSimuladosPage />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/ranking" element={<RankingPage />} />
      </Routes>
  );
}