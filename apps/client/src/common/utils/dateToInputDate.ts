export function dateToInputDate(date: Date | string, timezone: string) {
  return Intl.DateTimeFormat('en-CA', { timeZone: timezone }).format(
    new Date(date),
  );
}
