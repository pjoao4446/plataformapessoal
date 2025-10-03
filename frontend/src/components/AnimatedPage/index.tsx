import type { FC, ReactNode } from 'react';
import { AnimatedWrapper } from './styles';

// Definimos as variantes da nossa animação
const animations = {
  // ANTES: initial: { opacity: 0, x: -50 }
  initial: { opacity: 0, y: -50 }, // DEPOIS: Começa 50px ACIMA e invisível

  // ANTES: animate: { opacity: 1, x: 0 }
  animate: { opacity: 1, y: 0 },   // DEPOIS: Desce para a posição final e aparece

  // ANTES: exit: { opacity: 0, x: 50 }
  exit: { opacity: 0, y: 50 },      // DEPOIS: Sai deslizando para BAIXO e desaparece
};

type AnimatedPageProps = {
  children: ReactNode;
};

export const AnimatedPage: FC<AnimatedPageProps> = ({ children }) => {
  return (
    <AnimatedWrapper
      variants={animations}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 1 }} // Duração da animação
    >
      {children}
    </AnimatedWrapper>
  );
};