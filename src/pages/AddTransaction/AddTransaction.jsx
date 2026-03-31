import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiArrowLeftLine } from 'react-icons/ri'
import TransactionForm from './TransactionForm'

export default function AddTransaction() {
  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/transactions"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            color: 'var(--text-secondary)', textDecoration: 'none',
            fontSize: '0.85rem', marginBottom: '1.5rem',
            transition: 'var(--transition)',
          }}
        >
          <RiArrowLeftLine /> Back to Transactions
        </Link>

        <div className="page-header">
          <h1 className="page-title">Add Transaction</h1>
          <p className="page-subtitle">Record a new income or expense entry</p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{ maxWidth: 640 }}
      >
        <div className="card" style={{ padding: '2rem' }}>
          {/* Decorative top accent */}
          <div style={{
            height: 3, background: 'linear-gradient(90deg, var(--accent), transparent)',
            borderRadius: 99, marginBottom: '1.75rem', marginTop: '-0.25rem',
          }} />
          <TransactionForm />
        </div>
      </motion.div>
    </div>
  )
}
