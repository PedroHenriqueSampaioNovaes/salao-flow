import { CreateAppointmentSchema } from '@sistema-barbearia/validators';

import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';
import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';

import { AppError } from '@/src/errors/AppError.js';

interface OperatingTime {
  start: string;
  startLunch: string;
  endLunch: string;
  end: string;
}

export class CreateAppointmentService {
  constructor(
    private readonly employeeRepository = new EmployeeRepository(),
    private readonly serviceRepository = new ServiceRepository(),
    private readonly appointmentRepository = new AppointmentRepository(),
  ) {}

  async execute(data: CreateAppointmentSchema, barbershopId: number) {
    const employee = await this.getAndValidateEmployee(
      data.employeeId,
      barbershopId,
    );

    const services = await this.getAndValidateServices(
      data.serviceIds,
      barbershopId,
    );

    const totalServiceDuration = services.reduce(
      (sum, service) => sum + service.duration,
      0,
    );

    const appointmentStartMinutes = this.convertTimeToMinutes(data.time);
    const appointmentEndMinutes =
      appointmentStartMinutes + totalServiceDuration;

    this.validateWorkingHours(
      appointmentStartMinutes,
      appointmentEndMinutes,
      employee.operatingTime,
    );

    await this.validateNoScheduleConflicts(
      data.employeeId,
      data.date,
      appointmentStartMinutes,
      appointmentEndMinutes,
    );

    return this.appointmentRepository.create(
      {
        name: data.name,
        date: data.date,
        phone: data.phone,
        time: data.time,
        totalServiceDuration,
        employeeId: data.employeeId,
        serviceIds: data.serviceIds,
      },
      barbershopId,
    );
  }

  private async getAndValidateEmployee(
    employeeId: number,
    barbershopId: number,
  ) {
    const employee =
      await this.employeeRepository.getByIdWithOperatingTime(employeeId);

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

  private validateWorkingHours(
    appointmentStart: number,
    appointmentEnd: number,
    operatingTime: OperatingTime,
  ) {
    const startShift = this.convertTimeToMinutes(operatingTime.start);
    const endShift = this.convertTimeToMinutes(operatingTime.end);
    const startLunch = this.convertTimeToMinutes(operatingTime.startLunch);
    const endLunch = this.convertTimeToMinutes(operatingTime.endLunch);

    const isOutsideShift =
      appointmentStart < startShift || appointmentEnd > endShift;

    const overlapsWithLunch =
      appointmentStart < endLunch && appointmentEnd > startLunch;

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
