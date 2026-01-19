# 📚 Documentação Completa - LifeOS Platform

## 🎯 Visão Geral do Projeto

**LifeOS** é uma plataforma web de gestão pessoal desenvolvida com arquitetura moderna, focada em oferecer uma experiência premium de gerenciamento de vida. A aplicação permite o controle de metas de longo prazo, gestão financeira operacional, atividades diárias e acompanhamento de progresso em diversas áreas da vida.

### Objetivo Principal
Elevar a aplicação para um padrão **"Premium SaaS"** com design inspirado em dashboards de cibersegurança e fintechs modernas, utilizando conceitos de **Bento Grid**, **Dark Mode Profundo**, e **Glassmorphism sutil**.

---

## 🏗️ Arquitetura e Estrutura do Projeto

### Estrutura de Pastas

```
plataforma-pessoal/
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes reutilizáveis
│   │   │   ├── dashboard/       # Componentes específicos do dashboard
│   │   │   ├── layout/          # Layout principal (Sidebar, MainLayout)
│   │   │   ├── ui/              # Componentes UI base (Card, ThemeToggle)
│   │   │   └── FinancialManagement/  # Componentes de gestão financeira
│   │   ├── containers/         # Páginas/Containers principais
│   │   │   ├── DashboardPage/   # Dashboard principal (Bento Grid)
│   │   │   ├── Goals*/          # Páginas de metas (Finance, Career, etc.)
│   │   │   ├── FinancePage/     # Gestão financeira operacional
│   │   │   ├── TasksPage/       # Gestão de atividades
│   │   │   ├── LoginPage/       # Autenticação
│   │   │   └── RegisterPage/    # Registro
│   │   ├── context/             # Context API (Theme, Auth, Background)
│   │   ├── routes/              # Configuração de rotas
│   │   ├── styles/              # Estilos globais e tema
│   │   ├── utils/               # Utilitários (cn, etc.)
│   │   └── hooks/               # Custom hooks
│   ├── tailwind.config.js       # Configuração Tailwind CSS
│   ├── postcss.config.js        # Configuração PostCSS
│   └── package.json
└── backend/                     # Backend Node.js (não documentado aqui)
```

---

## 🛠️ Stack Tecnológico

### Frontend

- **React 19.1.1** - Biblioteca UI
- **TypeScript 5.8.3** - Tipagem estática
- **Vite 7.1.2** - Build tool e dev server
- **React Router DOM 7.9.1** - Roteamento
- **Tailwind CSS 3.4.19** - Framework CSS utility-first
- **Styled Components 6.1.19** - CSS-in-JS (uso mínimo)
- **Lucide React 0.562.0** - Biblioteca de ícones
- **Recharts 3.3.0** - Gráficos e visualizações
- **Framer Motion 12.23.12** - Animações

### Principais Dependências

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-router-dom": "^7.9.1",
  "tailwindcss": "^3.4.19",
  "lucide-react": "^0.562.0",
  "recharts": "^3.3.0",
  "styled-components": "^6.1.19"
}
```

---

## 🎨 Design System - "VertexGuard Premium Dark"

### Paleta de Cores

#### Dark Mode (Padrão)
- **Sidebar**: `#000000` (Preto puro)
- **Background**: `#1F2937` (Cinza escuro)
- **Surface (Cards)**: `#151725` (Cinza muito escuro)
- **Bordas**: `rgba(255, 255, 255, 0.05)` (Bordas sutis)

#### Cores Neon de Acento
- **Purple**: `#A855F7` (Roxo vibrante)
- **Cyan**: `#00FFFF` (Azul ciano)
- **Orange**: `#FF6B35` (Laranja neon)
- **Emerald**: `#10B981` (Verde esmeralda)
- **Pink**: `#EC4899` (Rosa/Magenta)
- **Blue**: `#3B82F6` (Azul neon)

#### Light Mode
- **Sidebar**: `#FFFFFF` (Branco)
- **Background**: `#F3F4F6` (Cinza claro)
- **Surface**: `#FFFFFF` (Branco)
- **Bordas**: `rgba(0, 0, 0, 0.1)`

### Tipografia
- **Fonte Principal**: `Inter`, `Plus Jakarta Sans`, `system-ui`, `sans-serif`
- **Títulos**: Peso bold, cores claras/escuras conforme tema
- **Subtítulos**: Cinza médio (`text-slate-400` no dark, `text-gray-600` no light)

### Componentes Base

#### Card Component (`src/components/ui/Card.tsx`)
Componente base do design system com suporte a Dark/Light Mode.

**Variantes:**
- `default`: Card padrão com fundo surface
- `glass`: Efeito glassmorphism com backdrop blur
- `neon`: Gradiente sutil de neon no fundo

**Props:**
```typescript
interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'neon';
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}
```

**Características:**
- Bordas arredondadas (`rounded-2xl` / `1.5rem`)
- Transições suaves
- Hover effects configuráveis
- Estilos inline como fallback (garantem visual mesmo se Tailwind falhar)

---

## 🧩 Componentes Principais

### 1. MainLayout (`src/components/layout/MainLayout.tsx`)

Layout principal que envolve todas as páginas protegidas.

**Características:**
- Sidebar fixa à esquerda (18rem / 288px)
- Área de conteúdo com scroll independente
- `position: fixed` para ocupar toda viewport
- Background dinâmico conforme tema
- Scroll otimizado (apenas no `main`, não no body)

**Estrutura:**
```tsx
<MainLayout>
  <Sidebar /> {/* Fixa à esquerda */}
  <main> {/* Área de conteúdo com scroll */}
    {children}
  </main>
</MainLayout>
```

### 2. Sidebar (`src/components/layout/Sidebar.tsx`)

Menu lateral de navegação com suporte completo a Dark/Light Mode.

**Estrutura de Navegação:**

1. **Logo/Brand** (Topo)
   - Logo "LifeOS" com ícone Sparkles
   - Subtítulo "Gestão de Vida"

2. **Menu Principal**
   - Dashboard (`/`)

3. **Gestão de Metas**
   - Financeira (`/goals/finance`) - Ícone: Wallet
   - Profissional (`/goals/career`) - Ícone: Briefcase
   - Empresarial (`/goals/business`) - Ícone: Building2
   - Educacional (`/goals/education`) - Ícone: GraduationCap
   - Leitura (`/goals/reading`) - Ícone: BookOpen
   - Treinos & Saúde (`/goals/health`) - Ícone: Dumbbell

4. **Operacional**
   - Gestão Financeira (`/finance`) - Ícone: DollarSign
   - Gestão de Atividades (`/tasks`) - Ícone: CheckSquare

5. **Footer**
   - ThemeToggle (Dark/Light Mode)

**Estados dos Itens:**
- **Normal**: Texto secundário, fundo transparente
- **Hover**: Fundo sutil (`rgba(255, 255, 255, 0.05)`), texto claro
- **Active**: Fundo com cor primária transparente, texto branco brilhante, borda esquerda neon roxa (`2px solid`)

### 3. ThemeContext (`src/context/ThemeContext.tsx`)

Context API para gerenciamento de tema Dark/Light Mode.

**Funcionalidades:**
- Persistência no `localStorage`
- Atualização automática do `data-theme` no `documentElement`
- Atualização do background do `body` conforme tema
- Hook `useTheme()` para acesso ao tema

**API:**
```typescript
const { theme, toggleTheme, setTheme } = useTheme();
// theme: 'dark' | 'light'
// toggleTheme: () => void
// setTheme: (theme: ThemeMode) => void
```

### 4. ThemeToggle (`src/components/ui/ThemeToggle.tsx`)

Componente de toggle para alternar entre Dark/Light Mode.

**Características:**
- Ícone dinâmico (Sun/Moon)
- Animação suave
- Integrado no footer da Sidebar

### 5. DashboardPage (`src/containers/DashboardPage/index.tsx`)

Página principal com layout **Bento Grid**.

**Estrutura do Grid:**
- Layout responsivo: `grid-cols-1 md:grid-cols-3`
- Cards com tamanhos variados (1 ou 2 colunas)

**Widgets Implementados:**

1. **Welcome & Focus (Hero)** - Ocupa 2 colunas
   - Mensagem de boas-vindas personalizada
   - Lista de tarefas focadas do dia
   - Barra de progresso do ano

2. **Financial Snapshot** - Ocupa 1 coluna
   - Gráfico de área (Recharts) mostrando crescimento patrimonial
   - Total acumulado em destaque
   - Badge de crescimento percentual

3. **Health & Bio** - Ocupa 1 coluna
   - Status do Dopamine Detox (dias seguidos)
   - Status do treino do dia
   - Anéis de progresso (ProgressRing)

4. **Habit Tracker** - Ocupa 1 coluna
   - Lista compacta de hábitos diários
   - Checkboxes estilizados (HabitCheckbox)
   - Contador de hábitos concluídos

5. **Project Status** - Ocupa 2 colunas
   - Resumo de projetos/empresas
   - Barras de progresso por projeto

**Componentes Auxiliares:**
- `ProgressRing`: Anel de progresso circular
- `HabitCheckbox`: Checkbox estilizado para hábitos

---

## 🗺️ Rotas e Navegação

### Estrutura de Rotas (`src/routes/index.tsx`)

#### Rotas Públicas (Sem Layout)
- `/login` → `LoginPage`
- `/register` → `RegisterPage`

#### Rotas Protegidas (Com MainLayout)

**Dashboard:**
- `/` → `DashboardPage`
- `/dashboard` → `DashboardPage`

**Metas (Goals):**
- `/goals/finance` → `GoalsFinancePage`
- `/goals/career` → `GoalsCareerPage`
- `/goals/business` → `GoalsBusinessPage`
- `/goals/education` → `GoalsEducationPage`
- `/goals/reading` → `GoalsReadingPage`
- `/goals/health` → `GoalsHealthPage`

**Operacional:**
- `/finance` → `FinancePage`
- `/tasks` → `TasksPage`

**Legacy (Compatibilidade):**
- `/inicio` → `TelaInicio`
- `/gestao-pessoal/financeira` → `GestaoFinanceiraPage`
- `/gestao-pessoal/atividades` → `GestaoAtividadesPage`
- `/financeiro` → `GestaoFinanceiraPage`
- `/atividades` → `GestaoAtividadesPage`

**404:**
- `*` → `NotFoundPage`

---

## 🎨 Configuração de Estilos

### Tailwind CSS (`tailwind.config.js`)

**Configuração Principal:**
- Content paths: `./index.html`, `./src/**/*.{js,ts,jsx,tsx}`
- Paleta de cores customizada (dark, neon, status, text)
- Border radius customizado (`card`, `card-lg`)
- Box shadows com efeitos glow
- Backdrop blur customizado

**Cores Disponíveis:**
```javascript
// Dark colors
dark.base, dark.surface, dark.elevated, dark.border, dark.border-strong

// Neon colors
neon.purple, neon.cyan, neon.orange, neon.emerald, neon.pink, neon.blue

// Status colors
status.success, status.warning, status.error, status.info

// Text colors
text.primary, text.secondary, text.muted
```

### CSS Global (`src/styles/tailwind.css`)

**Reset e Base:**
- `html`, `body`, `#root` com `overflow: hidden` (scroll apenas no main)
- Margin e padding zerados
- Variáveis CSS para tema (`--color-sidebar`, `--color-background`, etc.)
- Classes customizadas (`.bento-card`)

**Estrutura de Scroll:**
```
html (overflow: hidden)
└── body (overflow: hidden)
    └── #root (overflow: hidden)
        └── MainLayout (position: fixed)
            └── main (overflowY: auto) ← ÚNICA área com scroll
```

### Theme System (`src/styles/theme.ts`)

Sistema de temas com suporte a Dark/Light Mode.

**Função Principal:**
```typescript
getTheme(mode: 'dark' | 'light'): ThemeObject
```

**Estrutura do Tema:**
```typescript
{
  colors: {
    sidebar: string,
    background: string,
    surface: string,
    border: string,
    text: string,
    textSecondary: string,
    textMuted: string,
    neon: { purple, cyan, orange, emerald, pink, blue },
    status: { success, warning, error, info }
  },
  fonts: { main: string }
}
```

---

## 🔧 Funcionalidades Implementadas

### ✅ Dark/Light Mode
- **Status**: ✅ 100% Funcional
- Toggle completo em toda a plataforma
- Persistência no localStorage
- Transições suaves
- Todos os componentes adaptam cores dinamicamente

### ✅ Layout Principal
- **Status**: ✅ Completo
- Sidebar fixa com navegação completa
- MainLayout responsivo
- Scroll otimizado (apenas uma barra de rolagem)
- Sem espaços brancos indesejados

### ✅ Dashboard Page
- **Status**: ✅ Implementado com Bento Grid
- Layout responsivo
- Widgets funcionais com dados mockados
- Gráficos com Recharts
- Componentes de progresso

### ✅ Design System
- **Status**: ✅ Base Completo
- Card component com variantes
- Paleta de cores definida
- Tipografia configurada
- Estilos inline como fallback

### ⚠️ Páginas de Metas (Goals)
- **Status**: ⚠️ Placeholders criados
- Estrutura de rotas configurada
- Componentes básicos criados
- **Pendente**: Implementação completa do conteúdo

### ⚠️ Páginas Operacionais
- **Status**: ⚠️ Placeholders criados
- FinancePage e TasksPage criadas
- **Pendente**: Implementação completa do conteúdo

---

## 🐛 Problemas Resolvidos

### 1. CSS Não Aplicado / Layout Quebrado
**Problema**: Tailwind CSS não estava sendo processado corretamente.

**Solução:**
- Downgrade de Tailwind v4 para v3.4.19 (v4 tem breaking changes)
- Ajuste do `postcss.config.js`
- Importação do `tailwind.css` antes de outros estilos
- Estilos inline como fallback em componentes críticos

### 2. Barra de Rolagem Dupla
**Problema**: Scroll no body/html E no main causando duas barras.

**Solução:**
- `html`, `body`, `#root` com `overflow: hidden`
- Apenas o `main` tem `overflowY: auto`
- `MainLayout` com `position: fixed` ocupando toda viewport

### 3. Barrinha Branca no Topo
**Problema**: Espaço branco entre navegador e página.

**Solução:**
- `body` com `margin: 0 !important` e `padding: 0 !important`
- `body` com `background-color` definido conforme tema
- `index.html` com estilos inline para evitar flash branco
- `MainLayout` com `position: fixed` e `top: 0`

### 4. Imports Não Resolvidos
**Problema**: Múltiplos erros de imports não encontrados.

**Solução:**
- Remoção de imports não utilizados
- Criação de componentes faltantes (placeholders)
- Instalação de dependências faltantes (`lucide-react`)

---

## 📋 Configurações Importantes

### PostCSS (`postcss.config.js`)
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

### Entry Point (`src/main.tsx`)
**Ordem de Importação Crítica:**
1. `./styles/tailwind.css` ← **PRIMEIRO**
2. `App`
3. Outros providers

### Index HTML (`index.html`)
- Estilos inline no `<body>` para evitar flash branco
- `margin: 0; padding: 0;` no `html` e `body`

---

## 🚀 Próximos Passos Sugeridos

### Prioridade Alta
1. **Implementar Páginas de Metas (Goals)**
   - Criar layouts específicos para cada tipo de meta
   - Integrar com backend (quando disponível)
   - Adicionar gráficos e visualizações de progresso

2. **Implementar Páginas Operacionais**
   - FinancePage: CRUD completo de receitas/despesas
   - TasksPage: Sistema de tarefas e hábitos

3. **Integração com Backend**
   - Conectar DashboardPage com API real
   - Substituir dados mockados por dados reais
   - Implementar autenticação completa

### Prioridade Média
4. **Melhorias de UX**
   - Loading states
   - Error boundaries
   - Toast notifications
   - Animações de transição entre páginas

5. **Responsividade Mobile**
   - Sidebar colapsável em mobile
   - Grid adaptativo para telas pequenas
   - Touch gestures

### Prioridade Baixa
6. **Features Avançadas**
   - Exportação de dados
   - Relatórios PDF
   - Notificações push
   - PWA support

---

## 📝 Notas Técnicas Importantes

### Scroll Management
- **NUNCA** adicionar scroll ao `html`, `body` ou `#root`
- Scroll deve acontecer **APENAS** dentro do `main` do `MainLayout`
- Isso evita barras de rolagem duplas e problemas de layout

### Theme System
- Sempre usar `useTheme()` e `getTheme()` para cores
- Nunca hardcodar cores (exceto em casos específicos)
- Componentes devem adaptar automaticamente ao tema

### Fallback Styles
- Componentes críticos têm estilos inline como fallback
- Isso garante visual mesmo se Tailwind não processar corretamente
- Priorizar estilos inline para elementos críticos (Card, Layout, Sidebar)

### Tailwind CSS
- Versão atual: **3.4.19** (NÃO usar v4 ainda)
- Sempre verificar se classes estão sendo aplicadas
- Usar `cn()` utility para combinar classes condicionalmente

---

## 🔗 Arquivos de Referência

### Arquivos Críticos para Entender o Projeto

1. **`src/routes/index.tsx`** - Estrutura completa de rotas
2. **`src/components/layout/MainLayout.tsx`** - Layout principal
3. **`src/components/layout/Sidebar.tsx`** - Navegação lateral
4. **`src/context/ThemeContext.tsx`** - Sistema de temas
5. **`src/styles/theme.ts`** - Definição de cores e temas
6. **`src/components/ui/Card.tsx`** - Componente base do design system
7. **`src/containers/DashboardPage/index.tsx`** - Dashboard com Bento Grid
8. **`tailwind.config.js`** - Configuração Tailwind CSS

---

## 📞 Comandos Úteis

### Desenvolvimento
```bash
cd plataforma-pessoal/frontend
npm install          # Instalar dependências
npm run dev          # Iniciar servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
```

### Instalação de Dependências
```bash
npm install lucide-react    # Ícones
npm install recharts        # Gráficos
npm install tailwindcss@^3.4.19  # Tailwind CSS (versão específica)
```

---

## ✅ Checklist de Qualidade

- [x] Dark/Light Mode funcional
- [x] Layout responsivo
- [x] Scroll otimizado (apenas uma barra)
- [x] Sem espaços brancos indesejados
- [x] Design System base implementado
- [x] Dashboard Page com Bento Grid
- [x] Navegação completa configurada
- [x] Rotas todas mapeadas
- [ ] Páginas de Metas implementadas
- [ ] Páginas Operacionais implementadas
- [ ] Integração com Backend
- [ ] Testes unitários
- [ ] Documentação de componentes

---

**Última Atualização**: Janeiro 2025  
**Versão do Projeto**: 0.0.0 (Desenvolvimento)  
**Status**: 🟢 Em Desenvolvimento Ativo







