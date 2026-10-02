import type { FallbackProps } from 'react-error-boundary'

import { Button } from '@/shared/ui/Button'

export const RouteFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const message = error instanceof Error ? error.message : 'Неизвестная ошибка.'
  return (
    <main
      className="grid min-h-dvh place-items-center p-6 text-center"
      role="alert"
    >
      <div>
        <h1 className="text-2xl font-bold">Ошибка интерфейса</h1>
        <p className="mt-2 mb-5 text-sm text-slate-500">{message}</p>
        <Button type="button" onClick={resetErrorBoundary}>
          Повторить
        </Button>
      </div>
    </main>
  )
}
