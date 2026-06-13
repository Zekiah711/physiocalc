import React from 'react'

export default function Field({ label, hint, error, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--color-text-secondary)',
        letterSpacing: '0.01em',
      }}>
        {label}
      </label>
      {children}
      {hint && !error && (
        <span style={{ fontSize: 12, color: 'var(--color-text-tertiary)' }}>{hint}</span>
      )}
      {error && (
        <span style={{ fontSize: 12, color: 'var(--color-danger-text)' }}>{error}</span>
      )}
    </div>
  )
}
