import { getInitials, getAvatarColor } from '../store'

export default function Avatar({ name, photo, size = 44 }) {
  const initials = getInitials(name || '?')
  const color = getAvatarColor(name || '?')

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0 text-white font-semibold"
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: size * 0.36,
      }}
    >
      {initials}
    </div>
  )
}
