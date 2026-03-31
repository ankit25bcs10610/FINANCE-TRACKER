// hooks/useCurrency.js
import { useFinance } from '../context/FinanceContext'

const CURRENCY_SYMBOLS = {
  INR: '₹',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
}

export function useCurrency() {
  const { currency, exchangeRates } = useFinance()

  const formatAmount = (amount, targetCurrency = currency) => {
    let converted = amount
    if (targetCurrency !== 'INR' && exchangeRates[targetCurrency]) {
      converted = amount * exchangeRates[targetCurrency]
    }

    const symbol = CURRENCY_SYMBOLS[targetCurrency] || targetCurrency

    try {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: targetCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(converted)
    } catch {
      return `${symbol}${converted.toLocaleString('en-IN')}`
    }
  }

  const formatCompact = (amount) => {
    const converted = currency !== 'INR' && exchangeRates[currency]
      ? amount * exchangeRates[currency]
      : amount

    if (converted >= 100000) return `${CURRENCY_SYMBOLS[currency] || '₹'}${(converted / 100000).toFixed(1)}L`
    if (converted >= 1000) return `${CURRENCY_SYMBOLS[currency] || '₹'}${(converted / 1000).toFixed(1)}K`
    return formatAmount(converted, currency)
  }

  return { formatAmount, formatCompact, currency, symbol: CURRENCY_SYMBOLS[currency] || '₹' }
}
