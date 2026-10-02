import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'

import { receiveTextMessage, useChatStore } from '@/entities/chat'
import { queryKeys } from '@/shared/api/query-keys'

export const useIncomingMessagesQuery = () => {
  const credentials = useChatStore((state) => state.credentials)
  const sessionId = useChatStore((state) => state.sessionId)
  const addIncoming = useChatStore((state) => state.addIncoming)
  const query = useQuery({
    queryKey: queryKeys.notifications(sessionId),
    queryFn: ({ signal }) => {
      if (!credentials) throw new Error('Подключите инстанс GREEN-API.')
      return receiveTextMessage(credentials, signal)
    },
    enabled: credentials !== null,
    retry: false,
    refetchInterval: 500,
    refetchIntervalInBackground: false,
  })

  useEffect(() => {
    if (query.data) addIncoming(query.data)
  }, [addIncoming, query.data])

  return query
}
