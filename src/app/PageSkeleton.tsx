import { Skeleton } from '@/shared/ui/Skeleton'

export const PageSkeleton = () => {
  return (
    <main className="flex h-dvh gap-4 p-5" aria-label="Загрузка чата">
      <Skeleton className="w-16" />
      <Skeleton className="w-72" />
      <Skeleton className="flex-1" />
    </main>
  )
}
