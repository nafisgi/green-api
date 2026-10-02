import { useMutation } from '@tanstack/react-query'

import { sendTextMessage, useChatStore } from '@/entities/chat'

interface SendTextInput {
  chatId: string
  text: string
}

export const useSendMessageMutation = () => {
  const credentials = useChatStore((state) => state.credentials)
  const addOutgoing = useChatStore((state) => state.addOutgoing)
  return useMutation({
    mutationFn: ({ chatId, text }: SendTextInput) => {
      if (!credentials) throw new Error('Подключите инстанс GREEN-API.')
      return sendTextMessage(credentials, chatId, text)
    },
    onSuccess: (message, input) => {
      addOutgoing(input.chatId, message)
    },
  })
}
