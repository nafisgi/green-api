export interface Message {
  id: string
  text: string
  direction: 'incoming' | 'outgoing'
  timestamp: number
}

export interface Chat {
  id: string
  phone: string
  name: string
  messages: Message[]
}
