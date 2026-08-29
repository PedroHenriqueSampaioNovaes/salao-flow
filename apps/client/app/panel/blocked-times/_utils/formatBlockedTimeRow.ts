import { IBlockedTime } from '@/src/common/interfaces/employee-schedule';

import { getLocalDateAsUTCDate } from '@/src/common/utils/getLocalDateAsUTCDate';

const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'UTC',
});

function formatDuration(start: Date, end: Date): string {
  const totalMinutes = Math.round((end.getTime() - start.getTime()) / 60_000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}min`);

  if (parts.length === 0) return '0min';
  return parts.join(' ');
}

export function formatBlockedTimeRow(
  blockedTime: IBlockedTime,
  timezone: string,
) {
  const start = getLocalDateAsUTCDate(blockedTime.initialDate, timezone);
  const end = getLocalDateAsUTCDate(blockedTime.finalDate, timezone);

  return {
    startLabel: dateTimeFormatter.format(start),
    endLabel: dateTimeFormatter.format(end),
    durationLabel: formatDuration(start, end),
  };
}
