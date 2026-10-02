import { lazy } from 'react'

import { RouteBoundary } from './RouteBoundary'

const ChatPage = lazy(async () => {
  const module = await import('@/pages/chat')
  return { default: module.ChatPage }
})

export const ChatRoute = () => {
  return (
    <RouteBoundary>
      <ChatPage />
    </RouteBoundary>
  )
}
