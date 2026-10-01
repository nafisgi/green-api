import { cn } from '@/shared/lib/cn'

interface ChatAvatarProps {
  name: string
  small?: boolean
}

export const ChatAvatar = ({ name, small = false }: ChatAvatarProps) => {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-emerald-400 to-teal-700 font-bold text-white',
        small ? 'size-10 text-lg' : 'size-11 text-xl',
      )}
    >
      {name.startsWith('+') ? name.charAt(1) : name.charAt(0) || 'W'}
    </span>
  )
}
