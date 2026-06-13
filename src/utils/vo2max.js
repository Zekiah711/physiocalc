/**
 * Rockport 1-Mile Walk Test — VO2 Max Estimation
 * Formula: Kline et al. (1987)
 * VO2max = 132.853 - (0.1692 × weight_kg) - (0.3877 × age)
 *          + (6.315 × sex) - (3.2649 × time_min) - (0.1565 × hr)
 *
 * sex: male = 1, female = 0
 * Validated for ages 30–69, general adult population
 */
export function calcVO2Max({ weightKg, age, sex, timeMin, heartRate }) {
  const sexVal = sex === 'male' ? 1 : 0
  return (
    132.853 -
    0.1692 * weightKg -
    0.3877 * age +
    6.315 * sexVal -
    3.2649 * timeMin -
    0.1565 * heartRate
  )
}

/**
 * Fitness rating norms — ACSM (American College of Sports Medicine)
 * Source: ACSM's Guidelines for Exercise Testing and Prescription, 11th ed.
 * Values in mL/kg/min
 *
 * Structure: { min, label, description, colorClass }
 * Ordered highest to lowest — first match wins.
 */
const NORMS = {
  male: {
    '20-29': [
      { min: 55, label: 'Superior',   description: 'Elite / athlete level' },
      { min: 51, label: 'Excellent',  description: 'Well above average' },
      { min: 45, label: 'Good',       description: 'Above average' },
      { min: 38, label: 'Fair',       description: 'Average' },
      { min: 35, label: 'Poor',       description: 'Below average' },
      { min: 0,  label: 'Very Poor',  description: 'Significantly below average' },
    ],
    '30-39': [
      { min: 51, label: 'Superior',   description: 'Elite / athlete level' },
      { min: 47, label: 'Excellent',  description: 'Well above average' },
      { min: 41, label: 'Good',       description: 'Above average' },
      { min: 34, label: 'Fair',       description: 'Average' },
      { min: 31, label: 'Poor',       description: 'Below average' },
      { min: 0,  label: 'Very Poor',  description: 'Significantly below average' },
    ],
    '40-49': [
      { min: 48, label: 'Superior',   description: 'Elite / athlete level' },
      { min: 43, label: 'Excellent',  description: 'Well above average' },
      { min: 37, label: 'Good',       description: 'Above average' },
      { min: 30, label: 'Fair',       description: 'Average' },
      { min: 27, label: 'Poor',       description: 'Below average' },
      { min: 0,  label: 'Very Poor',  description: 'Significantly below average' },
    ],
    '50-59': [
      { min: 45, label: 'Superior',   description: 'Elite / athlete level' },
      { min: 39, label: 'Excellent',  description: 'Well above average' },
      { min: 33, label: 'Good',       description: 'Above average' },
      { min: 26, label: 'Fair',       description: 'Average' },
      { min: 23, label: 'Poor',       description: 'Below average' },
      { min: 0,  label: 'Very Poor',  description: 'Significantly below average' },
    ],
    '60-69': [
      { min: 42, label: 'Superior',   description: 'Elite / athlete level' },
      { min: 36, label: 'Excellent',  description: 'Well above average' },
      { min: 30, label: 'Good',       description: 'Above average' },
      { min: 23, label: 'Fair',       description: 'Average' },
      { min: 20, label: 'Poor',       description: 'Below average' },
      { min: 0,  label: 'Very Poor',  description: 'Significantly below average' },
    ],
  },
  female: {
    '20-29': [
      { min: 49, label: 'Superior',   description: 'Elite / athlete level' },
      { min: 45, label: 'Excellent',  description: 'Well above average' },
      { min: 38, label: 'Good',       description: 'Above average' },
      { min: 31, label: 'Fair',       description: 'Average' },
      { min: 28, label: 'Poor',       description: 'Below average' },
      { min: 0,  label: 'Very Poor',  description: 'Significantly below average' },
    ],
    '30-39': [
      { min: 45, label: 'Superior',   description: 'Elite / athlete level' },
      { min: 41, label: 'Excellent',  description: 'Well above average' },
      { min: 34, label: 'Good',       description: 'Above average' },
      { min: 27, label: 'Fair',       description: 'Average' },
      { min: 24, label: 'Poor',       description: 'Below average' },
      { min: 0,  label: 'Very Poor',  description: 'Significantly below average' },
    ],
    '40-49': [
      { min: 42, label: 'Superior',   description: 'Elite / athlete level' },
      { min: 37, label: 'Excellent',  description: 'Well above average' },
      { min: 30, label: 'Good',       description: 'Above average' },
      { min: 24, label: 'Fair',       description: 'Average' },
      { min: 20, label: 'Poor',       description: 'Below average' },
      { min: 0,  label: 'Very Poor',  description: 'Significantly below average' },
    ],
    '50-59': [
      { min: 38, label: 'Superior',   description: 'Elite / athlete level' },
      { min: 33, label: 'Excellent',  description: 'Well above average' },
      { min: 27, label: 'Good',       description: 'Above average' },
      { min: 21, label: 'Fair',       description: 'Average' },
      { min: 17, label: 'Poor',       description: 'Below average' },
      { min: 0,  label: 'Very Poor',  description: 'Significantly below average' },
    ],
    '60-69': [
      { min: 35, label: 'Superior',   description: 'Elite / athlete level' },
      { min: 30, label: 'Excellent',  description: 'Well above average' },
      { min: 24, label: 'Good',       description: 'Above average' },
      { min: 18, label: 'Fair',       description: 'Average' },
      { min: 15, label: 'Poor',       description: 'Below average' },
      { min: 0,  label: 'Very Poor',  description: 'Significantly below average' },
    ],
  },
}

const RATING_STYLES = {
  'Superior':   { bg: '#eaf3de', color: '#27500a' },
  'Excellent':  { bg: '#c0dd97', color: '#27500a' },
  'Good':       { bg: '#faeeda', color: '#633806' },
  'Fair':       { bg: '#fac775', color: '#633806' },
  'Poor':       { bg: '#f7c1c1', color: '#791f1f' },
  'Very Poor':  { bg: '#f09595', color: '#791f1f' },
}

function getAgeBand(age) {
  if (age < 30) return '20-29'
  if (age < 40) return '30-39'
  if (age < 50) return '40-49'
  if (age < 60) return '50-59'
  return '60-69'
}

export function getRating(vo2, age, sex) {
  const band = getAgeBand(age)
  const norms = NORMS[sex][band]
  const match = norms.find(n => vo2 >= n.min)
  const rating = match || norms[norms.length - 1]
  return {
    ...rating,
    ...RATING_STYLES[rating.label],
  }
}

export function getAllNorms(age, sex) {
  const band = getAgeBand(age)
  return NORMS[sex][band].map(n => ({ ...n, ...RATING_STYLES[n.label] }))
}

/**
 * Convert lbs → kg
 */
export function lbsToKg(lbs) {
  return lbs * 0.453592
}

/**
 * Validate all inputs, returns array of error strings (empty = valid)
 */
export function validateVO2Inputs({ age, sex, weight, mins, secs, heartRate }) {
  const errors = []
  if (!age || isNaN(age) || age < 18 || age > 80)
    errors.push('Age must be between 18 and 80.')
  if (!sex)
    errors.push('Please select biological sex.')
  if (!weight || isNaN(weight) || weight <= 0)
    errors.push('Please enter a valid weight.')
  if ((!mins && !secs) || (isNaN(mins) && isNaN(secs)))
    errors.push('Please enter your walk time.')
  if (!heartRate || isNaN(heartRate) || heartRate < 40 || heartRate > 220)
    errors.push('Heart rate must be between 40 and 220 bpm.')
  return errors
}
