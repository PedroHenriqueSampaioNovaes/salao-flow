import { Temporal } from '@js-temporal/polyfill';

import { EmployeeScheduleWeekday } from '@/src/interfaces/Employee.js';

import { convertTimeToMinutes } from '@/src/utils/convertTImeToMinutes.js';

export interface ShiftSchedule {
  startShift: number;
  endShift: number;
  startLunch: number;
  endLunch: number;
}

export interface ScheduleBlock {
  initialDate: Date;
  finalDate: Date;
}

export interface Appointment {
  date: Date;
  totalServiceDuration: number;
}

export interface EmployeeWithSchedule {
  id: number;
  name: string;
  employeeSchedule: {
    employeeScheduleWeekdays: EmployeeScheduleWeekday[];
  };
}

export function isSlotDuringLunch(
  slotStart: number,
  slotEnd: number,
  shift: ShiftSchedule,
) {
  return slotStart < shift.endLunch && slotEnd > shift.startLunch;
}

export function isSlotInPast(slotStart: number, currentLocalMinutes?: number) {
  return currentLocalMinutes !== undefined && slotStart <= currentLocalMinutes;
}

export function isSlotBlocked(
  zonedSlotDate: Temporal.ZonedDateTime,
  blocks: ScheduleBlock[],
) {
  const slotInstant = zonedSlotDate.toInstant();

  return blocks.some((block) => {
    const blockStart = Temporal.Instant.from(block.initialDate.toISOString());
    const blockEnd = Temporal.Instant.from(block.finalDate.toISOString());

    const isAtOrAfterStart =
      Temporal.Instant.compare(slotInstant, blockStart) >= 0;
    const isBeforeEnd = Temporal.Instant.compare(slotInstant, blockEnd) < 0;

    return isAtOrAfterStart && isBeforeEnd;
  });
}

export function hasAppointmentConflict(
  slotStart: number,
  slotEnd: number,
  appointments: Appointment[],
  timezone: string,
) {
  return appointments.some((appt) => {
    const zonedApptDate = Temporal.Instant.from(
      appt.date.toISOString(),
    ).toZonedDateTimeISO(timezone);

    const apptStart = zonedApptDate.hour * 60 + zonedApptDate.minute;
    const apptEnd = apptStart + appt.totalServiceDuration;

    return slotStart < apptEnd && slotEnd > apptStart;
  });
}

export function getEmployeeWorkdaySchedule(
  employee: EmployeeWithSchedule,
  zonedDateTime: Temporal.ZonedDateTime,
) {
  const weekday = zonedDateTime.dayOfWeek;

  const scheduleWeekday =
    employee.employeeSchedule.employeeScheduleWeekdays.find(
      (s) => s.weekday === weekday,
    );

  if (!scheduleWeekday || !scheduleWeekday.isWorkingDay) {
    return undefined;
  }

  return scheduleWeekday;
}

export function parseShiftScheduleToMinutes(weekday: EmployeeScheduleWeekday) {
  return {
    startShift: convertTimeToMinutes(weekday.start!),
    endShift: convertTimeToMinutes(weekday.end!),
    startLunch: convertTimeToMinutes(weekday.startLunch!),
    endLunch: convertTimeToMinutes(weekday.endLunch!),
  };
}

export function getDayBoundariesUTC(zonedDateTime: Temporal.ZonedDateTime) {
  const startOfDayUTC = zonedDateTime
    .with({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    .toPlainDateTime()
    .toZonedDateTime('UTC')
    .toInstant()
    .toString();

  const endOfDayUTC = zonedDateTime
    .with({ hour: 23, minute: 59, second: 59, millisecond: 999 })
    .toPlainDateTime()
    .toZonedDateTime('UTC')
    .toInstant()
    .toString();

  return { startOfDayUTC, endOfDayUTC };
}

export function parseDateWithCurrentZonedDateTime(
  dateString: string,
  timezone: string,
) {
  const [year, month, day] = dateString.split('-').map(Number);
  const now = Temporal.Now.zonedDateTimeISO(timezone);

  return Temporal.ZonedDateTime.from({
    year,
    month,
    day,
    hour: now.hour,
    minute: now.minute,
    timeZone: timezone,
  });
}

export function formatMinutesAsTime(totalMinutes: number) {
  const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
  const mins = String(totalMinutes % 60).padStart(2, '0');
  return `${hours}:${mins}`;
}
