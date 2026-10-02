import { isRouteErrorResponse, useRouteError } from 'react-router'

import { Button } from '@/shared/ui/Button'

export const RouteError = () => {
  const error: unknown = useRouteError()
  const message = isRouteErrorResponse(error)
    ? `${String(error.status)} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Страница недоступна.'
  return (
    <main className="grid min-h-dvh place-items-center p-6 text-center">
      <div>
        <h1 className="text-2xl font-bold">Не удалось открыть чат</h1>
        <p className="mt-2 mb-5 text-sm text-slate-500">{message}</p>
        <Button
          type="button"
          onClick={() => {
            window.location.reload()
          }}
        >
          Повторить
        </Button>
      </div>
    </main>
  )
}
