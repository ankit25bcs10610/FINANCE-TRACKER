import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { RiAddCircleLine, RiCloseLine } from 'react-icons/ri'
import { useTransactions } from '../../hooks/useTransactions'
import { useDebounce } from '../../hooks/useDebounce'
import TransactionCard from '../../components/TransactionCard/TransactionCard'
import SearchBar from '../../components/SearchBar/SearchBar'
import Filters from '../../components/Filters/Filters'
import TransactionForm from '../AddTransaction/TransactionForm'

export default function Transactions() {
  const [rawSearch, setRawSearch] = useState('')
  const [filters, setFilters] = useState({ category: '', type: '', sortBy: 'date', sortDir: 'desc', dateFrom: '', dateTo: '' })
  const [editingTransaction, setEditingTransaction] = useState(null)

  const search = useDebounce(rawSearch, 350)
  const { transactions } = useTransactions({ search, ...filters })

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div className="page-header" style={{ margin: 0 }}>
          <h1 className="page-title">Transactions</h1>
          <p className="page-subtitle">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found</p>
        </div>
        <Link to="/transactions/new" className="btn btn-primary">
          <RiAddCircleLine /> Add New
        </Link>
      </motion.div>

      {/* Search + Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}
        className="card" style={{ marginBottom: '1.5rem' }}
      >
        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <SearchBar value={rawSearch} onChange={setRawSearch} />
        </div>
        <Filters filters={filters} setFilters={setFilters} />
      </motion.div>

      {/* List */}
      <AnimatePresence mode="popLayout">
        {transactions.length === 0 ? (
          <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="empty-state card">
              <div className="empty-state-icon">🔍</div>
              <h3>No transactions found</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                Try adjusting your search or filters
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          >
            {transactions.map(t => (
              <TransactionCard key={t.id} transaction={t} onEdit={setEditingTransaction} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <AnimatePresence>
        {editingTransaction && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0,
              background: 'rgba(0,0,0,0.7)',
              zIndex: 500,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
            }}
            onClick={(e) => { if (e.target === e.currentTarget) setEditingTransaction(null) }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                width: '100%',
                maxWidth: 600,
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem' }}>Edit Transaction</h2>
                <button
                  onClick={() => setEditingTransaction(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1.3rem' }}
                >
                  <RiCloseLine />
                </button>
              </div>
              <TransactionForm
                defaultValues={editingTransaction}
                isEditing
                onSuccess={() => setEditingTransaction(null)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
