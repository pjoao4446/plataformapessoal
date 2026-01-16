// ============================================
// TIPOS
// ============================================

export type PaymentMethod = 'debit_card' | 'credit_card' | 'pix' | 'cash' | 'transfer';
export type PaymentCondition = 'spot' | 'installment' | 'recurring';

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: 'checking' | 'savings' | 'investment';
  bank?: string;
}

export interface CreditCard {
  id: string;
  name: string;
  limit: number;
  used: number;
  closingDay: number;
  dueDay: number;
  bank?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income';
  color: string;
  icon?: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense' | 'transfer';
  categoryId?: string;
  accountId?: string;
  cardId?: string;
  date: string;
  paymentMethod?: PaymentMethod;
  paymentCondition?: PaymentCondition;
  installments?: number;
  goalId?: string;
}

export interface QuarterStatus {
  quarter: number;
  target: number;
  current: number;
  months: {
    month: number;
    target: number;
    current: number;
  }[];
}

export interface FinancialGoal {
  id: string;
  name: string;
  type: 'investment' | 'debt';
  totalTarget: number;
  currentAmount: number;
  quarters: QuarterStatus[];
  deadline: string;
  description?: string;
}

export type HabitCategory = 'health' | 'intellect' | 'detox' | 'business';

export interface Habit {
  id: string;
  name: string;
  category: HabitCategory;
  description?: string;
  streak: number;
  bestStreak: number;
}

export interface DailyLog {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  notes?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  status: 'want_to_read' | 'reading' | 'completed';
  rating?: number;
  pages?: number;
  currentPage?: number;
  startedDate?: string;
  completedDate?: string;
}

export interface Workout {
  id: string;
  type: 'gym' | 'run';
  name: string;
  date: string;
  duration?: number;
  distance?: number;
  calories?: number;
  notes?: string;
}

export interface CareerGoal {
  id: string;
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed';
  category: 'promotion' | 'skill' | 'network' | 'certification';
  feedback?: {
    date: string;
    author: string;
    content: string;
  }[];
}

export type ProjectStatus = 'planning' | 'in_progress' | 'paused' | 'completed' | 'cancelled';

export interface Milestone {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  completedDate?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  deadline: string;
  milestones: Milestone[];
  progress: number;
}

export type SkillCategory = 'language' | 'tech' | 'soft' | 'certification';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number;
  maxLevel: number;
  hoursStudied: number;
  lastStudied?: string;
  description?: string;
}

// ============================================
// MOCKS DE DADOS
// ============================================

export const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'Conta Corrente', balance: 5000.00, type: 'checking', bank: 'Banco do Brasil' },
  { id: '2', name: 'Poupança', balance: 15000.00, type: 'savings', bank: 'Banco do Brasil' },
  { id: '3', name: 'Investimentos', balance: 25000.00, type: 'investment', bank: 'XP Investimentos' },
];

export const MOCK_CARDS: CreditCard[] = [
  { id: '1', name: 'Cartão Nubank', limit: 5000.00, used: 1200.00, closingDay: 5, dueDay: 10, bank: 'Nubank' },
  { id: '2', name: 'Cartão BB', limit: 3000.00, used: 800.00, closingDay: 10, dueDay: 15, bank: 'Banco do Brasil' },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Alimentação', type: 'expense', color: '#EF4444' },
  { id: '2', name: 'Transporte', type: 'expense', color: '#3B82F6' },
  { id: '3', name: 'Moradia', type: 'expense', color: '#8B5CF6' },
  { id: '4', name: 'Salário', type: 'income', color: '#10B981' },
  { id: '5', name: 'Freelance', type: 'income', color: '#10B981' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    description: 'Salário',
    amount: 5000.00,
    type: 'income',
    categoryId: '4',
    accountId: '1',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'transfer',
  },
  {
    id: '2',
    description: 'Supermercado',
    amount: 350.00,
    type: 'expense',
    categoryId: '1',
    accountId: '1',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'debit_card',
  },
  {
    id: '3',
    description: 'Uber',
    amount: 25.50,
    type: 'expense',
    categoryId: '2',
    accountId: '1',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    paymentMethod: 'credit_card',
  },
];

export const MOCK_FINANCIAL_GOALS: FinancialGoal[] = [
  {
    id: '1',
    name: 'Reserva de Emergência',
    type: 'investment',
    totalTarget: 50000.00,
    currentAmount: 15000.00,
    deadline: '2025-12-31',
    quarters: [
      {
        quarter: 1,
        target: 12500.00,
        current: 5000.00,
        months: [
          { month: 1, target: 4000.00, current: 2000.00 },
          { month: 2, target: 4000.00, current: 1500.00 },
          { month: 3, target: 4500.00, current: 1500.00 },
        ],
      },
      {
        quarter: 2,
        target: 12500.00,
        current: 5000.00,
        months: [
          { month: 4, target: 4000.00, current: 0 },
          { month: 5, target: 4000.00, current: 0 },
          { month: 6, target: 4500.00, current: 0 },
        ],
      },
      {
        quarter: 3,
        target: 12500.00,
        current: 5000.00,
        months: [
          { month: 7, target: 4000.00, current: 0 },
          { month: 8, target: 4000.00, current: 0 },
          { month: 9, target: 4500.00, current: 0 },
        ],
      },
      {
        quarter: 4,
        target: 12500.00,
        current: 0,
        months: [
          { month: 10, target: 4000.00, current: 0 },
          { month: 11, target: 4000.00, current: 0 },
          { month: 12, target: 4500.00, current: 0 },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Quitar Cartão de Crédito',
    type: 'debt',
    totalTarget: 5000.00,
    currentAmount: 2000.00,
    deadline: '2025-06-30',
    quarters: [
      {
        quarter: 1,
        target: 2500.00,
        current: 2000.00,
        months: [
          { month: 1, target: 800.00, current: 800.00 },
          { month: 2, target: 800.00, current: 700.00 },
          { month: 3, target: 900.00, current: 500.00 },
        ],
      },
      {
        quarter: 2,
        target: 2500.00,
        current: 0,
        months: [
          { month: 4, target: 800.00, current: 0 },
          { month: 5, target: 800.00, current: 0 },
          { month: 6, target: 900.00, current: 0 },
        ],
      },
    ],
  },
];

export const MOCK_HABITS: Habit[] = [
  { id: '1', name: 'Leitura (30min)', category: 'intellect', streak: 5, bestStreak: 12 },
  { id: '2', name: 'Zero Açúcar', category: 'health', streak: 3, bestStreak: 7 },
  { id: '3', name: 'Inglês', category: 'intellect', streak: 8, bestStreak: 15 },
];

export const MOCK_DAILY_LOGS: DailyLog[] = [
  { id: '1', habitId: '1', date: getTodayDateString(), completed: true },
  { id: '2', habitId: '2', date: getTodayDateString(), completed: false },
  { id: '3', habitId: '3', date: getTodayDateString(), completed: true },
];

export const MOCK_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    status: 'reading',
    pages: 464,
    currentPage: 120,
    startedDate: '2024-01-15',
  },
  {
    id: '2',
    title: 'Design Patterns',
    author: 'Gang of Four',
    status: 'want_to_read',
    pages: 395,
  },
  {
    id: '3',
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    status: 'completed',
    pages: 352,
    rating: 5,
    completedDate: '2023-12-20',
  },
];

export const MOCK_WORKOUTS: Workout[] = [
  {
    id: '1',
    type: 'gym',
    name: 'Treino de Pernas',
    date: new Date().toISOString().split('T')[0],
    duration: 60,
    calories: 450,
  },
  {
    id: '2',
    type: 'run',
    name: 'Corrida Matinal',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    distance: 5.0,
    duration: 30,
    calories: 300,
  },
];

export const MOCK_CAREER: CareerGoal[] = [
  {
    id: '1',
    title: 'Promoção para Tech Lead',
    description: 'Assumir posição de liderança técnica no time',
    deadline: '2025-06-30',
    status: 'in_progress',
    category: 'promotion',
    feedback: [
      {
        date: '2024-01-15',
        author: 'Gerente de Projetos',
        content: 'Excelente trabalho na arquitetura do novo sistema!',
      },
    ],
  },
];

export const MOCK_PROJECTS: Project[] = [
  {
    id: '1',
    name: 'Sistema de Gestão Financeira',
    description: 'Plataforma completa para controle financeiro pessoal',
    status: 'in_progress',
    startDate: '2024-01-01',
    deadline: '2025-06-30',
    progress: 45,
    milestones: [
      {
        id: '1',
        title: 'Backend API',
        description: 'Desenvolvimento da API REST',
        deadline: '2024-03-31',
        completed: true,
        completedDate: '2024-03-25',
      },
      {
        id: '2',
        title: 'Frontend MVP',
        description: 'Interface básica funcional',
        deadline: '2024-06-30',
        completed: false,
      },
    ],
  },
];

export const MOCK_SKILLS: Skill[] = [
  {
    id: '1',
    name: 'TypeScript',
    category: 'tech',
    level: 7,
    maxLevel: 10,
    hoursStudied: 120,
    lastStudied: new Date().toISOString().split('T')[0],
  },
  {
    id: '2',
    name: 'Inglês',
    category: 'language',
    level: 6,
    maxLevel: 10,
    hoursStudied: 200,
    lastStudied: new Date(Date.now() - 86400000).toISOString().split('T')[0],
  },
];

// ============================================
// FUNÇÕES UTILITÁRIAS
// ============================================

export function calculateBalance(transactions: Transaction[]): number {
  return transactions.reduce((balance, transaction) => {
    if (transaction.type === 'income') {
      return balance + transaction.amount;
    } else if (transaction.type === 'expense') {
      return balance - transaction.amount;
    }
    return balance;
  }, 0);
}

export function getIncomeTotal(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getExpenseTotal(transactions: Transaction[]): number {
  return transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);
}

export function getGoalById(id: string): FinancialGoal | undefined {
  return MOCK_FINANCIAL_GOALS.find(goal => goal.id === id);
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTodayLogs(): DailyLog[] {
  const today = getTodayDateString();
  return MOCK_DAILY_LOGS.filter(log => log.date === today);
}

export function getLogsByHabitId(habitId: string): DailyLog[] {
  return MOCK_DAILY_LOGS.filter(log => log.habitId === habitId);
}

export function calculateProjectProgress(project: Project): number {
  if (project.milestones.length === 0) return 0;
  const completed = project.milestones.filter(m => m.completed).length;
  return Math.round((completed / project.milestones.length) * 100);
}

export function getTotalHoursStudied(): number {
  return MOCK_SKILLS.reduce((total, skill) => total + skill.hoursStudied, 0);
}
