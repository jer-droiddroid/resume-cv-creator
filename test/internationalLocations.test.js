import test from 'node:test'
import assert from 'node:assert/strict'
import {
  INTERNATIONAL_COUNTRIES,
  formatLocation,
  parseLocation,
} from '../src/data/internationalLocations.js'

test('INTERNATIONAL_COUNTRIES contains major countries with cities', () => {
  assert.ok(Array.isArray(INTERNATIONAL_COUNTRIES))
  assert.ok(INTERNATIONAL_COUNTRIES.length > 50)
  const ph = INTERNATIONAL_COUNTRIES.find((c) => c.name === 'Philippines')
  assert.ok(ph)
  assert.ok(ph.cities.includes('Manila'))
  assert.ok(ph.cities.includes('Quezon City'))
  assert.ok(ph.cities.includes('Cebu City'))
})

test('formatLocation formats city and country cleanly', () => {
  assert.equal(formatLocation('Philippines', 'Manila'), 'Manila, Philippines')
  assert.equal(formatLocation('Singapore', 'Singapore'), 'Singapore')
  assert.equal(formatLocation('Philippines', ''), 'Philippines')
  assert.equal(formatLocation('', 'Tokyo'), 'Tokyo')
  assert.equal(formatLocation('', ''), '')
})

test('parseLocation extracts country and city from combined strings', () => {
  const result1 = parseLocation('Manila, Philippines')
  assert.equal(result1.country, 'Philippines')
  assert.equal(result1.city, 'Manila')
  assert.equal(result1.isCustomCity, false)

  const result2 = parseLocation('San Francisco, CA, United States')
  assert.equal(result2.country, 'United States')
  assert.equal(result2.city, 'San Francisco, CA')

  const result3 = parseLocation('San Francisco, CA')
  assert.equal(result3.country, 'United States')
  assert.equal(result3.city, 'San Francisco, CA')

  const result4 = parseLocation('Random Unknown Village, Philippines')
  assert.equal(result4.country, 'Philippines')
  assert.equal(result4.city, 'Random Unknown Village')
  assert.equal(result4.isCustomCity, true)
})
