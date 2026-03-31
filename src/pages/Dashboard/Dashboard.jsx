import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiArrowUpLine, RiArrowDownLine, RiWalletLine, RiFireLine, RiAddCircleLine, RiArrowRightLine } from 'react-icons/ri'
import { useBudget } from '../../hooks/useBudget'
import { useCurrency } from '../../hooks/useCurrency'
import { useFinance } from '../../context/FinanceContext'
import { useTransactions } from '../../hooks/useTransactions'
import { SpendingPieChart, IncomeExpenseBar } from '../../components/Charts/Charts'
import BudgetCard from '../../components/BudgetCard/BudgetCard'
import TransactionCard from '../../components/TransactionCard/TransactionCard'
import { fetchExchangeRates } from '../../services/api'
import { CURRENCIES, CATEGORY_ICONS } from '../../utils/currencyFormatter'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.4, ease: 'easeOut' } }),
}

export default function Dashboard() {
  const { totalIncome, totalExpenses, netBalance, topCategory, topCategoryAmount } = useBudget()
  const { formatAmount, formatCompact } = useCurrency()
  const { currency, setCurrency, setExchangeRates, setRatesLoading } = useFinance()
  const { transactions } = useTransactions({ sortBy: 'date', sortDir: 'desc' })
  const recent = transactions.slice(0, 5)

  useEffect(() => {
    setRatesLoading(true)
    fetchExchangeRates().then(rates => {
      setExchangeRates(rates)
      setRatesLoading(false)
    })
  }, [])

  const stats = [
    {
      label: 'Total Income',
      value: formatCompact(totalIncome),
      icon: <RiArrowUpLine />,
      iconBg: 'var(--gold-dim)',
      iconColor: 'var(--gold)',
      glow: 'var(--shadow-gold)',
    },
    {
      label: 'Total Expenses',
      value: formatCompact(totalExpenses),
      icon: <RiArrowDownLine />,
      iconBg: 'var(--red-dim)',
      iconColor: 'var(--red)',
    },
    {
      label: 'Net Balance',
      value: formatCompact(Math.abs(netBalance)),
      icon: <RiWalletLine />,
      iconBg: 'var(--accent-dim)',
      iconColor: 'var(--accent)',
      prefix: netBalance < 0 ? '-' : '+',
      glow: 'var(--shadow-glow)',
    },
    {
      label: 'Top Category',
      value: topCategory,
      subValue: formatCompact(topCategoryAmount),
      icon: CATEGORY_ICONS[topCategory] || <RiFireLine />,
      iconBg: 'rgba(108,92,231,0.15)',
      iconColor: '#A29BFE',
    },
  ]

  return (
    <div>
      {/* Header row */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div className="page-header" style={{ margin: 0 }}>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Your financial overview at a glance</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {/* Currency Selector */}
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            className="form-select"
            style={{ width: 'auto', padding: '0.5rem 0.75rem', fontSize: '0.8rem' }}
          >
            {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <Link to="/transactions/new" className="btn btn-primary">
            <RiAddCircleLine /> Add Transaction
          </Link>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            className="stat-card"
            custom={i} variants={fadeUp} initial="hidden" animate="show"
            style={{ boxShadow: s.glow || 'none' }}
          >
            <div className="stat-icon" style={{ background: s.iconBg, color: s.iconColor }}>
              {typeof s.icon === 'string' ? s.icon : s.icon}
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-value" style={{ color: s.iconColor }}>
              {s.prefix}{s.value}
            </div>
            {s.subValue && (
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.3rem', fontFamily: 'var(--font-mono)' }}>
                {s.subValue}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Budget card */}
      <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show" style={{ marginBottom: '2rem' }}>
        <BudgetCard />
      </motion.div>

      {/* Charts Row */}
      <motion.div
        custom={5} variants={fadeUp} initial="hidden" animate="show"
        className="grid-2"
        style={{ marginBottom: '2rem' }}
      >
        <div className="card">
          <div className="section-title">Spending by Category</div>
          <SpendingPieChart />
        </div>
        <div className="card">
          <div className="section-title">Income vs Expenses</div>
          <IncomeExpenseBar />
        </div>
      </motion.div>

      {/* Recent Transactions */}
      <motion.div custom={6} variants={fadeUp} initial="hidden" animate="show">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div className="section-title" style={{ margin: 0 }}>Recent Transactions</div>
          <Link to="/transactions" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: 500 }}>
            View All <RiArrowRightLine />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🧾</div>
            <h3>No transactions yet</h3>
            <Link to="/transactions/new" className="btn btn-primary" style={{ marginTop: '1rem' }}>
              <RiAddCircleLine /> Add your first transaction
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {recent.map(t => (
              <TransactionCard key={t.id} transaction={t} onEdit={() => {}} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  )
}
