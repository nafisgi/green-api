import { format } from 'date-fns'

export const formatMessageTime = (timestamp: number): string => {
  return format(timestamp, 'HH:mm')
}
