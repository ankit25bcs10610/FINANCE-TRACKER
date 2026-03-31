// components/Charts/SpendingPieChart.jsx
import React from 'react'
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useFinance } from '../../context/FinanceContext'
import { CATEGORY_COLORS } from '../../utils/currencyFormatter'
import { useCurrency } from '../../hooks/useCurrency'

export function SpendingPieChart() {
  const { transactions } = useFinance()
  const { formatAmount } = useCurrency()

  const data = React.useMemo(() => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => {
      map[t.category] = (map[t.category] || 0) + t.amount
    })
    return Object.entries(map)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value]) => ({ name, value }))
  }, [transactions])

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const { name, value } = payload[0].payload
      return (
        <div style={{
          background: '#1A1A2E', border: '1px solid var(--border)',
          borderRadius: 8, padding: '0.6rem 1rem', fontSize: '0.8rem',
        }}>
          <div style={{ color: CATEGORY_COLORS[name] || '#fff', fontWeight: 600 }}>{name}</div>
          <div style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-mono)' }}>{formatAmount(value)}</div>
        </div>
      )
    }
    return null
  }

  if (!data.length) return <EmptyChart />

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius={65} outerRadius={110}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((entry) => (
            <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || '#888'} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          iconType="circle" iconSize={8}
          formatter={(val) => <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{val}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}

// ---- Monthly Trend Chart ----
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as LTooltip, ResponsiveContainer as RC2, Legend as LL } from 'recharts'
import { format, parseISO, startOfMonth } from 'date-fns'

export function MonthlyTrendChart() {
  const { transactions } = useFinance()
  const { formatAmount } = useCurrency()

  const data = React.useMemo(() => {
    const map = {}
    transactions.forEach(t => {
      if (!t.date) return
      const month = format(startOfMonth(parseISO(t.date)), 'MMM yyyy')
      if (!map[month]) map[month] = { month, income: 0, expense: 0 }
      if (t.type === 'income') map[month].income += t.amount
      else map[month].expense += t.amount
    })
    return Object.values(map).sort((a, b) => new Date(a.month) - new Date(b.month)).slice(-8)
  }, [transactions])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: '#1A1A2E', border: '1px solid var(--border)', borderRadius: 8, padding: '0.7rem 1rem', fontSize: '0.8rem' }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>{label}</div>
          {payload.map(p => (
            <div key={p.name} style={{ color: p.color, fontFamily: 'var(--font-mono)' }}>
              {p.name}: {formatAmount(p.value)}
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (!data.length) return <EmptyChart />

  return (
    <RC2 width="100%" height={280}>
      <LineChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
        <LTooltip content={<CustomTooltip />} />
        <LL formatter={val => <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{val}</span>} />
        <Line type="monotone" dataKey="income" stroke="#F5A623" strokeWidth={2.5} dot={{ fill: '#F5A623', r: 4 }} name="Income" />
        <Line type="monotone" dataKey="expense" stroke="#FF4B6E" strokeWidth={2.5} dot={{ fill: '#FF4B6E', r: 4 }} name="Expense" />
      </LineChart>
    </RC2>
  )
}

// ---- Income vs Expense Bar Chart ----
import { BarChart, Bar, XAxis as BXAxis, YAxis as BYAxis, CartesianGrid as BCG, Tooltip as BT, ResponsiveContainer as BR, Legend as BL } from 'recharts'

export function IncomeExpenseBar() {
  const { transactions } = useFinance()
  const { formatAmount } = useCurrency()

  const data = React.useMemo(() => {
    const map = {}
    transactions.forEach(t => {
      if (!t.date) return
      const month = format(startOfMonth(parseISO(t.date)), 'MMM')
      if (!map[month]) map[month] = { month, Income: 0, Expense: 0 }
      if (t.type === 'income') map[month].Income += t.amount
      else map[month].Expense += t.amount
    })
    return Object.values(map).slice(-6)
  }, [transactions])

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: '#1A1A2E', border: '1px solid var(--border)', borderRadius: 8, padding: '0.7rem 1rem', fontSize: '0.8rem' }}>
          <div style={{ color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: 600 }}>{label}</div>
          {payload.map(p => (
            <div key={p.name} style={{ color: p.color, fontFamily: 'var(--font-mono)' }}>
              {p.name}: {formatAmount(p.value)}
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (!data.length) return <EmptyChart />

  return (
    <BR width="100%" height={280}>
      <BarChart data={data} margin={{ top: 5, right: 10, bottom: 5, left: 10 }} barGap={4}>
        <BCG strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <BXAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <BYAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
        <BT content={<CustomTooltip />} />
        <BL formatter={val => <span style={{ color: 'var(--text-secondary)', fontSize: '0.78rem' }}>{val}</span>} />
        <Bar dataKey="Income" fill="#F5A623" radius={[4, 4, 0, 0]} maxBarSize={36} />
        <Bar dataKey="Expense" fill="#FF4B6E" radius={[4, 4, 0, 0]} maxBarSize={36} />
      </BarChart>
    </BR>
  )
}

function EmptyChart() {
  return (
    <div className="empty-state" style={{ height: 280 }}>
      <div className="empty-state-icon">📊</div>
      <h3>No data yet</h3>
      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Add transactions to see charts</p>
    </div>
  )
}
