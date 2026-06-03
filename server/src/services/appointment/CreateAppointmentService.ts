import {
  CreateAppointmentSchema,
  CreateCustomerSchema,
} from '@sistema-barbearia/validators';

import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';
import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';
import { CustomerRepository } from '@/src/repositories/CustomerRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { EmployeeScheduleWeekday } from '@/src/interfaces/Employee.js';

import { AppError } from '@/src/errors/AppError.js';

interface CreateAppointmentAndCustomerData
  extends CreateAppointmentSchema, CreateCustomerSchema {}

export class CreateAppointmentService {
  constructor(
    private readonly employeeRepository = new EmployeeRepository(),
    private readonly barbershopRepository = new BarbershopRepository(),
    private readonly serviceRepository = new ServiceRepository(),
    private readonly appointmentRepository = new AppointmentRepository(),
    private readonly customerRepository = new CustomerRepository(),
  ) {}

  async execute(data: CreateAppointmentAndCustomerData) {
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

    const appointmentStartMinutes = this.convertTimeToMinutes(data.time);
    const appointmentEndMinutes =
      appointmentStartMinutes + totalServiceDuration;

    this.validateEmployeeSchedule(
      data.date,
      appointmentStartMinutes,
      appointmentEndMinutes,
      employee.employeeSchedule.employeeScheduleWeekdays,
    );

    await this.validateNoScheduleConflicts(
      data.employeeId,
      data.date,
      appointmentStartMinutes,
      appointmentEndMinutes,
    );

    const customer = await this.getOrCreateOrUpdateCustomer(data, barbershop.id);

    return this.appointmentRepository.create(
      {
        date: data.date,
        time: data.time,
        totalServiceDuration,
        employeeId: data.employeeId,
        customerId: customer.id,
        serviceIds: data.serviceIds,
      },
      barbershop.id,
    );
  }

  private async getOrCreateOrUpdateCustomer(
    data: CreateCustomerSchema,
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

      return this.customerRepository.update({
        id: customer.id,
        name: data.name,
        phone: data.phone,
        email: data.email,
      });
    }

    return this.customerRepository.create(
      { name: data.name, phone: data.phone, email: data.email },
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

  private convertTimeToMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private validateEmployeeSchedule(
    appointmentDay: Date,
    appointmentStartTime: number,
    appointmentEndTime: number,
    employeeSchedule: EmployeeScheduleWeekday[],
  ) {
    const weekday = appointmentDay.getUTCDay();

    const employeeScheduleWeekday = employeeSchedule.find(
      (schedule) => schedule.weekday === weekday,
    );

    if (!employeeScheduleWeekday || !employeeScheduleWeekday.is_working_day) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }

    const startShift = this.convertTimeToMinutes(
      employeeScheduleWeekday.start!,
    );
    const endShift = this.convertTimeToMinutes(employeeScheduleWeekday.end!);
    const startLunch = this.convertTimeToMinutes(
      employeeScheduleWeekday.startLunch!,
    );
    const endLunch = this.convertTimeToMinutes(
      employeeScheduleWeekday.endLunch!,
    );

    const isOutsideShift =
      appointmentStartTime < startShift || appointmentEndTime > endShift;

    const overlapsWithLunch =
      appointmentStartTime < endLunch && appointmentEndTime > startLunch;

    if (isOutsideShift || overlapsWithLunch) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }
  }

  private async validateNoScheduleConflicts(
    employeeId: number,
    date: Date,
    newStart: number,
    newEnd: number,
  ) {
    const reservedTimesOfDay =
      await this.appointmentRepository.getByDateAndEmployeeId(date, employeeId);

    const hasConflict = reservedTimesOfDay.some((appointment) => {
      const existingStart = this.convertTimeToMinutes(appointment.time);
      const existingEnd = existingStart + appointment.totalServiceDuration;

      return newStart < existingEnd && newEnd > existingStart;
    });

    if (hasConflict) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }
  }
}
