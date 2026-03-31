// hooks/useBudget.js
import { useMemo } from 'react'
import { useFinance } from '../context/FinanceContext'
import { format } from 'date-fns'

export function useBudget() {
  const { transactions, budget, updateBudget } = useFinance()

  const currentMonth = format(new Date(), 'yyyy-MM')

  const stats = useMemo(() => {
    const thisMonthExpenses = transactions.filter(t => {
      const tMonth = t.date ? t.date.substring(0, 7) : ''
      return t.type === 'expense' && tMonth === currentMonth
    })

    const thisMonthIncome = transactions.filter(t => {
      const tMonth = t.date ? t.date.substring(0, 7) : ''
      return t.type === 'income' && tMonth === currentMonth
    })

    const totalExpenses = thisMonthExpenses.reduce((s, t) => s + t.amount, 0)
    const totalIncome = thisMonthIncome.reduce((s, t) => s + t.amount, 0)
    const remaining = budget.monthlyBudget - totalExpenses
    const percentUsed = budget.monthlyBudget > 0
      ? Math.min((totalExpenses / budget.monthlyBudget) * 100, 100)
      : 0

    const allExpenses = transactions.filter(t => t.type === 'expense')
    const allIncome = transactions.filter(t => t.type === 'income')
    const netBalance = allIncome.reduce((s, t) => s + t.amount, 0) - allExpenses.reduce((s, t) => s + t.amount, 0)

    // Category breakdown
    const categoryMap = {}
    allExpenses.forEach(t => {
      categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount
    })
    const topCategory = Object.entries(categoryMap).sort((a, b) => b[1] - a[1])[0]

    return {
      totalExpenses,
      totalIncome,
      remaining,
      percentUsed,
      monthlyBudget: budget.monthlyBudget,
      netBalance,
      topCategory: topCategory ? topCategory[0] : 'N/A',
      topCategoryAmount: topCategory ? topCategory[1] : 0,
      isOverBudget: totalExpenses > budget.monthlyBudget,
    }
  }, [transactions, budget, currentMonth])

  return { ...stats, updateBudget, budget }
}
