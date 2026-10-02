import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, http } from 'msw'
import type { JsonBodyType } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { ChatPage } from './ChatPage'

import { useChatStore } from '@/entities/chat'

const requests: string[] = []
let incoming: JsonBodyType = null
const instanceUrl = 'https://api.green-api.com/waInstance3100000000'
const token = 'mocktoken'
const server = setupServer(
  http.get(`${instanceUrl}/getSettings/${token}`, () => {
    requests.push('settings')
    return HttpResponse.json({
      typeInstance: 'whatsapp',
      incomingWebhook: 'yes',
      webhookUrl: '',
    })
  }),
  http.post(`${instanceUrl}/checkWhatsapp/${token}`, async ({ request }) => {
    expect(await request.json()).toEqual({ chatId: '79991234567' })
    requests.push('check-account')
    return HttpResponse.json({
      existsWhatsapp: true,
      chatId: '123456789012345@lid',
    })
  }),
  http.post(`${instanceUrl}/sendMessage/${token}`, async ({ request }) => {
    expect(await request.json()).toEqual({
      chatId: '123456789012345@lid',
      message: 'Привет',
    })
    requests.push('send')
    incoming = {
      receiptId: 1,
      body: {
        typeWebhook: 'incomingMessageReceived',
        idMessage: 'in-1',
        timestamp: 1_700_000_000,
        senderData: {
          chatId: '79991234567@c.us',
          chatName: 'Получатель',
          sender: '79991234567@c.us',
        },
        messageData: {
          typeMessage: 'textMessage',
          textMessageData: { textMessage: 'Ответ получателя' },
        },
      },
    }
    return HttpResponse.json({ idMessage: 'out-1' })
  }),
  http.get(`${instanceUrl}/receiveNotification/${token}`, ({ request }) => {
    expect(new URL(request.url).searchParams.get('receiveTimeout')).toBe('5')
    const notification = incoming
    incoming = null
    return HttpResponse.json(notification)
  }),
  http.delete(`${instanceUrl}/deleteNotification/${token}/1`, () => {
    requests.push('delete')
    return HttpResponse.json({ result: true })
  }),
)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
afterEach(() => {
  server.resetHandlers()
  useChatStore.getState().disconnect()
  requests.length = 0
  incoming = null
})
afterAll(() => {
  server.close()
})

const renderChat = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <ChatPage />
    </QueryClientProvider>,
  )
}

describe('WhatsApp chat', () => {
  it('validates credentials before requesting the API', async () => {
    const user = userEvent.setup()
    renderChat()
    expect(screen.getByLabelText('API URL')).toHaveValue('')
    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    expect(
      await screen.findByText('Укажите корректный API URL.'),
    ).toBeInTheDocument()
    expect(
      await screen.findByText('Введите цифровой idInstance.'),
    ).toBeInTheDocument()
    expect(requests).toEqual([])
  })

  it('rejects an instance of another messenger', async () => {
    server.use(
      http.get(`${instanceUrl}/getSettings/${token}`, () =>
        HttpResponse.json({
          typeInstance: 'v3',
          incomingWebhook: 'yes',
          webhookUrl: '',
        }),
      ),
    )
    const user = userEvent.setup()
    renderChat()
    await user.type(
      screen.getByLabelText('API URL'),
      'https://api.green-api.com',
    )
    await user.type(screen.getByLabelText('idInstance'), '3100000000')
    await user.type(screen.getByLabelText('apiTokenInstance'), 'mocktoken')
    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    expect(
      await screen.findByText('Этот инстанс не относится к WhatsApp.'),
    ).toBeInTheDocument()
    expect(useChatStore.getState().credentials).toBeNull()
  })

  it('does not show the token when a browser request fails', async () => {
    server.use(
      http.get(`${instanceUrl}/getSettings/${token}`, () =>
        HttpResponse.error(),
      ),
    )
    const user = userEvent.setup()
    renderChat()
    await user.type(
      screen.getByLabelText('API URL'),
      'https://api.green-api.com',
    )
    await user.type(screen.getByLabelText('idInstance'), '3100000000')
    await user.type(screen.getByLabelText('apiTokenInstance'), token)
    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    expect(
      await screen.findByText(/Не удалось связаться с GREEN-API/),
    ).toBeInTheDocument()
    expect(screen.queryByText(/mocktoken/)).not.toBeInTheDocument()
  })

  it('connects, creates a chat, sends text and shows the reply', async () => {
    const user = userEvent.setup()
    renderChat()
    await user.type(
      screen.getByLabelText('API URL'),
      'https://api.green-api.com',
    )
    await user.type(screen.getByLabelText('idInstance'), '3100000000')
    await user.type(screen.getByLabelText('apiTokenInstance'), 'mocktoken')
    await user.click(screen.getByRole('button', { name: /открыть чат/i }))
    await screen.findByTitle('Новый чат')
    await user.click(screen.getByTitle('Новый чат'))
    const dialog = screen.getByRole('dialog', { name: 'Новый чат' })
    await user.type(
      within(dialog).getByLabelText('Номер телефона'),
      '+7 999 123-45-67',
    )
    await user.click(
      within(dialog).getByRole('button', { name: /создать чат/i }),
    )
    await screen.findByRole('textbox', { name: 'Текст сообщения' })
    await user.type(
      screen.getByRole('textbox', { name: 'Текст сообщения' }),
      'Привет',
    )
    await user.click(
      screen.getByRole('button', { name: 'Отправить сообщение' }),
    )
    expect(await screen.findByText('Привет')).toBeInTheDocument()
    expect(
      await within(
        screen.getByRole('region', { name: 'Переписка' }),
      ).findByText('Ответ получателя', {}, { timeout: 4000 }),
    ).toBeInTheDocument()
    await waitFor(() => {
      expect(requests).toEqual(['settings', 'check-account', 'send', 'delete'])
      const chats = useChatStore.getState().chats
      expect(chats).toHaveLength(1)
      expect(chats[0]?.id).toBe('123456789012345@lid')
      expect(chats[0]?.messages).toHaveLength(2)
    })
  })
})
