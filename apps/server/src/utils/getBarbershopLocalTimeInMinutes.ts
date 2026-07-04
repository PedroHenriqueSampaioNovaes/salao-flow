export function getBarbershopLocalTimeInMinutes(timezone: string) {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const [hours, minutes] = formatter.format(new Date()).split(':').map(Number);
  return hours * 60 + minutes;
}
