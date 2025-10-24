export function formatTimestamp(dateString: string) {
  if (!dateString) return '';

  const date = new Date(dateString);

  const pad = (num: number) => String(num).padStart(2, '0');

  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1); // Months are 0-indexed
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}
