import { getEmployeeNextAvailableTime } from '../getEmployeeNextAvailableTime';
import { IEmployee } from '../../interfaces/barbershop-booking';

describe('getEmployeeNextAvailableTime', () => {
  const mockEmployeeSchedule = {
    employeeScheduleWeekdays: [
      { weekday: 0, isWorkingDay: false, start: null, startLunch: null, endLunch: null, end: null }, // Sunday
      { weekday: 1, isWorkingDay: true, start: '08:00', startLunch: '12:00', endLunch: '13:00', end: '18:00' }, // Monday
      { weekday: 2, isWorkingDay: true, start: '08:00', startLunch: '12:00', endLunch: '13:00', end: '18:00' }, // Tuesday
      { weekday: 3, isWorkingDay: true, start: '08:00', startLunch: '12:00', endLunch: '13:00', end: '18:00' }, // Wednesday
      { weekday: 4, isWorkingDay: true, start: '08:00', startLunch: '12:00', endLunch: '13:00', end: '18:00' }, // Thursday
      { weekday: 5, isWorkingDay: true, start: '08:00', startLunch: '12:00', endLunch: '13:00', end: '18:00' }, // Friday
      { weekday: 6, isWorkingDay: false, start: null, startLunch: null, endLunch: null, end: null }, // Saturday
    ],
  };

  const mockEmployee: IEmployee = {
    id: 1,
    name: 'John Doe',
    image: '/john.jpg',
    services: [{ id: '1', name: 'Corte', description: 'Corte simples', price: 30, duration: 30 }],
    employeeSchedule: mockEmployeeSchedule,
    scheduleBlocks: [],
    appointments: [],
  };

  it('should find next slot today if available and within shift', () => {
    // 2026-06-30 is a Tuesday.
    // 10:00 locally in Sao Paulo (13:00 UTC)
    const now = new Date('2026-06-30T13:00:00.000Z');
    const result = getEmployeeNextAvailableTime(mockEmployee, now);
    expect(result).toBe('Hoje às 10:30');
  });

  it('should skip lunch break slots', () => {
    // Tuesday 11:45 local (14:45 UTC)
    const now = new Date('2026-06-30T14:45:00.000Z');
    const result = getEmployeeNextAvailableTime(mockEmployee, now);
    // 12:00 and 12:30 are lunch time, so next slot is 13:00
    expect(result).toBe('Hoje às 13:00');
  });

  it('should skip to next day if shift is over', () => {
    // Tuesday 17:50 local (20:50 UTC)
    const now = new Date('2026-06-30T20:50:00.000Z');
    const result = getEmployeeNextAvailableTime(mockEmployee, now);
    // Tomorrow (Wednesday) at 08:00
    expect(result).toBe('Amanhã às 08:00');
  });

  it('should skip to next working day if next days are non-working days', () => {
    // Friday 17:55 local (20:55 UTC)
    // 2026-07-03 is Friday. Saturday (04) and Sunday (05) are non-working.
    const now = new Date('2026-07-03T20:55:00.000Z');
    const result = getEmployeeNextAvailableTime(mockEmployee, now);
    // Next working day is Monday (07/06) at 08:00
    expect(result).toBe('06/07 às 08:00');
  });

  it('should avoid appointment conflicts', () => {
    // Tuesday 13:15 local (16:15 UTC)
    const now = new Date('2026-06-30T16:15:00.000Z');
    
    // Add appointment on 2026-06-30 at 13:30 (16:30 UTC) for 30 minutes
    const employeeWithAppointment = {
      ...mockEmployee,
      appointments: [
        { date: '2026-06-30T16:30:00.000Z', totalServiceDuration: 30 },
      ],
    };

    const result = getEmployeeNextAvailableTime(employeeWithAppointment, now);
    // 13:30 is booked, so next is 14:00
    expect(result).toBe('Hoje às 14:00');
  });

  it('should avoid schedule block conflicts', () => {
    // Tuesday 13:15 local (16:15 UTC)
    const now = new Date('2026-06-30T16:15:00.000Z');

    // Add schedule block on 2026-06-30 from 13:30 (16:30 UTC) to 15:30 (18:30 UTC)
    const employeeWithBlock = {
      ...mockEmployee,
      scheduleBlocks: [
        {
          initialDate: '2026-06-30T16:30:00.000Z',
          finalDate: '2026-06-30T18:30:00.000Z',
        },
      ],
    };

    const result = getEmployeeNextAvailableTime(employeeWithBlock, now);
    // 13:30 to 15:30 is blocked, next slot is 15:30 (or 16:00 if 15:30 overlaps/not)
    // 15:30 slot ends at 16:00, which is >= block finalDate, so 15:30 is available.
    expect(result).toBe('Hoje às 15:30');
  });
});
