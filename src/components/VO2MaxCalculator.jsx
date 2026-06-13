import React, { useState } from 'react'
import Field from './Field.jsx'
import {
  calcVO2Max,
  getRating,
  getAllNorms,
  lbsToKg,
  validateVO2Inputs,
} from '../utils/vo2max.js'

const SECTION = {
  background: 'var(--color-surface)',
  border: '1px solid var(--color-border)',
  borderRadius: 'var(--radius-lg)',
  padding: '1.5rem',
  marginBottom: '1rem',
}

const SECTION_LABEL = {
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: 'var(--color-text-tertiary)',
  marginBottom: '1.25rem',
}

const GRID = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
  gap: '1rem',
}

export default function VO2MaxCalculator() {
  const [units, setUnits] = useState('metric')
  const [age, setAge] = useState('')
  const [sex, setSex] = useState('')
  const [weight, setWeight] = useState('')
  const [mins, setMins] = useState('')
  const [secs, setSecs] = useState('')
  const [heartRate, setHR] = useState('')
  const [result, setResult] = useState(null)
  const [errors, setErrors] = useState([])

  function handleCalculate() {
    const validation = validateVO2Inputs({
      age: Number(age),
      sex,
      weight: Number(weight),
      mins: Number(mins) || 0,
      secs: Number(secs) || 0,
      heartRate: Number(heartRate),
    })

    if (validation.length > 0) {
      setErrors(validation)
      setResult(null)
      return
    }

    setErrors([])

    const weightKg = units === 'metric' ? Number(weight) : lbsToKg(Number(weight))
    const timeMin = (Number(mins) || 0) + (Number(secs) || 0) / 60
    const vo2 = calcVO2Max({
      weightKg,
      age: Number(age),
      sex,
      timeMin,
      heartRate: Number(heartRate),
    })

    const rating = getRating(vo2, Number(age), sex)
    const allNorms = getAllNorms(Number(age), sex)

    setResult({ vo2: Math.round(vo2 * 10) / 10, rating, allNorms })

    setTimeout(() => {
      document.getElementById('pc-result')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  function handleReset() {
    setAge(''); setSex(''); setWeight('')
    setMins(''); setSecs(''); setHR('')
    setResult(null); setErrors([])
  }

  const toggleBtn = (active) => ({
    flex: 1,
    padding: '8px 12px',
    fontSize: 13,
    fontWeight: 500,
    fontFamily: 'var(--font-sans)',
    border: '1px solid var(--color-border)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    transition: 'all 0.15s',
    background: active ? 'var(--color-accent)' : 'transparent',
    color: active ? 'var(--color-accent-fg)' : 'var(--color-text-secondary)',
  })

  return (
    <div>
      {/* Units Toggle */}
      <div style={SECTION}>
        <p style={SECTION_LABEL}>Units</p>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={toggleBtn(units === 'metric')} onClick={() => setUnits('metric')}>
            Metric — kg / cm
          </button>
          <button style={toggleBtn(units === 'imperial')} onClick={() => setUnits('imperial')}>
            Imperial — lbs / in
          </button>
        </div>
      </div>

      {/* Personal Info */}
      <div style={SECTION}>
        <p style={SECTION_LABEL}>Personal information</p>
        <div style={GRID}>
          <Field label="Age (years)" hint="18–80">
            <input
              type="number" min="18" max="80"
              placeholder="e.g. 35"
              value={age}
              onChange={e => setAge(e.target.value)}
            />
          </Field>
          <Field label="Biological sex">
            <select value={sex} onChange={e => setSex(e.target.value)}>
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>
          <Field label={units === 'metric' ? 'Weight (kg)' : 'Weight (lbs)'}>
            <input
              type="number" min="20" max="400"
              placeholder={units === 'metric' ? 'e.g. 75' : 'e.g. 165'}
              value={weight}
              onChange={e => setWeight(e.target.value)}
            />
          </Field>
        </div>
      </div>

      {/* Walk Time */}
      <div style={SECTION}>
        <p style={SECTION_LABEL}>1-mile walk time</p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Walk exactly 1 mile (1.609 km) at a brisk but sustainable pace. Record your total time below.
        </p>
        <div style={{ ...GRID, gridTemplateColumns: '1fr 1fr' }}>
          <Field label="Minutes" hint="0–59">
            <input
              type="number" min="0" max="59"
              placeholder="e.g. 14"
              value={mins}
              onChange={e => setMins(e.target.value)}
            />
          </Field>
          <Field label="Seconds" hint="0–59">
            <input
              type="number" min="0" max="59"
              placeholder="e.g. 30"
              value={secs}
              onChange={e => setSecs(e.target.value)}
            />
          </Field>
        </div>
      </div>

      {/* Heart Rate */}
      <div style={SECTION}>
        <p style={SECTION_LABEL}>Post-walk heart rate</p>
        <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: '1.25rem', lineHeight: 1.6 }}>
          Measure your pulse immediately upon completing the walk — within the first 10 seconds. Count for 15 seconds and multiply by 4.
        </p>
        <div style={{ maxWidth: 220 }}>
          <Field label="Heart rate (bpm)">
            <div style={{ position: 'relative' }}>
              <input
                type="number" min="40" max="220"
                placeholder="e.g. 148"
                value={heartRate}
                onChange={e => setHR(e.target.value)}
                style={{ paddingRight: 44 }}
              />
              <span style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 12, color: 'var(--color-text-tertiary)',
                pointerEvents: 'none',
              }}>bpm</span>
            </div>
          </Field>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <div style={{
          background: 'var(--color-danger-bg)',
          border: '1px solid rgba(162,45,45,0.2)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          marginBottom: '1rem',
        }}>
          {errors.map((e, i) => (
            <p key={i} style={{ fontSize: 13, color: 'var(--color-danger-text)', marginBottom: i < errors.length - 1 ? 6 : 0 }}>
              <i className="ti ti-alert-circle" style={{ marginRight: 6, verticalAlign: -2 }} />
              {e}
            </p>
          ))}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 10, marginBottom: '1.5rem' }}>
        <button
          onClick={handleCalculate}
          style={{
            flex: 1, padding: '13px 20px',
            fontSize: 15, fontWeight: 600,
            fontFamily: 'var(--font-sans)',
            background: 'var(--color-accent)',
            color: 'var(--color-accent-fg)',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
            transition: 'opacity 0.15s',
            letterSpacing: '0.01em',
          }}
          onMouseOver={e => e.currentTarget.style.opacity = '0.85'}
          onMouseOut={e => e.currentTarget.style.opacity = '1'}
        >
          <i className="ti ti-calculator" style={{ marginRight: 8, verticalAlign: -2 }} />
          Calculate VO₂ Max
        </button>
        <button
          onClick={handleReset}
          style={{
            padding: '13px 18px',
            fontSize: 14, fontWeight: 500,
            fontFamily: 'var(--font-sans)',
            background: 'transparent',
            color: 'var(--color-text-secondary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            cursor: 'pointer',
          }}
        >
          <i className="ti ti-refresh" style={{ verticalAlign: -2 }} />
        </button>
      </div>

      {/* Result */}
      {result && <ResultPanel result={result} />}
    </div>
  )
}

function ResultPanel({ result }) {
  const { vo2, rating, allNorms } = result

  return (
    <div id="pc-result" style={{
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: 'var(--radius-lg)',
      padding: '1.75rem',
      marginTop: '0.5rem',
    }}>
      <p style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '1.25rem' }}>
        Your result
      </p>

      {/* Big number */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 6 }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 64,
          fontWeight: 500,
          lineHeight: 1,
          color: 'var(--color-text-primary)',
        }}>{vo2}</span>
        <span style={{ fontSize: 16, color: 'var(--color-text-secondary)' }}>mL/kg/min</span>
      </div>

      <p style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: '1.25rem' }}>
        Estimated VO₂ Max — Rockport 1-Mile Walk Test
      </p>

      {/* Rating badge */}
      <span style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '5px 14px',
        borderRadius: 20,
        fontSize: 14, fontWeight: 600,
        background: rating.bg,
        color: rating.color,
        marginBottom: '1.75rem',
      }}>
        <i className="ti ti-award" style={{ fontSize: 16 }} />
        {rating.label} — {rating.description}
      </span>

      {/* Zone bars */}
      <p style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--color-text-tertiary)', marginBottom: '0.75rem' }}>
        Fitness rating scale (age &amp; sex adjusted)
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: '1.5rem' }}>
        {allNorms.map((norm, i) => {
          const isYou = norm.label === rating.label
          const nextMin = i > 0 ? allNorms[i - 1].min : 99
          const rangeLabel = i === 0 ? `${norm.min}+` : `${norm.min}–${nextMin - 1}`
          return (
            <div key={norm.label} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              background: isYou ? norm.bg : 'var(--color-surface-raised)',
              border: `1px solid ${isYou ? norm.color + '44' : 'var(--color-border)'}`,
              transition: 'all 0.15s',
            }}>
              <span style={{
                fontSize: 13, fontWeight: isYou ? 600 : 400,
                color: isYou ? norm.color : 'var(--color-text-primary)',
                minWidth: 80,
              }}>{norm.label}</span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                color: isYou ? norm.color : 'var(--color-text-tertiary)',
                minWidth: 60,
              }}>{rangeLabel}</span>
              {isYou && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 12, fontWeight: 600,
                  color: norm.color,
                  display: 'flex', alignItems: 'center', gap: 4,
                }}>
                  <i className="ti ti-arrow-left" style={{ fontSize: 12 }} /> You
                </span>
              )}
            </div>
          )
        })}
      </div>

      {/* Formula note */}
      <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', lineHeight: 1.6, borderTop: '1px solid var(--color-border)', paddingTop: '1rem' }}>
        <strong>Formula:</strong> Kline et al. (1987) — validated for ages 30–69. Norms: ACSM Guidelines for Exercise Testing and Prescription, 11th ed.
        Results are estimates only. Consult a qualified healthcare professional for clinical assessment.
      </p>
    </div>
  )
}
