import { CreateAppointmentSchema } from '@sistema-barbearia/validators';

import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';
import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';
import { CustomerRepository } from '@/src/repositories/CustomerRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';
import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';

import { EmployeeScheduleWeekday } from '@/src/interfaces/Employee.js';

import { AppError } from '@/src/errors/AppError.js';

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

    const initialDateService = data.date;
    const finalDateService = new Date(data.date);
    finalDateService.setMinutes(data.date.getMinutes() + totalServiceDuration);

    await this.checkScheduleBlock(
      initialDateService,
      finalDateService,
      barbershop.id,
      employee.id,
    );

    const appointmentStartMinutes =
      data.date.getUTCHours() * 60 + data.date.getUTCMinutes();
    const appointmentEndMinutes =
      appointmentStartMinutes + totalServiceDuration;

    this.validateEmployeeSchedule(
      data.date,
      appointmentStartMinutes,
      appointmentEndMinutes,
      employee.employeeSchedule.employeeScheduleWeekdays,
    );

    await this.checkForAppointmentConflict(
      data.employeeId,
      data.date,
      appointmentStartMinutes,
      appointmentEndMinutes,
    );

    const customer = await this.getOrCreateOrUpdateCustomer(
      data,
      barbershop.id,
    );

    return this.appointmentRepository.create(
      {
        date: data.date,
        totalServiceDuration,
        employeeId: data.employeeId,
        customerId: customer.id,
        serviceIds: data.serviceIds,
      },
      barbershop.id,
    );
  }

  private async checkScheduleBlock(
    startDate: Date,
    endDate: Date,
    barbershopId: number,
    employeeId: number,
  ) {
    const scheduleBlock =
      await this.scheduleBlockRepository.findByDateRangeAndEmployeeId(
        startDate,
        endDate,
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

  private convertTimeToMinutes(time: string) {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private validateEmployeeSchedule(
    appointmentDate: Date,
    appointmentStartMinutes: number,
    appointmentEndMinutes: number,
    employeeSchedule: EmployeeScheduleWeekday[],
  ) {
    const weekday = appointmentDate.getUTCDay();

    const employeeScheduleWeekday = employeeSchedule.find(
      (schedule) => schedule.weekday === weekday,
    );

    if (!employeeScheduleWeekday || !employeeScheduleWeekday.isWorkingDay) {
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
      appointmentStartMinutes < startShift || appointmentEndMinutes > endShift;

    const overlapsWithLunch =
      appointmentStartMinutes < endLunch && appointmentEndMinutes > startLunch;

    if (isOutsideShift || overlapsWithLunch) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }
  }

  private async checkForAppointmentConflict(
    employeeId: number,
    date: Date,
    newStart: number,
    newEnd: number,
  ) {
    const reservedTimesOfDay =
      await this.appointmentRepository.getByDateAndEmployeeId(date, employeeId);

    const hasConflict = reservedTimesOfDay.some((appointment) => {
      const existingStart =
        appointment.date.getUTCHours() * 60 + appointment.date.getUTCMinutes();
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
