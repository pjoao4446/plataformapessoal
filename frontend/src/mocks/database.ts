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
  color?: string;
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
  status: 'want_to_read' | 'reading' | 'completed' | 'wishlist';
  rating?: number;
  pages?: number;
  currentPage?: number;
  pagesRead?: number;
  totalPages?: number;
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

export type ProjectStatus = 'planning' | 'in_progress' | 'paused' | 'completed' | 'cancelled' | 'idea' | 'mvp';

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
  title?: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  deadline: string;
  milestones: Milestone[];
  progress: number;
  techStack?: string[];
  revenue?: number;
}

export type SkillCategory = 'language' | 'tech' | 'soft' | 'certification' | 'soft_skill' | 'general';

export interface Skill {
  id: string;
  name: string;
  title?: string;
  category: SkillCategory;
  level: number;
  maxLevel: number;
  hoursStudied: number;
  lastStudied?: string;
  description?: string;
  currentLevelLabel?: string;
  targetLevel?: number;
  nextMilestone?: string;
}

// ============================================
// MOCKS DE DADOS - REMOVIDOS
// Agora todos os dados vêm do Supabase
// ============================================

// Dados mockados removidos - usando Supabase para dados reais
// Mantendo apenas os tipos/interfaces acima

// MOCK_FINANCIAL_GOALS removido - usar Supabase
// export const MOCK_FINANCIAL_GOALS: FinancialGoal[] = [
// Todos os dados mockados foram removidos - usar Supabase
// MOCK_FINANCIAL_GOALS, MOCK_HABITS, MOCK_DAILY_LOGS, MOCK_BOOKS, 
// MOCK_WORKOUTS, MOCK_CAREER, MOCK_PROJECTS, MOCK_SKILLS removidos

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

// Funções utilitárias mantidas (podem ser usadas com dados do Supabase)
export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function calculateProjectProgress(project: Project): number {
  if (project.milestones.length === 0) return 0;
  const completed = project.milestones.filter(m => m.completed).length;
  return Math.round((completed / project.milestones.length) * 100);
}

export function getTotalHoursStudied(skills: Skill[]): number {
  return skills.reduce((total, skill) => total + (skill.hoursStudied || 0), 0);
}
