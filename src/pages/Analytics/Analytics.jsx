import React from 'react'
import { motion } from 'framer-motion'
import { SpendingPieChart, MonthlyTrendChart, IncomeExpenseBar } from '../../components/Charts/Charts'
import { useBudget } from '../../hooks/useBudget'
import { useCurrency } from '../../hooks/useCurrency'
import { useFinance } from '../../context/FinanceContext'
import { CATEGORY_COLORS, CATEGORY_ICONS } from '../../utils/currencyFormatter'
import { format, parseISO, startOfMonth, isSameMonth } from 'date-fns'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' } }),
}

export default function Analytics() {
  const { totalIncome, totalExpenses, netBalance, topCategory, topCategoryAmount } = useBudget()
  const { formatAmount, formatCompact } = useCurrency()
  const { transactions } = useFinance()

  // Month over month comparison
  const now = new Date()
  const thisMonth = transactions.filter(t => t.date && isSameMonth(parseISO(t.date), now))
  const lastMonth = transactions.filter(t => {
    if (!t.date) return false
    const d = parseISO(t.date)
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    return isSameMonth(d, prev)
  })

  const thisMonthExp = thisMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const lastMonthExp = lastMonth.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const momChange = lastMonthExp > 0 ? ((thisMonthExp - lastMonthExp) / lastMonthExp) * 100 : 0

  // Top 5 spending categories
  const catMap = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    catMap[t.category] = (catMap[t.category] || 0) + t.amount
  })
  const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 5)

  const summaryStats = [
    { label: 'Total Income', value: formatCompact(totalIncome), color: 'var(--gold)' },
    { label: 'Total Expenses', value: formatCompact(totalExpenses), color: 'var(--red)' },
    { label: 'Net Balance', value: `${netBalance >= 0 ? '+' : '-'}${formatCompact(Math.abs(netBalance))}`, color: netBalance >= 0 ? 'var(--accent)' : 'var(--red)' },
    { label: 'Savings Rate', value: totalIncome > 0 ? `${(((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)}%` : '0%', color: '#A29BFE' },
  ]

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="page-subtitle">Deep dive into your financial patterns</p>
        </div>
      </motion.div>

      {/* Summary row */}
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        {summaryStats.map((s, i) => (
          <motion.div key={s.label} className="stat-card" custom={i} variants={fadeUp} initial="hidden" animate="show">
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Month-over-month banner */}
      <motion.div
        custom={4} variants={fadeUp} initial="hidden" animate="show"
        style={{
          padding: '1rem 1.5rem',
          background: momChange > 0 ? 'var(--red-dim)' : 'rgba(5,234,175,0.08)',
          border: `1px solid ${momChange > 0 ? 'rgba(255,75,110,0.2)' : 'var(--border-accent)'}`,
          borderRadius: 'var(--radius)',
          marginBottom: '2rem',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem',
        }}
      >
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '0.2rem' }}>
            Month-over-Month Change
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            Comparing {format(now, 'MMMM')} vs {format(new Date(now.getFullYear(), now.getMonth() - 1, 1), 'MMMM')}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700,
            color: momChange > 0 ? 'var(--red)' : 'var(--accent)',
          }}>
            {momChange > 0 ? '▲' : '▼'} {Math.abs(momChange).toFixed(1)}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {momChange > 0 ? 'Higher' : 'Lower'} spending this month
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <div className="grid-2" style={{ marginBottom: '2rem' }}>
        <motion.div custom={5} variants={fadeUp} initial="hidden" animate="show" className="card">
          <div className="section-title">Spending by Category</div>
          <SpendingPieChart />
        </motion.div>
        <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show" className="card">
          <div className="section-title">Monthly Trend</div>
          <MonthlyTrendChart />
        </motion.div>
      </div>

      <motion.div custom={7} variants={fadeUp} initial="hidden" animate="show" className="card" style={{ marginBottom: '2rem' }}>
        <div className="section-title">Income vs Expenses (Last 6 Months)</div>
        <IncomeExpenseBar />
      </motion.div>

      {/* Top Spending Categories Table */}
      <motion.div custom={8} variants={fadeUp} initial="hidden" animate="show" className="card">
        <div className="section-title">Top Spending Categories</div>
        {topCats.length === 0 ? (
          <div className="empty-state" style={{ padding: '2rem' }}>
            <div className="empty-state-icon">📊</div>
            <h3>No data yet</h3>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {topCats.map(([cat, amt], i) => {
              const pct = totalExpenses > 0 ? (amt / totalExpenses) * 100 : 0
              const color = CATEGORY_COLORS[cat] || '#B2BEC3'
              return (
                <motion.div
                  key={cat}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0, transition: { delay: 0.1 + i * 0.06 } }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '1rem',
                    padding: '0.9rem 0',
                    borderBottom: i < topCats.length - 1 ? '1px solid var(--border)' : 'none',
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: `${color}18`, border: `1px solid ${color}30`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, fontSize: '1rem',
                  }}>
                    {CATEGORY_ICONS[cat] || '📌'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-primary)' }}>{cat}</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.875rem', fontWeight: 600 }}>
                        {formatAmount(amt)}
                        <span style={{ color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem', fontSize: '0.78rem' }}>
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
                        transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 + i * 0.05 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>
    </div>
  )
}
