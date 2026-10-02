import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Suspense } from 'react'
import { RouterProvider } from 'react-router/dom'
import { Toaster } from 'sonner'

import { PageSkeleton } from './PageSkeleton'
import { queryClient } from './providers/query-client'
import { router } from './router'
import './styles/global.css'

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<PageSkeleton />}>
        <RouterProvider router={router} />
      </Suspense>
      <Toaster richColors position="top-right" />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App
