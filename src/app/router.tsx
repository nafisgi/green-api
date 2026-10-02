import { createBrowserRouter } from 'react-router'

import { PageSkeleton } from './PageSkeleton'
import { RouteError } from './RouteError'

export const router = createBrowserRouter(
  [
    {
      path: '/',
      HydrateFallback: PageSkeleton,
      lazy: () =>
        import('./ChatRoute').then((module) => ({
          Component: module.ChatRoute,
        })),
      errorElement: <RouteError />,
    },
  ],
  { basename: import.meta.env.BASE_URL },
)
