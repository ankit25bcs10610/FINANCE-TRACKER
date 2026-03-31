import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { RiEditLine, RiDeleteBinLine, RiRepeatLine } from 'react-icons/ri'
import { CATEGORY_ICONS, CATEGORY_COLORS } from '../../utils/currencyFormatter'
import { useCurrency } from '../../hooks/useCurrency'
import { useFinance } from '../../context/FinanceContext'

export default function TransactionCard({ transaction, onEdit }) {
  const { deleteTransaction } = useFinance()
  const { formatAmount } = useCurrency()
  const [confirming, setConfirming] = useState(false)

  const { id, title, amount, category, type, date, notes, recurring } = transaction
  const icon = CATEGORY_ICONS[category] || '💳'
  const color = CATEGORY_COLORS[category] || '#B2BEC3'
  const isIncome = type === 'income'

  const handleDelete = () => {
    if (confirming) {
      deleteTransaction(id)
    } else {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 3000)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        padding: '1rem 1.25rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        transition: 'var(--transition)',
        cursor: 'default',
      }}
      whileHover={{ borderColor: 'rgba(255,255,255,0.12)', background: 'var(--bg-card-hover)' }}
    >
      {/* Icon */}
      <div style={{
        width: 44, height: 44, flexShrink: 0,
        borderRadius: 12,
        background: `${color}18`,
        border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.2rem',
      }}>
        {icon}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          marginBottom: '0.2rem',
        }}>
          <span style={{
            fontWeight: 500, fontSize: '0.9rem',
            color: 'var(--text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {title}
          </span>
          {recurring && (
            <span className="badge badge-recurring" style={{ flexShrink: 0 }}>
              <RiRepeatLine /> Recurring
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.75rem', padding: '0.15rem 0.5rem',
            borderRadius: '99px',
            background: `${color}18`, color,
            fontWeight: 600,
          }}>
            {category}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {date ? format(new Date(date + 'T00:00:00'), 'MMM d, yyyy') : ''}
          </span>
          {notes && (
            <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)', fontStyle: 'italic', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {notes}
            </span>
          )}
        </div>
      </div>

      {/* Amount */}
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontWeight: 600,
        fontSize: '1rem',
        color: isIncome ? 'var(--gold)' : 'var(--red)',
        flexShrink: 0,
        textAlign: 'right',
      }}>
        {isIncome ? '+' : '-'}{formatAmount(amount)}
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
        <button
          onClick={() => onEdit(transaction)}
          className="btn btn-ghost"
          style={{ padding: '0.4rem 0.6rem', fontSize: '0.95rem' }}
          title="Edit"
        >
          <RiEditLine />
        </button>
        <button
          onClick={handleDelete}
          className="btn btn-danger"
          style={{
            padding: '0.4rem 0.6rem', fontSize: '0.95rem',
            minWidth: confirming ? 80 : 'auto',
            fontSize: confirming ? '0.7rem' : '0.95rem',
          }}
          title="Delete"
        >
          {confirming ? 'Confirm?' : <RiDeleteBinLine />}
        </button>
      </div>
    </motion.div>
  )
}
