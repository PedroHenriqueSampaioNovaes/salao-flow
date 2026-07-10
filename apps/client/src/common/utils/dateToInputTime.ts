export function dateToInputTime(date: Date | string, timezone: string): string {
  return Intl.DateTimeFormat('pt-BR', {
    timeStyle: 'short',
    timeZone: timezone,
  }).format(new Date(date));
}
