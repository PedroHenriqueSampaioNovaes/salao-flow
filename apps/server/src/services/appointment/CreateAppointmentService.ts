import { Temporal } from '@js-temporal/polyfill';

import { CreateAppointmentSchema } from '@sistema-barbearia/validators';

import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';
import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';
import { CustomerRepository } from '@/src/repositories/CustomerRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';
import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';

import { EmployeeScheduleWeekday } from '@/src/interfaces/Employee.js';

import { AppError } from '@/src/errors/AppError.js';

import {
  getWorkdaySchedule,
  parseShiftScheduleToMinutes,
  isSlotDuringLunch,
  hasAppointmentConflict,
} from '@/src/utils/scheduleHelpers.js';

export class CreateAppointmentService {
  constructor(
    private readonly employeeRepository = new EmployeeRepository(),
    private readonly barbershopRepository = new BarbershopRepository(),
    private readonly scheduleBlockRepository = new ScheduleBlockRepository(),
    private readonly serviceRepository = new ServiceRepository(),
    private readonly appointmentRepository = new AppointmentRepository(),
    private readonly customerRepository = new CustomerRepository(),
  ) {}

  async execute(data: CreateAppointmentSchema) {
    const barbershop = await this.barbershopRepository.getBySlug(
      data.barbershopSlug,
    );
    if (!barbershop) throw new AppError('Barbearia não encontrada.');

    const employee = await this.getAndValidateEmployee(
      data.employeeId,
      barbershop.id,
    );

    const services = await this.getAndValidateServices(
      data.serviceIds,
      barbershop.id,
    );

    const totalServiceDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0,
    );

    const [year, month, day] = data.date.split('-').map(Number);
    const [hour, minute] = data.time.split(':').map(Number);

    const zonedTargetDate = Temporal.ZonedDateTime.from({
      year,
      month,
      day,
      hour,
      minute,
      timeZone: barbershop.timezone,
    });

    const today = Temporal.Now.zonedDateTimeISO(barbershop.timezone);

    const isOldTargetDate =
      today.day > zonedTargetDate.day &&
      today.month >= zonedTargetDate.month &&
      today.year >= zonedTargetDate.year;
    if (isOldTargetDate) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }

    const instantInitialDateAppointment = zonedTargetDate.toInstant();
    const instantFinalDateAppointment = instantInitialDateAppointment.add({
      minutes: totalServiceDuration,
    });

    await this.checkScheduleBlock(
      instantInitialDateAppointment.toString(),
      instantFinalDateAppointment.toString(),
      barbershop.id,
      employee.id,
    );

    const appointmentStartMinutes =
      zonedTargetDate.hour * 60 + zonedTargetDate.minute;
    const appointmentEndMinutes =
      appointmentStartMinutes + totalServiceDuration;

    this.validateEmployeeSchedule(
      zonedTargetDate,
      appointmentStartMinutes,
      appointmentEndMinutes,
      employee.employeeSchedule.employeeScheduleWeekdays,
    );

    await this.checkForAppointmentConflict(
      data.employeeId,
      zonedTargetDate.toPlainDate().toString(),
      appointmentStartMinutes,
      appointmentEndMinutes,
      barbershop.timezone,
    );

    const customer = await this.getOrCreateOrUpdateCustomer(
      data,
      barbershop.id,
    );

    return this.appointmentRepository.create(
      {
        dateString: instantInitialDateAppointment.toString(),
        totalServiceDuration,
        employeeId: data.employeeId,
        customerId: customer.id,
        serviceIds: data.serviceIds,
      },
      barbershop.id,
    );
  }

  private async checkScheduleBlock(
    initialDateISOString: string,
    finalDateISOString: string,
    barbershopId: number,
    employeeId: number,
  ) {
    const scheduleBlock =
      await this.scheduleBlockRepository.findByDateRangeAndEmployeeId(
        initialDateISOString,
        finalDateISOString,
        barbershopId,
        employeeId,
      );

    if (scheduleBlock.length > 0) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }
  }

  private async getOrCreateOrUpdateCustomer(
    data: Pick<CreateAppointmentSchema, 'name' | 'phone' | 'email'>,
    barbershopId: number,
  ) {
    const customer = await this.customerRepository.getByPhone(
      data.phone,
      barbershopId,
    );

    if (customer) {
      if (customer.isBlocked) {
        throw new AppError('Não foi possível reservar o horário.');
      }

      return this.customerRepository.updateProfileAndVisitCount({
        id: customer.id,
        name: data.name,
        email: data.email,
      });
    }

    return this.customerRepository.create(
      {
        name: data.name,
        phone: data.phone,
        email: data.email,
        isBlocked: false,
      },
      barbershopId,
    );
  }

  private async getAndValidateEmployee(
    employeeId: number,
    barbershopId: number,
  ) {
    const employee =
      await this.employeeRepository.getByIdWithEmployeeSchedule(employeeId);

    if (!employee || employee.barbershopId !== barbershopId) {
      throw new AppError('Funcionário não encontrado.');
    }

    return employee;
  }

  private async getAndValidateServices(
    serviceIds: string[],
    barbershopId: number,
  ) {
    const services = await this.serviceRepository.listByIds(serviceIds);

    const notFoundError = new AppError(
      'Serviço não encontrado. Atualize a página e tente novamente.',
    );

    if (services.length === 0 || services.length !== serviceIds.length) {
      throw notFoundError;
    }

    const hasInvalidService = services.some(
      (service) => service.barbershopId !== barbershopId,
    );

    if (hasInvalidService) throw notFoundError;

    return services;
  }

  private validateEmployeeSchedule(
    zonedDate: Temporal.ZonedDateTime,
    appointmentStartMinutes: number,
    appointmentEndMinutes: number,
    employeeSchedule: EmployeeScheduleWeekday[],
  ) {
    const employeeScheduleWeekday = getWorkdaySchedule(
      {
        id: 0,
        name: '',
        employeeSchedule: { employeeScheduleWeekdays: employeeSchedule },
      },
      zonedDate,
    );

    if (!employeeScheduleWeekday) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }

    const shift = parseShiftScheduleToMinutes(employeeScheduleWeekday);

    const isOutsideShift =
      appointmentStartMinutes < shift.startShift ||
      appointmentEndMinutes > shift.endShift;

    const overlapsWithLunch = isSlotDuringLunch(
      appointmentStartMinutes,
      appointmentEndMinutes,
      shift,
    );

    if (isOutsideShift || overlapsWithLunch) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }
  }

  private async checkForAppointmentConflict(
    employeeId: number,
    dateString: string,
    newStart: number,
    newEnd: number,
    timezone: string,
  ) {
    const reservedTimesOfDay =
      await this.appointmentRepository.getByDateAndEmployeeId(
        dateString,
        employeeId,
      );

    const hasConflict = hasAppointmentConflict(
      newStart,
      newEnd,
      reservedTimesOfDay,
      timezone,
    );

    if (hasConflict) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }
  }
}
