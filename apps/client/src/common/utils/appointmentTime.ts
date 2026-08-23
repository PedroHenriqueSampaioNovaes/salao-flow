export function formatAppointmentTime(date: string, timezone: string) {
  return new Date(date).toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  });
}

export function addMinutes(date: string, minutes: number) {
  return new Date(new Date(date).getTime() + minutes * 60000).toISOString();
}
