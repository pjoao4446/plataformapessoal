/**
 * EXEMPLOS DE USO DO COMPONENTE CARD
 * 
 * Este arquivo serve como referência visual de como usar o Card component.
 * Não importe este arquivo em produção.
 */

import { Card } from './Card';

// Exemplo 1: Card padrão (Bento Grid style)
export function Example1() {
  return (
    <Card>
      <h3 className="text-text-primary text-xl font-bold mb-2">Título do Card</h3>
      <p className="text-text-secondary">Conteúdo do card com estilo Bento Grid padrão.</p>
    </Card>
  );
}

// Exemplo 2: Card com Glassmorphism
export function Example2() {
  return (
    <Card variant="glass" padding="lg">
      <h3 className="text-text-primary text-xl font-bold mb-2">Card Glass</h3>
      <p className="text-text-secondary">Efeito de vidro fosco com backdrop blur.</p>
    </Card>
  );
}

// Exemplo 3: Card Neon com gradiente
export function Example3() {
  return (
    <Card variant="neon">
      <h3 className="text-text-primary text-xl font-bold mb-2">Card Neon</h3>
      <p className="text-text-secondary">Gradiente neon sutil de roxo para ciano.</p>
    </Card>
  );
}

// Exemplo 4: Card sem hover
export function Example4() {
  return (
    <Card hover={false} padding="sm">
      <h3 className="text-text-primary text-lg font-bold">Card Estático</h3>
      <p className="text-text-secondary text-sm">Sem efeitos de hover.</p>
    </Card>
  );
}

// Exemplo 5: Bento Grid Layout (múltiplos cards)
export function Example5() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <Card>
        <h3 className="text-text-primary font-bold mb-2">Card 1</h3>
        <p className="text-text-secondary text-sm">Conteúdo do primeiro card</p>
      </Card>
      <Card variant="glass">
        <h3 className="text-text-primary font-bold mb-2">Card 2</h3>
        <p className="text-text-secondary text-sm">Conteúdo do segundo card</p>
      </Card>
      <Card variant="neon">
        <h3 className="text-text-primary font-bold mb-2">Card 3</h3>
        <p className="text-text-secondary text-sm">Conteúdo do terceiro card</p>
      </Card>
    </div>
  );
}






