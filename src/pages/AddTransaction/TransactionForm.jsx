import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { RiCheckLine } from 'react-icons/ri'
import { useFinance } from '../../context/FinanceContext'
import { EXPENSE_CATEGORIES } from '../../utils/currencyFormatter'
import { format } from 'date-fns'

const schema = yup.object({
  title:    yup.string().required('Title is required').min(2, 'Min 2 characters'),
  amount:   yup.number().typeError('Must be a number').positive('Must be positive').required('Amount is required'),
  category: yup.string().required('Category is required'),
  type:     yup.string().oneOf(['income', 'expense']).required('Type is required'),
  date:     yup.string().required('Date is required'),
  notes:    yup.string().optional(),
  recurring: yup.boolean(),
})

export default function TransactionForm({ defaultValues, isEditing = false, onSuccess }) {
  const { addTransaction, updateTransaction } = useFinance()
  const navigate = useNavigate()

  const today = format(new Date(), 'yyyy-MM-dd')

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaultValues || {
      title: '', amount: '', category: '', type: 'expense',
      date: today, notes: '', recurring: false,
    },
  })

  const selectedType = watch('type')

  const onSubmit = async (data) => {
    if (isEditing && defaultValues?.id) {
      updateTransaction(defaultValues.id, data)
    } else {
      addTransaction(data)
    }
    if (onSuccess) onSuccess()
    else navigate('/transactions')
  }

  const typeTab = (type, label) => (
    <button
      type="button"
      onClick={() => {}}
      style={{
        flex: 1, padding: '0.65rem',
        background: selectedType === type
          ? (type === 'income' ? 'var(--gold-dim)' : 'var(--red-dim)')
          : 'transparent',
        border: `1px solid ${selectedType === type
          ? (type === 'income' ? 'rgba(245,166,35,0.3)' : 'rgba(255,75,110,0.3)')
          : 'var(--border)'}`,
        color: selectedType === type
          ? (type === 'income' ? 'var(--gold)' : 'var(--red)')
          : 'var(--text-secondary)',
        borderRadius: 'var(--radius-sm)',
        cursor: 'pointer',
        fontWeight: 600,
        fontSize: '0.85rem',
        transition: 'var(--transition)',
        fontFamily: 'var(--font-body)',
      }}
    >
      {label}
    </button>
  )

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Type Toggle */}
      <div className="form-group">
        <label className="form-label">Transaction Type</label>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <label style={{ flex: 1 }}>
            <input type="radio" value="expense" {...register('type')} style={{ display: 'none' }} />
            <div style={{
              padding: '0.65rem', textAlign: 'center', cursor: 'pointer',
              background: selectedType === 'expense' ? 'var(--red-dim)' : 'transparent',
              border: `1px solid ${selectedType === 'expense' ? 'rgba(255,75,110,0.3)' : 'var(--border)'}`,
              color: selectedType === 'expense' ? 'var(--red)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.85rem',
              transition: 'var(--transition)',
            }}>
              💸 Expense
            </div>
          </label>
          <label style={{ flex: 1 }}>
            <input type="radio" value="income" {...register('type')} style={{ display: 'none' }} />
            <div style={{
              padding: '0.65rem', textAlign: 'center', cursor: 'pointer',
              background: selectedType === 'income' ? 'var(--gold-dim)' : 'transparent',
              border: `1px solid ${selectedType === 'income' ? 'rgba(245,166,35,0.3)' : 'var(--border)'}`,
              color: selectedType === 'income' ? 'var(--gold)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)', fontWeight: 600, fontSize: '0.85rem',
              transition: 'var(--transition)',
            }}>
              💰 Income
            </div>
          </label>
        </div>
        {errors.type && <span className="form-error">{errors.type.message}</span>}
      </div>

      {/* Title + Amount */}
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" placeholder="e.g. Netflix Subscription" {...register('title')} />
          {errors.title && <span className="form-error">{errors.title.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input className="form-input" type="number" placeholder="0.00" step="0.01" {...register('amount')} />
          {errors.amount && <span className="form-error">{errors.amount.message}</span>}
        </div>
      </div>

      {/* Category + Date */}
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label">Category</label>
          <select className="form-select" {...register('category')}>
            <option value="">Select category</option>
            {selectedType === 'income'
              ? <option value="Income">Income</option>
              : EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)
            }
          </select>
          {errors.category && <span className="form-error">{errors.category.message}</span>}
        </div>
        <div className="form-group">
          <label className="form-label">Date</label>
          <input className="form-input" type="date" style={{ colorScheme: 'dark' }} {...register('date')} />
          {errors.date && <span className="form-error">{errors.date.message}</span>}
        </div>
      </div>

      {/* Notes */}
      <div className="form-group">
        <label className="form-label">Notes (optional)</label>
        <textarea className="form-textarea" placeholder="Add any extra details..." {...register('notes')} />
      </div>

      {/* Recurring */}
      <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
        <div style={{ position: 'relative' }}>
          <input type="checkbox" {...register('recurring')} style={{ display: 'none' }} id="recurring-check" />
          <div style={{
            width: 20, height: 20,
            background: watch('recurring') ? 'var(--accent)' : 'transparent',
            border: `2px solid ${watch('recurring') ? 'var(--accent)' : 'var(--border)'}`,
            borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'var(--transition)',
            color: '#030A07', fontSize: '0.75rem',
          }}>
            {watch('recurring') && <RiCheckLine />}
          </div>
        </div>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', userSelect: 'none' }}>
          This is a recurring transaction
        </span>
      </label>

      <motion.button
        type="submit"
        className="btn btn-primary"
        disabled={isSubmitting}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        style={{ marginTop: '0.5rem', padding: '0.9rem', fontSize: '0.95rem', justifyContent: 'center' }}
      >
        {isSubmitting ? 'Saving...' : isEditing ? '✓ Update Transaction' : '+ Save Transaction'}
      </motion.button>
    </form>
  )
}
