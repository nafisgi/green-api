import { useMutation } from '@tanstack/react-query'

import { useChatStore } from '@/entities/chat'
import { verifyInstance } from '@/entities/instance'
import type { Credentials } from '@/shared/api/types'

export const useConnectInstanceMutation = () => {
  const connect = useChatStore((state) => state.connect)
  return useMutation({
    mutationFn: async (credentials: Credentials) => {
      await verifyInstance(credentials)
      return credentials
    },
    onSuccess: connect,
  })
}
