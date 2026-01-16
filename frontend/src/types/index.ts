/**
 * Tipos e Interfaces do Sistema
 * Baseado na estrutura do Banco de Dados Supabase
 */

export type TransactionType = 'income' | 'expense' | 'transfer';
export type PaymentStatus = 'paid' | 'pending';
export type OwnerType = 'personal' | 'business';

export interface Account {
  id: string;
  name: string;
  bank_name: string;
  type: 'checking' | 'investment' | 'cash';
  balance: number;
  color: string;
}

export interface CreditCard {
  id: string;
  name: string;
  bank_name: string;
  limit_amount: number;
  current_invoice: number;
  closing_day: number;
  due_day: number;
  color: string;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  date: string; // ISO string
  status: PaymentStatus;
  category_id?: string;
  account_id?: string;
  card_id?: string;
  is_recurring: boolean;
}

export interface Liability {
  id: string;
  title: string;
  current_value: number;
  original_value: number;
  amount_paid: number;
  owner_type: OwnerType;
  status: 'active' | 'negotiating' | 'paid' | 'defaulted';
  creditor_name?: string;
  creditor_type?: 'bank' | 'person' | 'government';
}

export interface Asset {
  id: string;
  title: string;
  current_value: number;
  type: 'emergency_fund' | 'fixed_income' | 'stock' | 'crypto';
  owner_type: OwnerType;
}

