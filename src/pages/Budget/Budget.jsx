import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { RiEditLine, RiCheckLine, RiRepeatLine, RiAlertLine } from 'react-icons/ri'
import { useBudget } from '../../hooks/useBudget'
import { useCurrency } from '../../hooks/useCurrency'
import { useFinance } from '../../context/FinanceContext'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/currencyFormatter'

export default function Budget() {
  const { monthlyBudget, totalExpenses, remaining, percentUsed, isOverBudget, updateBudget } = useBudget()
  const { formatAmount } = useCurrency()
  const { transactions } = useFinance()
  const [editing, setEditing] = useState(false)
  const [newBudget, setNewBudget] = useState(monthlyBudget)

  // Category breakdown of all expenses
  const categoryBreakdown = React.useMemo(() => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    return Object.entries(map).sort((a, b) => b[1] - a[1])
  }, [transactions])

  // Recurring transactions
  const recurring = transactions.filter(t => t.recurring)
  const recurringTotal = recurring.reduce((s, t) => s + (t.type === 'expense' ? t.amount : 0), 0)

  const color = isOverBudget ? 'var(--red)' : percentUsed > 75 ? 'var(--gold)' : 'var(--accent)'

  const handleSave = () => {
    if (newBudget > 0) {
      updateBudget(newBudget)
      setEditing(false)
    }
  }

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1 className="page-title">Budget Tracker</h1>
          <p className="page-subtitle">Monitor your monthly spending limits</p>
        </div>
      </motion.div>

      {/* Main Budget Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
        className="card"
        style={{ marginBottom: '1.5rem', padding: '2rem', position: 'relative', overflow: 'hidden' }}
      >
        {/* Background orb */}
        <div style={{
          position: 'absolute', top: -60, right: -60,
          width: 200, height: 200, borderRadius: '50%',
          background: isOverBudget ? 'radial-gradient(circle, rgba(255,75,110,0.08), transparent)' : 'radial-gradient(circle, rgba(5,234,175,0.08), transparent)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '0.5rem' }}>
              Monthly Budget
            </div>
            {editing ? (
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  type="number"
                  className="form-input"
                  value={newBudget}
                  onChange={e => setNewBudget(parseFloat(e.target.value))}
                  style={{ width: 160, fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700 }}
                  autoFocus
                />
                <button className="btn btn-primary" onClick={handleSave} style={{ padding: '0.5rem 0.9rem' }}>
                  <RiCheckLine /> Save
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {formatAmount(monthlyBudget)}
                </div>
                <button className="btn btn-ghost" onClick={() => setEditing(true)} style={{ padding: '0.4rem 0.7rem' }}>
                  <RiEditLine />
                </button>
              </div>
            )}
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '0.5rem' }}>
              {isOverBudget ? '⚠️ Over Budget' : 'Remaining'}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2rem', fontWeight: 700, color }}>
              {isOverBudget ? '-' : ''}{formatAmount(Math.abs(remaining))}
            </div>
          </div>
        </div>

        {/* Big Progress */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem', fontSize: '0.8rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Spent: <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{formatAmount(totalExpenses)}</span></span>
            <span style={{ color, fontWeight: 600 }}>{percentUsed.toFixed(1)}% of budget used</span>
          </div>
          <div className="progress-bar-track" style={{ height: 10 }}>
            <motion.div
              className="progress-bar-fill"
              style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
              initial={{ width: 0 }}
              animate={{ width: `${percentUsed}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          {isOverBudget && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                marginTop: '0.75rem', padding: '0.6rem 1rem',
                background: 'var(--red-dim)', border: '1px solid rgba(255,75,110,0.2)',
                borderRadius: 'var(--radius-sm)', color: 'var(--red)', fontSize: '0.8rem',
              }}
            >
              <RiAlertLine /> You've exceeded your monthly budget by {formatAmount(Math.abs(remaining))}
            </motion.div>
          )}
        </div>
      </motion.div>

      <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
        {/* Category Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.2 } }}
          className="card"
        >
          <div className="section-title">Spending by Category</div>
          {categoryBreakdown.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">📊</div>
              <h3>No expenses yet</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {categoryBreakdown.map(([cat, amt], i) => {
                const pct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0
                const color = CATEGORY_COLORS[cat] || '#B2BEC3'
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0, transition: { delay: 0.15 + i * 0.05 } }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.82rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                        <span>{CATEGORY_ICONS[cat] || '📌'}</span> {cat}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {formatAmount(amt)}
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem' }}>
                          ({pct.toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                    <div className="progress-bar-track" style={{ height: 4 }}>
                      <motion.div
                        className="progress-bar-fill"
                        style={{ background: color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 + i * 0.05 }}
                      />
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}
        </motion.div>

        {/* Recurring Expenses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.25 } }}
          className="card"
        >
          <div className="section-title">
            <RiRepeatLine style={{ color: '#818CF8' }} /> Recurring Transactions
          </div>

          {recurring.length === 0 ? (
            <div className="empty-state" style={{ padding: '2rem' }}>
              <div className="empty-state-icon">🔁</div>
              <h3>No recurring items</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Mark transactions as recurring when adding them
              </p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
                {recurring.map(t => (
                  <div key={t.id} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.65rem 0.85rem',
                    background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.15)',
                    borderRadius: 'var(--radius-sm)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>{CATEGORY_ICONS[t.category] || '📌'}</span>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{t.title}</span>
                    </div>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '0.85rem',
                      color: t.type === 'income' ? 'var(--gold)' : 'var(--red)',
                      fontWeight: 600,
                    }}>
                      {t.type === 'income' ? '+' : '-'}{formatAmount(t.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{
                padding: '0.7rem 1rem',
                background: 'var(--border)',
                borderRadius: 'var(--radius-sm)',
                display: 'flex', justifyContent: 'space-between',
                fontSize: '0.82rem',
              }}>
                <span style={{ color: 'var(--text-secondary)' }}>Monthly Recurring Expenses</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--red)', fontWeight: 600 }}>
                  -{formatAmount(recurringTotal)}
                </span>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </div>
  )
}
