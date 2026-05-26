export type StreamType = 'income' | 'expense'
export type Frequency = 'weekly' | 'biweekly' | 'monthly' | 'quarterly' | 'annually'

export interface Stream {
  id: string
  name: string
  type: StreamType
  amount: number
  frequency: Frequency
  notes?: string
  active: boolean
  createdAt: number
  updatedAt: number
}

export interface CashFlowSummary {
  totalMonthlyIncome: number
  totalMonthlyExpenses: number
  netMonthlyCashFlow: number
  annualProjection: number
}

export const FREQUENCY_TO_MONTHLY: Record<Frequency, number> = {
  weekly: 52 / 12,
  biweekly: 26 / 12,
  monthly: 1,
  quarterly: 1 / 3,
  annually: 1 / 12,
}

export function toMonthly(amount: number, frequency: Frequency): number {
  return amount * FREQUENCY_TO_MONTHLY[frequency]
}

export const DEFAULT_INCOME_STREAMS: Omit<Stream, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Primary Job', type: 'income', amount: 0, frequency: 'biweekly', active: true },
  { name: 'Freelance / Contract', type: 'income', amount: 0, frequency: 'monthly', active: true },
  { name: 'Investments / Dividends', type: 'income', amount: 0, frequency: 'quarterly', active: true },
  { name: 'Rental Income', type: 'income', amount: 0, frequency: 'monthly', active: true },
  { name: 'Side Business', type: 'income', amount: 0, frequency: 'monthly', active: true },
  { name: 'Passive / Royalties', type: 'income', amount: 0, frequency: 'monthly', active: true },
  { name: 'Other Income', type: 'income', amount: 0, frequency: 'monthly', active: true },
]

export const DEFAULT_EXPENSE_STREAMS: Omit<Stream, 'id' | 'createdAt' | 'updatedAt'>[] = [
  { name: 'Housing (Rent / Mortgage)', type: 'expense', amount: 0, frequency: 'monthly', active: true },
  { name: 'Utilities & Subscriptions', type: 'expense', amount: 0, frequency: 'monthly', active: true },
  { name: 'Food & Groceries', type: 'expense', amount: 0, frequency: 'monthly', active: true },
  { name: 'Transportation', type: 'expense', amount: 0, frequency: 'monthly', active: true },
  { name: 'Discretionary / Lifestyle', type: 'expense', amount: 0, frequency: 'monthly', active: true },
]
