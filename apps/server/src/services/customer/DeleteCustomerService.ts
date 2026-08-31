import { AppointmentRepository } from '@/src/repositories/AppointmentRepository.js';
import { CustomerRepository } from '@/src/repositories/CustomerRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class DeleteCustomerService {
  async execute(customerId: number, barbershopId: number) {
    const customerRepository = new CustomerRepository();
    const appointmentRepository = new AppointmentRepository();

    const customer = await customerRepository.getById(customerId, barbershopId);
    if (!customer) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    await appointmentRepository.deleteManyByCustomerId(customer.id);
    await customerRepository.delete(customer.id);
  }
}
