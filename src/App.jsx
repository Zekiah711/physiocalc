import React from 'react'
import VO2MaxCalculator from './components/VO2MaxCalculator.jsx'

const NAV_ITEMS = [
  { id: 'vo2', label: 'VO₂ Max', icon: 'ti-lungs', active: true },
  { id: 'bmi', label: 'BMI', icon: 'ti-scale', active: false },
  { id: 'bodyfat', label: 'Body Fat %', icon: 'ti-ruler-measure', active: false },
  { id: 'rmr', label: 'RMR', icon: 'ti-flame', active: false },
  { id: 'maxhr', label: 'Max HR', icon: 'ti-heart-rate-monitor', active: false },
]

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Top nav */}
      <header style={{
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-border)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{
          maxWidth: 780, margin: '0 auto',
          padding: '0 1.5rem',
          display: 'flex', alignItems: 'center', gap: 16,
          height: 56,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginRight: 8 }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="ti ti-activity" style={{ color: '#fff', fontSize: 16 }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em' }}>PhysioCalc</span>
          </div>

          {/* Nav tabs */}
          <nav style={{ display: 'flex', gap: 2, overflowX: 'auto' }}>
            {NAV_ITEMS.map(item => (
              <div key={item.id} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '5px 12px',
                borderRadius: 'var(--radius-md)',
                fontSize: 13, fontWeight: item.active ? 500 : 400,
                background: item.active ? 'var(--color-bg)' : 'transparent',
                color: item.active ? 'var(--color-text-primary)' : 'var(--color-text-tertiary)',
                cursor: item.active ? 'default' : 'not-allowed',
                whiteSpace: 'nowrap',
              }}>
                <i className={`ti ${item.icon}`} style={{ fontSize: 14 }} />
                {item.label}
                {!item.active && (
                  <span style={{
                    fontSize: 10, padding: '1px 5px', borderRadius: 4,
                    background: 'var(--color-border)', color: 'var(--color-text-tertiary)',
                  }}>Soon</span>
                )}
              </div>
            ))}
          </nav>
        </div>
      </header>

      {/* Main content */}
      <main style={{ maxWidth: 780, margin: '0 auto', padding: '2rem 1.5rem' }}>
        {/* Page header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{
              fontSize: 11, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--color-text-tertiary)',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              padding: '3px 10px', borderRadius: 20,
            }}>
              Rockport 1-Mile Walk Test
            </span>
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.02em', marginBottom: 8 }}>
            VO₂ Max Estimator
          </h1>
          <p style={{ fontSize: 14, color: 'var(--color-text-secondary)', lineHeight: 1.7, maxWidth: 560 }}>
            Estimate your maximal oxygen uptake using the validated Rockport protocol.
            Enter your details, walk 1 mile at a brisk pace, then record your time and heart rate.
          </p>
        </div>

        <VO2MaxCalculator />
      </main>

      <footer style={{
        maxWidth: 780, margin: '0 auto',
        padding: '1.5rem',
        borderTop: '1px solid var(--color-border)',
        marginTop: '2rem',
      }}>
        <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', textAlign: 'center' }}>
          PhysioCalc · For educational and fitness use only · Not a substitute for medical advice
        </p>
      </footer>
    </div>
  )
}
