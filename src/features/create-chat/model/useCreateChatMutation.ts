import { useMutation } from '@tanstack/react-query'

import { findChatByPhone, useChatStore } from '@/entities/chat'

export const useCreateChatMutation = () => {
  const credentials = useChatStore((state) => state.credentials)
  const createChat = useChatStore((state) => state.createChat)
  return useMutation({
    mutationFn: (phone: string) => {
      if (!credentials) throw new Error('Подключите инстанс GREEN-API.')
      return findChatByPhone(credentials, phone)
    },
    onSuccess: createChat,
  })
}
