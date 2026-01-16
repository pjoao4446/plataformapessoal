import { FC } from 'react';
import { Card } from '../../components/ui/Card';
import { useNavigate } from 'react-router-dom';

export const NotFoundPage: FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card padding="lg" className="text-center max-w-md">
        <h1 className="text-4xl font-bold text-text-primary mb-4">404</h1>
        <p className="text-text-secondary mb-6">Página não encontrada</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2 bg-neon-purple/20 hover:bg-neon-purple/30 border border-neon-purple/50 rounded-lg text-text-primary transition-colors"
        >
          Voltar ao Dashboard
        </button>
      </Card>
    </div>
  );
};






