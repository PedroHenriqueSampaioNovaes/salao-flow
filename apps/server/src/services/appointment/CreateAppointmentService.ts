import { Temporal } from '@js-temporal/polyfill';

import { CreateAppointmentSchema } from '@sistema-barbearia/validators';

import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { ServiceRepository } from '@/src/repositories/ServiceRepository.js';
import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';
import { CustomerRepository } from '@/src/repositories/CustomerRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';
import { ScheduleBlockRepository } from '@/src/repositories/ScheduleBlockRepository.js';

import { AppError } from '@/src/errors/AppError.js';

import { prisma, PrismaClientOrTransaction } from '@/src/lib/prisma.js';

import {
  getEmployeeWorkdaySchedule,
  parseShiftScheduleToMinutes,
  isSlotDuringLunch,
  hasAppointmentConflict,
  EmployeeWithSchedule,
} from '@/src/utils/scheduleHelpers.js';

import { sendMail } from '@/src/lib/resend.js';
import { buildAppointmentDetailsHtml } from '@/src/emails/appointmentEmailTemplates.js';

export class CreateAppointmentService {
  constructor(
    private readonly employeeRepository = new EmployeeRepository(),
    private readonly barbershopRepository = new BarbershopRepository(),
    private readonly scheduleBlockRepository = new ScheduleBlockRepository(),
    private readonly serviceRepository = new ServiceRepository(),
    private readonly appointmentRepository = new AppointmentRepository(),
    private readonly customerRepository = new CustomerRepository(),
  ) {}

  async execute(
    data: CreateAppointmentSchema,
    options?: { isPanelRequest?: boolean },
  ) {
    const isPanelRequest = options?.isPanelRequest ?? false;

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

    const appointmentStartMinutes =
      zonedTargetDate.hour * 60 + zonedTargetDate.minute;
    const appointmentEndMinutes =
      appointmentStartMinutes + totalServiceDuration;

    this.validateEmployeeSchedule(
      zonedTargetDate,
      appointmentStartMinutes,
      appointmentEndMinutes,
      employee,
    );

    const { appointmentCreated, customer } = await prisma.$transaction(
      async (tx) => {
        // Serializa qualquer criação/checagem de conflito para o mesmo
        // funcionário, evitando que duas requisições concorrentes leiam
        // "sem conflito" antes de qualquer uma delas inserir o registro.
        await this.appointmentRepository.acquireEmployeeLock(employee.id, tx);

        await this.checkScheduleBlock(
          instantInitialDateAppointment.toString(),
          instantFinalDateAppointment.toString(),
          barbershop.id,
          employee.id,
          tx,
        );

        await this.checkForAppointmentConflict(
          employee,
          zonedTargetDate,
          appointmentStartMinutes,
          appointmentEndMinutes,
          barbershop.timezone,
          tx,
        );

        const customer = await this.getOrCreateOrUpdateCustomer(
          data,
          barbershop.id,
          isPanelRequest,
          tx,
        );

        const appointmentCreated = await this.appointmentRepository.create(
          {
            dateString: instantInitialDateAppointment.toString(),
            totalServiceDuration,
            employeeId: data.employeeId,
            customerId: customer.id,
            services,
          },
          barbershop.id,
          tx,
        );

        return { appointmentCreated, customer };
      },
    );

    await this.sendConfirmationEmail(
      data.email,
      appointmentCreated.services,
      data.date,
      data.time,
      employee.name,
    );

    if (!isPanelRequest) {
      await this.sendNewAppointmentEmailToBarbershop(
        barbershop.email,
        customer,
        appointmentCreated.services,
        data.date,
        data.time,
        employee.name,
      );
    }

    return { appointment: appointmentCreated, barbershopId: barbershop.id };
  }

  private async sendConfirmationEmail(
    customerEmail: string,
    services: { name: string; price: number }[],
    date: string,
    time: string,
    employeeName: string,
  ) {
    try {
      await sendMail(
        customerEmail,
        'Confirmação de Agendamento',
        `<h1>Agendamento Confirmado</h1>
        <p>Seu agendamento foi realizado com sucesso. Confira os detalhes abaixo:</p>
        ${buildAppointmentDetailsHtml(services, date, time, employeeName)}`,
      );
    } catch (error) {
      console.error('Erro ao enviar e-mail de confirmação:', error);
    }
  }

  private async sendNewAppointmentEmailToBarbershop(
    barbershopEmail: string,
    customer: { name: string; phone: string; email: string | null },
    services: { name: string; price: number }[],
    date: string,
    time: string,
    employeeName: string,
  ) {
    try {
      await sendMail(
        barbershopEmail,
        'Novo Agendamento',
        `<h1>Novo Agendamento Foi Criado</h1>
        <p>Um novo agendamento foi realizado. Confira os detalhes abaixo:</p>
        <p><strong>Cliente:</strong> ${customer.name}</p>
        <p><strong>Telefone:</strong> ${customer.phone}</p>
        <p><strong>Email:</strong> ${customer.email}</p>
        ${buildAppointmentDetailsHtml(services, date, time, employeeName)}`,
      );
    } catch (error) {
      console.error('Erro ao enviar e-mail de novo agendamento:', error);
    }
  }

  private async checkScheduleBlock(
    initialAppointmentDateString: string,
    finalAppointmentDateString: string,
    barbershopId: number,
    employeeId: number,
    client: PrismaClientOrTransaction,
  ) {
    const scheduleBlock =
      await this.scheduleBlockRepository.findByDateRangeAndEmployeeId(
        initialAppointmentDateString,
        finalAppointmentDateString,
        barbershopId,
        employeeId,
        client,
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
    isDashboardRequest: boolean,
    client: PrismaClientOrTransaction,
  ) {
    const customer = await this.customerRepository.getByPhone(
      data.phone,
      barbershopId,
      client,
    );

    if (customer) {
      if (customer.isBlocked) {
        throw new AppError(
          isDashboardRequest
            ? 'Cliente bloqueado.'
            : 'Não foi possível reservar o horário.',
        );
      }

      return this.customerRepository.updateProfileAndVisitCount(
        {
          id: customer.id,
          name: data.name,
          email: data.email,
        },
        client,
      );
    }

    return this.customerRepository.create(
      {
        name: data.name,
        phone: data.phone,
        email: data.email,
        isBlocked: false,
      },
      barbershopId,
      client,
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
    employee: EmployeeWithSchedule,
  ) {
    const employeeScheduleWeekday = getEmployeeWorkdaySchedule(
      employee,
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
    employee: EmployeeWithSchedule,
    zonedDateTime: Temporal.ZonedDateTime,
    newStart: number,
    newEnd: number,
    timezone: string,
    client: PrismaClientOrTransaction,
  ) {
    const employeeScheduleWeekday = getEmployeeWorkdaySchedule(
      employee,
      zonedDateTime,
    );

    if (!employeeScheduleWeekday) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }

    const shift = parseShiftScheduleToMinutes(employeeScheduleWeekday);

    const employeeShiftStart = zonedDateTime.with({
      hour: Math.floor(shift.startShift / 60),
      minute: shift.startShift % 60,
    });

    const employeeShiftEnd = zonedDateTime.with({
      hour: Math.floor(shift.endShift / 60),
      minute: shift.endShift % 60,
    });

    const appointmentsOfDay =
      await this.appointmentRepository.getByEmployeeShiftUtcAndEmployeeId(
        {
          employeeShiftStart: employeeShiftStart.toInstant().toString(),
          employeeShiftEnd: employeeShiftEnd.toInstant().toString(),
        },
        employee.id,
        client,
      );

    const hasConflict = hasAppointmentConflict(
      newStart,
      newEnd,
      appointmentsOfDay,
      timezone,
    );

    if (hasConflict) {
      throw new AppError(
        'Horário indisponível. Escolha outro horário ou atualize a página para obter os dados mais recentes.',
      );
    }
  }
}
