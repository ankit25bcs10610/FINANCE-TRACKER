import React from 'react'
import { RiSearchLine, RiCloseLine } from 'react-icons/ri'

export default function SearchBar({ value, onChange, placeholder = 'Search transactions...' }) {
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <RiSearchLine style={{
        position: 'absolute', left: '0.85rem', top: '50%',
        transform: 'translateY(-50%)',
        color: 'var(--text-muted)', fontSize: '1rem',
        pointerEvents: 'none',
      }} />
      <input
        className="form-input"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ paddingLeft: '2.5rem', paddingRight: value ? '2.5rem' : '1rem' }}
      />
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute', right: '0.75rem', top: '50%',
            transform: 'translateY(-50%)',
            background: 'none', border: 'none',
            color: 'var(--text-muted)', cursor: 'pointer',
            fontSize: '1rem', display: 'flex', alignItems: 'center',
          }}
        >
          <RiCloseLine />
        </button>
      )}
    </div>
  )
}
