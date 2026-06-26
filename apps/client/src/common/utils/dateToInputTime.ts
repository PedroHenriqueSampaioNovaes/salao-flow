export function dateToInputTime(date: Date | string): string {
  const newDate = new Date(date);
  return `${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`;
}
