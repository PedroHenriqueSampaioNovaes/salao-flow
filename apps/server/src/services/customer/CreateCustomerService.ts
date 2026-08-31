import { CreateCustomerSchema } from '@sistema-barbearia/validators';

import { CustomerRepository } from '@/src/repositories/CustomerRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class CreateCustomerService {
  async execute(data: CreateCustomerSchema, barbershopId: number) {
    const customerRepository = new CustomerRepository();

    const existingCustomer = await customerRepository.getByPhone(
      data.phone,
      barbershopId,
    );

    if (existingCustomer) throw new AppError('Cliente já é cadastrado.');

    const customer = await customerRepository.create(
      {
        name: data.name,
        phone: data.phone,
        email: data.email,
        isBlocked: data.isBlocked,
      },
      barbershopId,
    );

    return customer;
  }
}
