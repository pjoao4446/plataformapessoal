import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from './routes';
import GlobalStyle from './styles/global';
import { ScrollToTop } from './components/ScrollToTop';
import { AuthProvider } from './context/AuthContext';
import { BackgroundProvider } from './context/BackgroundContext';

function App() {
  return (
    // Este é o ÚNICO BrowserRouter da aplicação
    <BrowserRouter>
      <AuthProvider>
        <BackgroundProvider>
          <ScrollToTop />
          <GlobalStyle />
          <AppRoutes />
        </BackgroundProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;