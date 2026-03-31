// utils/currencyFormatter.js

export const CATEGORIES = [
  'Food',
  'Travel',
  'Rent',
  'Shopping',
  'Entertainment',
  'Health',
  'Utilities',
  'Subscriptions',
  'Income',
  'Other',
]

export const EXPENSE_CATEGORIES = CATEGORIES.filter(c => c !== 'Income')

export const CATEGORY_COLORS = {
  Food:           '#FF9F43',
  Travel:         '#4ECDC4',
  Rent:           '#A29BFE',
  Shopping:       '#FD79A8',
  Entertainment:  '#6C5CE7',
  Health:         '#00CEC9',
  Utilities:      '#FDCB6E',
  Subscriptions:  '#E17055',
  Income:         '#05EAAF',
  Other:          '#B2BEC3',
}

export const CATEGORY_ICONS = {
  Food:           '🍔',
  Travel:         '✈️',
  Rent:           '🏠',
  Shopping:       '🛍️',
  Entertainment:  '🎬',
  Health:         '💊',
  Utilities:      '⚡',
  Subscriptions:  '📱',
  Income:         '💰',
  Other:          '📌',
}

export const CURRENCIES = ['INR', 'USD', 'EUR', 'GBP', 'JPY']

export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount)
}
