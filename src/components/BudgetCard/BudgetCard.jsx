import React from 'react'
import { motion } from 'framer-motion'
import { useBudget } from '../../hooks/useBudget'
import { useCurrency } from '../../hooks/useCurrency'

export default function BudgetCard() {
  const { monthlyBudget, totalExpenses, remaining, percentUsed, isOverBudget } = useBudget()
  const { formatAmount } = useCurrency()

  const color = isOverBudget ? 'var(--red)' : percentUsed > 75 ? 'var(--gold)' : 'var(--accent)'

  return (
    <div className="card card-accent-top" style={{ '--card-top-color': color }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            Monthly Budget
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {formatAmount(monthlyBudget)}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
            {isOverBudget ? 'Over Budget' : 'Remaining'}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color, marginTop: '0.2rem' }}>
            {isOverBudget ? '-' : ''}{formatAmount(Math.abs(remaining))}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="progress-bar-track" style={{ marginBottom: '0.5rem' }}>
        <motion.div
          className="progress-bar-fill"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percentUsed}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
        <span>Spent: {formatAmount(totalExpenses)}</span>
        <span style={{ color }}>{percentUsed.toFixed(1)}% used</span>
      </div>
    </div>
  )
}
