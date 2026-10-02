import type { ReactNode } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { RouteFallback } from './RouteFallback'

export const RouteBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary FallbackComponent={RouteFallback}>{children}</ErrorBoundary>
  )
}
