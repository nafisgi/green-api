const GREEN_API_HOST =
  /^(?:(?:[a-z0-9-]+\.)?api\.green-api\.com|api\.greenapi\.com)$/

export const isGreenApiUrl = (value: string): boolean => {
  let url: URL
  try {
    url = new URL(value)
  } catch {
    return false
  }

  return (
    url.protocol === 'https:' &&
    GREEN_API_HOST.test(url.hostname) &&
    url.port === '' &&
    url.username === '' &&
    url.password === '' &&
    url.pathname === '/' &&
    url.search === '' &&
    url.hash === ''
  )
}
