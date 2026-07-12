/**
 * Retorna um objeto Date ajustado ao horário local da barbearia,
 * mas representado em UTC para que getUTCHours, getUTCMinutes e getUTCDay
 * retornem os valores locais no fuso horário da barbearia.
 */
export function getLocalDateAsUTCDate(
  dateInput: Date | string,
  timezone: string,
): Date {
  const formatter = new Intl.DateTimeFormat('pt-BR', {
    timeZone: timezone,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: false,
  });

  const parts = formatter.formatToParts(new Date(dateInput));
  const getPart = (type: string) =>
    parseInt(parts.find((part) => part.type === type)!.value, 10);

  const year = getPart('year');
  const month = getPart('month') - 1;
  const day = getPart('day');
  let hour = getPart('hour');
  if (hour === 24) hour = 0; // Trata a peculiaridade de meia-noite no formato de 24h
  const minute = getPart('minute');
  const second = getPart('second');

  return new Date(Date.UTC(year, month, day, hour, minute, second));
}
