export const formatDate = (date: Date) =>
  new Intl.DateTimeFormat('nl-NL', { dateStyle: 'full' }).format(date)

export const formatTime = (date: Date) =>
  new Intl.DateTimeFormat('nl-NL', { timeStyle: 'short' }).format(date)

export const formatDateTime = (date: Date) =>
  `${formatDate(date)} - ${formatTime(date)}`
