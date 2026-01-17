export const formatDate = (date: Date) => {
  const intlDate = new Intl.DateTimeFormat("nl-NL", {
    dateStyle: "medium",
  }).format(date);
  const day = new Intl.DateTimeFormat("nl-NL", { weekday: "short" }).format(
    date,
  );

  return `${intlDate} (${day})`;
};

export const formatTime = (date: Date) =>
  new Intl.DateTimeFormat("nl-NL", { timeStyle: "short" }).format(date);

export const formatDateTime = (date: Date) =>
  `${formatDate(date)} - ${formatTime(date)}`;
