import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiDashboardLine, RiExchangeDollarLine, RiAddCircleLine,
  RiPieChartLine, RiBarChartBoxLine, RiMenuLine, RiCloseLine,
  RiSparklingLine
} from 'react-icons/ri'

const navItems = [
  { path: '/dashboard',          label: 'Dashboard',     icon: <RiDashboardLine /> },
  { path: '/transactions',       label: 'Transactions',  icon: <RiExchangeDollarLine /> },
  { path: '/transactions/new',   label: 'Add New',       icon: <RiAddCircleLine /> },
  { path: '/budget',             label: 'Budget',        icon: <RiPieChartLine /> },
  { path: '/analytics',          label: 'Analytics',     icon: <RiBarChartBoxLine /> },
]

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const SidebarContent = () => (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: '1.5rem 1rem',
    }}>
      {/* Logo */}
      <div style={{ padding: '0 0.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 36, height: 36,
            background: 'linear-gradient(135deg, var(--accent), #007A5E)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#030A07', fontSize: '1rem',
          }}>
            <RiSparklingLine />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.3px', color: 'var(--text-primary)' }}>
              FinTrack
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500 }}>
              Finance Analytics
            </div>
          </div>
        </div>
      </div>

      {/* Nav Links */}
      <nav style={{ flex: 1, paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => setMobileOpen(false)}
            end={item.path === '/transactions'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.7rem 1rem',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              fontSize: '0.875rem',
              fontWeight: isActive ? 600 : 400,
              color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
              background: isActive ? 'var(--accent-dim)' : 'transparent',
              border: `1px solid ${isActive ? 'var(--border-accent)' : 'transparent'}`,
              transition: 'var(--transition)',
              position: 'relative',
            })}
          >
            <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div style={{
        paddingTop: '1.5rem',
        borderTop: '1px solid var(--border)',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        textAlign: 'center',
        lineHeight: 1.6,
      }}>
        <div>Built with React + Recharts</div>
        <div style={{ color: 'var(--accent)', marginTop: '0.2rem' }}>v1.0.0</div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Sidebar */}
      <aside style={{
        width: 'var(--sidebar-width)',
        position: 'fixed',
        top: 0, left: 0, bottom: 0,
        background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
        className="hide-mobile"
      >
        <SidebarContent />
      </aside>

      {/* Mobile Top Bar */}
      <div style={{
        display: 'none',
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 60,
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border)',
        zIndex: 200,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 1rem',
      }}
        className="show-mobile"
      >
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, color: 'var(--accent)' }}>
          FinTrack
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          style={{ background: 'none', border: 'none', color: 'var(--text-primary)', fontSize: '1.4rem', cursor: 'pointer' }}
        >
          <RiMenuLine />
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 300 }}
            />
            <motion.div
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                position: 'fixed', top: 0, left: 0, bottom: 0, width: 280,
                background: 'var(--bg-secondary)',
                borderRight: '1px solid var(--border)',
                zIndex: 400,
              }}
            >
              <button
                onClick={() => setMobileOpen(false)}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'none', border: 'none', color: 'var(--text-secondary)',
                  fontSize: '1.3rem', cursor: 'pointer',
                }}
              >
                <RiCloseLine />
              </button>
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 900px) {
          .hide-mobile { display: none !important; }
          .show-mobile { display: flex !important; }
        }
        @media (min-width: 901px) {
          .show-mobile { display: none !important; }
        }
      `}</style>
    </>
  )
}
