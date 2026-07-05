import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';
import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';
import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';

import { AppError } from '@/src/errors/AppError.js';

import { getBarbershopLocalTimeInMinutes } from '@/src/utils/getBarbershopLocalTimeInMinutes.js';
import { convertTimeToMinutes } from '@/src/utils/convertTImeToMinutes.js';

export class GetAvailableSlotsService {
  constructor(
    private readonly employeeRepository = new EmployeeRepository(),
    private readonly barbershopRepository = new BarbershopRepository(),
    private readonly scheduleBlockRepository = new ScheduleBlockRepository(),
    private readonly appointmentRepository = new AppointmentRepository(),
  ) {}

  async execute(slug: string, dateString: string, employeeId?: number) {
    const barbershop = await this.barbershopRepository.getBySlug(slug);
    if (!barbershop) throw new AppError('Barbearia não encontrada.', 404);

    const date = new Date(dateString);

    const weekday = date.getUTCDay();

    const startOfDay = new Date(date);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const todayLocalDate = new Date().toLocaleDateString('en-CA', {
      timeZone: barbershop.timezone,
    });
    const isToday = dateString === todayLocalDate;

    let currentLocalMinutes: number | undefined;
    if (isToday) {
      currentLocalMinutes = getBarbershopLocalTimeInMinutes(
        barbershop.timezone,
      );
    }

    let employees = [];

    if (employeeId) {
      const employee =
        await this.employeeRepository.getByIdWithEmployeeSchedule(employeeId);

      if (!employee || employee.barbershopId !== barbershop.id) {
        throw new AppError('Funcionário não encontrado.', 404);
      }

      employees = [employee];
    } else {
      employees = await this.employeeRepository.listByBarbershopIdWithSchedule(
        barbershop.id,
      );
    }

    const employeesResult = [];

    for (const employee of employees) {
      const scheduleWeekday =
        employee.employeeSchedule?.employeeScheduleWeekdays?.find(
          (s) => s.weekday === weekday,
        );

      if (!scheduleWeekday || !scheduleWeekday.isWorkingDay) {
        employeesResult.push({
          id: employee.id,
          name: employee.name,
          availableSlots: [],
        });
        continue;
      }

      const startShift = convertTimeToMinutes(scheduleWeekday.start!);
      const endShift = convertTimeToMinutes(scheduleWeekday.end!);
      const startLunch = convertTimeToMinutes(scheduleWeekday.startLunch!);
      const endLunch = convertTimeToMinutes(scheduleWeekday.endLunch!);

      const blocks =
        await this.scheduleBlockRepository.findByDateRangeAndEmployeeId(
          startOfDay,
          endOfDay,
          barbershop.id,
          employee.id,
        );

      const appointments =
        await this.appointmentRepository.getByDateAndEmployeeId(
          date,
          employee.id,
        );

      const slots: string[] = [];
      const step = 30;

      for (let minutes = startShift; minutes < endShift; minutes += step) {
        const slotStart = minutes;
        const slotEnd = minutes + step;

        if (slotStart < endLunch && slotEnd > startLunch) continue;

        if (
          currentLocalMinutes !== undefined &&
          slotStart <= currentLocalMinutes
        ) {
          continue;
        }

        const slotDate = new Date(date);
        slotDate.setUTCHours(Math.floor(slotStart / 60), slotStart % 60, 0, 0);

        const isBlocked = blocks.some((block) => {
          const blockStart = new Date(block.initialDate).getTime();
          const blockEnd = new Date(block.finalDate).getTime();
          const slotTime = slotDate.getTime();
          return slotTime >= blockStart && slotTime < blockEnd;
        });

        if (isBlocked) continue;

        const hasConflict = appointments.some((appt) => {
          const apptStart =
            appt.date.getUTCHours() * 60 + appt.date.getUTCMinutes();
          const apptEnd = apptStart + appt.totalServiceDuration;
          return slotStart < apptEnd && slotEnd > apptStart;
        });

        if (hasConflict) continue;

        const hours = String(Math.floor(slotStart / 60)).padStart(2, '0');
        const mins = String(slotStart % 60).padStart(2, '0');
        slots.push(`${hours}:${mins}`);
      }

      employeesResult.push({
        id: employee.id,
        name: employee.name,
        availableSlots: slots,
      });
    }

    return {
      date: dateString,
      employees: employeesResult,
    };
  }
}
