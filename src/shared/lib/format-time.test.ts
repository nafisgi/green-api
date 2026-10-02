import { describe, expect, it } from 'vitest'

import { formatMessageTime } from './format-time'

describe('formatMessageTime', () => {
  it('formats local message time as hours and minutes', () => {
    const timestamp = new Date(2024, 0, 2, 9, 5).getTime()
    expect(formatMessageTime(timestamp)).toBe('09:05')
  })
})
