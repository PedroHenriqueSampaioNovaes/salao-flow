import { Temporal } from '@js-temporal/polyfill';

import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';
import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';
import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';

import { AppError } from '@/src/errors/AppError.js';

import {
  getWorkdaySchedule,
  parseShiftScheduleToMinutes,
  getDayBoundariesUTC,
  parseDateWithCurrentZonedDateTime,
  isSlotDuringLunch,
  isSlotInPast,
  isSlotBlocked,
  hasAppointmentConflict,
  formatMinutesAsTime,
  ShiftSchedule,
  ScheduleBlock,
  Appointment,
  EmployeeWithSchedule,
} from '@/src/utils/scheduleHelpers.js';

const SLOT_DURATION_MINUTES = 30;
const MAX_LOOKAHEAD_DAYS = 10;

interface BarbershopContext {
  id: number;
  timezone: string;
}

interface EmployeeSlotResult {
  id: number;
  name: string;
  date: string;
  availableSlots: string[];
}

export class GetAvailableSlotsService {
  constructor(
    private readonly employeeRepository = new EmployeeRepository(),
    private readonly barbershopRepository = new BarbershopRepository(),
    private readonly scheduleBlockRepository = new ScheduleBlockRepository(),
    private readonly appointmentRepository = new AppointmentRepository(),
  ) {}

  async execute(
    slug: string,
    dateString: string,
    lookForNextAvailableTimeSlot: boolean,
    employeeId?: number,
  ) {
    const barbershop = await this.barbershopRepository.getBySlug(slug);
    if (!barbershop) throw new AppError('Barbearia não encontrada.', 404);

    const targetDate = parseDateWithCurrentZonedDateTime(
      dateString,
      barbershop.timezone,
    );
    const today = Temporal.Now.zonedDateTimeISO(barbershop.timezone);

    const employees = await this.getEmployees(barbershop, employeeId);

    const isOldTargetDate =
      today.day > targetDate.day &&
      today.month >= targetDate.month &&
      today.year >= targetDate.year;
    const isToday = today.toPlainDate().equals(targetDate);

    const employeesResult: EmployeeSlotResult[] = [];

    for (const employee of employees) {
      const result = await this.retrievesEmployeesAvailableSchedules(
        barbershop,
        employee,
        targetDate,
        dateString,
        isToday,
        isOldTargetDate,
        lookForNextAvailableTimeSlot,
      );

      employeesResult.push(result);
    }

    return {
      date: dateString,
      employees: employeesResult,
    };
  }

  private async retrievesEmployeesAvailableSchedules(
    barbershop: BarbershopContext,
    employee: EmployeeWithSchedule,
    targetDate: Temporal.ZonedDateTime,
    dateString: string,
    isToday: boolean,
    isOldTargetDate: boolean,
    lookForNextAvailableTimeSlot: boolean,
  ) {
    if (isOldTargetDate) {
      return this.createSlotResult(employee, dateString, []);
    }

    const slots = await this.getSlotsForDay(
      barbershop,
      employee,
      targetDate,
      dateString,
      isToday,
    );

    if (slots.length > 0 || !lookForNextAvailableTimeSlot) {
      return this.createSlotResult(employee, dateString, slots);
    }

    return this.findSlotsWithLookahead(
      barbershop,
      employee,
      targetDate,
      dateString,
    );
  }

  private async findSlotsWithLookahead(
    barbershop: BarbershopContext,
    employee: EmployeeWithSchedule,
    targetDate: Temporal.ZonedDateTime,
    fallbackDateString: string,
  ) {
    for (let i = 1; i <= MAX_LOOKAHEAD_DAYS; i++) {
      const futureDate = targetDate.add({ days: i });
      const futureDateString = futureDate.toPlainDate().toString();

      const slots = await this.getSlotsForDay(
        barbershop,
        employee,
        futureDate,
        futureDateString,
        false,
      );

      if (slots.length > 0) {
        return this.createSlotResult(employee, futureDateString, slots);
      }
    }

    return this.createSlotResult(employee, fallbackDateString, []);
  }

  private async getEmployees(
    barbershop: BarbershopContext,
    employeeId?: number,
  ) {
    if (employeeId) {
      const employee =
        await this.employeeRepository.getByIdWithEmployeeSchedule(employeeId);

      if (!employee || employee.barbershopId !== barbershop.id) {
        throw new AppError('Funcionário não encontrado.', 404);
      }

      return [employee];
    }

    return this.employeeRepository.listByBarbershopIdWithSchedule(
      barbershop.id,
    );
  }

  private async getSlotsForDay(
    barbershop: BarbershopContext,
    employee: EmployeeWithSchedule,
    zonedDateTime: Temporal.ZonedDateTime,
    dateString: string,
    isToday: boolean,
  ) {
    const scheduleWeekday = getWorkdaySchedule(employee, zonedDateTime);
    if (!scheduleWeekday) return [];

    const shift = parseShiftScheduleToMinutes(scheduleWeekday);
    const { startOfDayUTC, endOfDayUTC } = getDayBoundariesUTC(zonedDateTime);

    const currentLocalMinutes = isToday
      ? zonedDateTime.hour * 60 + zonedDateTime.minute
      : undefined;

    const blocks =
      await this.scheduleBlockRepository.findByDateRangeAndEmployeeId(
        startOfDayUTC,
        endOfDayUTC,
        barbershop.id,
        employee.id,
      );

    const appointments =
      await this.appointmentRepository.getByDateAndEmployeeId(
        dateString,
        employee.id,
      );

    return this.generateAvailableSlots(
      zonedDateTime,
      shift,
      currentLocalMinutes,
      blocks,
      appointments,
      barbershop.timezone,
    );
  }

  private generateAvailableSlots(
    zonedDateTime: Temporal.ZonedDateTime,
    shift: ShiftSchedule,
    currentLocalMinutes: number | undefined,
    blocks: ScheduleBlock[],
    appointments: Appointment[],
    timezone: string,
  ) {
    const slots: string[] = [];

    for (
      let minutes = shift.startShift;
      minutes < shift.endShift;
      minutes += SLOT_DURATION_MINUTES
    ) {
      const slotStart = minutes;
      const slotEnd = minutes + SLOT_DURATION_MINUTES;

      if (isSlotDuringLunch(slotStart, slotEnd, shift)) continue;
      if (isSlotInPast(slotStart, currentLocalMinutes)) continue;

      const zonedSlotDate = zonedDateTime.with({
        hour: Math.floor(slotStart / 60),
        minute: slotStart % 60,
      });

      if (isSlotBlocked(zonedSlotDate, blocks)) continue;
      if (hasAppointmentConflict(slotStart, slotEnd, appointments, timezone))
        continue;

      slots.push(formatMinutesAsTime(slotStart));
    }

    return slots;
  }

  private createSlotResult(
    employee: EmployeeWithSchedule,
    date: string,
    availableSlots: string[],
  ) {
    return {
      id: employee.id,
      name: employee.name,
      date,
      availableSlots,
    };
  }
}
