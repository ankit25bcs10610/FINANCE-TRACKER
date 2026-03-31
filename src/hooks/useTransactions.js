// hooks/useTransactions.js
import { useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'

export function useTransactions({ search = '', category = '', type = '', sortBy = 'date', sortDir = 'desc', dateFrom = '', dateTo = '' } = {}) {
  const { transactions, addTransaction, updateTransaction, deleteTransaction } = useFinance()

  const filtered = useMemo(() => {
    let result = [...transactions]

    // Search
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(t =>
        t.title.toLowerCase().includes(q) ||
        (t.notes && t.notes.toLowerCase().includes(q))
      )
    }

    // Filter by category
    if (category) {
      result = result.filter(t => t.category === category)
    }

    // Filter by type
    if (type) {
      result = result.filter(t => t.type === type)
    }

    // Filter by date range
    if (dateFrom) {
      result = result.filter(t => new Date(t.date) >= new Date(dateFrom))
    }
    if (dateTo) {
      result = result.filter(t => new Date(t.date) <= new Date(dateTo))
    }

    // Sort
    result.sort((a, b) => {
      let valA, valB
      if (sortBy === 'date') {
        valA = new Date(a.date)
        valB = new Date(b.date)
      } else if (sortBy === 'amount') {
        valA = a.amount
        valB = b.amount
      } else if (sortBy === 'category') {
        valA = a.category
        valB = b.category
      } else {
        valA = a[sortBy]
        valB = b[sortBy]
      }
      if (valA < valB) return sortDir === 'asc' ? -1 : 1
      if (valA > valB) return sortDir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [transactions, search, category, type, sortBy, sortDir, dateFrom, dateTo])

  return { transactions: filtered, addTransaction, updateTransaction, deleteTransaction }
}
