export function getNextAvailableSlotMessage(
  barbershopLocalDateUTC: Date,
  employeeShiftDate: string,
  firstAvailableSlot: string,
): string {
  if (!firstAvailableSlot) {
    return 'Sem horários nos próximos 10 dias';
  }

  const barbershopLocaleDateString = barbershopLocalDateUTC.toLocaleDateString(
    'en-CA',
    { timeZone: 'UTC' },
  );
  const isToday = barbershopLocaleDateString === employeeShiftDate;

  const tomorrow = new Date(
    barbershopLocalDateUTC.getTime() + 24 * 60 * 60 * 1000,
  );
  const tomorrowLocaleDateString = tomorrow.toLocaleDateString('en-CA', {
    timeZone: 'UTC',
  });
  const isTomorrow = employeeShiftDate === tomorrowLocaleDateString;

  const [year, month, day] = employeeShiftDate.split('-');

  if (isToday) return `Hoje, às ${firstAvailableSlot}`;
  if (isTomorrow) return `Amanhã, às ${firstAvailableSlot}`;
  return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}, às ${firstAvailableSlot}`;
}
