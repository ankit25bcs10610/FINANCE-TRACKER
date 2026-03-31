import React from 'react'
import { EXPENSE_CATEGORIES } from '../../utils/currencyFormatter'

export default function Filters({ filters, setFilters }) {
  const update = (key, val) => setFilters(prev => ({ ...prev, [key]: val }))

  const selectStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '0.8rem',
    padding: '0.55rem 0.8rem',
    cursor: 'pointer',
    outline: 'none',
    transition: 'var(--transition)',
  }

  return (
    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
      {/* Category */}
      <select
        style={selectStyle}
        value={filters.category}
        onChange={e => update('category', e.target.value)}
      >
        <option value="">All Categories</option>
        {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
      </select>

      {/* Type */}
      <select
        style={selectStyle}
        value={filters.type}
        onChange={e => update('type', e.target.value)}
      >
        <option value="">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      {/* Sort By */}
      <select
        style={selectStyle}
        value={filters.sortBy}
        onChange={e => update('sortBy', e.target.value)}
      >
        <option value="date">Sort: Date</option>
        <option value="amount">Sort: Amount</option>
        <option value="category">Sort: Category</option>
      </select>

      {/* Sort Direction */}
      <select
        style={selectStyle}
        value={filters.sortDir}
        onChange={e => update('sortDir', e.target.value)}
      >
        <option value="desc">↓ Descending</option>
        <option value="asc">↑ Ascending</option>
      </select>

      {/* Date From */}
      <input
        type="date"
        style={{ ...selectStyle, colorScheme: 'dark' }}
        value={filters.dateFrom}
        onChange={e => update('dateFrom', e.target.value)}
        placeholder="From date"
      />

      {/* Date To */}
      <input
        type="date"
        style={{ ...selectStyle, colorScheme: 'dark' }}
        value={filters.dateTo}
        onChange={e => update('dateTo', e.target.value)}
      />

      {/* Clear Filters */}
      {(filters.category || filters.type || filters.dateFrom || filters.dateTo) && (
        <button
          className="btn btn-ghost"
          style={{ fontSize: '0.78rem', padding: '0.45rem 0.75rem' }}
          onClick={() => setFilters(prev => ({ ...prev, category: '', type: '', dateFrom: '', dateTo: '' }))}
        >
          Clear Filters
        </button>
      )}
    </div>
  )
}
