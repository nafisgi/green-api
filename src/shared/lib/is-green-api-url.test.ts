import { describe, expect, it } from 'vitest'

import { isGreenApiUrl } from './is-green-api-url'

describe('isGreenApiUrl', () => {
  it('accepts GREEN-API hosts from instance settings', () => {
    expect(isGreenApiUrl('https://api.green-api.com')).toBe(true)
    expect(isGreenApiUrl('https://1103.api.green-api.com/')).toBe(true)
    expect(isGreenApiUrl('https://api.greenapi.com')).toBe(true)
  })

  it('rejects URLs that could send a token to another destination', () => {
    expect(isGreenApiUrl('https://example.com')).toBe(false)
    expect(isGreenApiUrl('http://api.green-api.com')).toBe(false)
    expect(isGreenApiUrl('https://api.green-api.com.evil.test')).toBe(false)
    expect(isGreenApiUrl('https://api.green-api.com@evil.test')).toBe(false)
    expect(isGreenApiUrl('https://api.green-api.com/other')).toBe(false)
  })
})
