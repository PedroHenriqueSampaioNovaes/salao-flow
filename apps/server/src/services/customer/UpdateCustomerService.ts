import { UpdateCustomerSchema } from '@sistema-barbearia/validators';

import { CustomerRepository } from '@/src/repositories/CustomerRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class UpdateCustomerService {
  async execute(data: UpdateCustomerSchema, barbershopId: number) {
    const customerRepository = new CustomerRepository();

    const customer = await customerRepository.getById(data.id, barbershopId);
    if (!customer) {
      throw new AppError('Cliente não encontrado.', 404);
    }

    if (data.phone && data.phone !== customer.phone) {
      const existingCustomer = await customerRepository.getByPhone(
        data.phone,
        barbershopId,
      );
      if (existingCustomer) {
        throw new AppError('Já existe um cliente com este telefone.', 409);
      }
    }

    if (data.email && data.email !== customer.email) {
      const existingCustomer = await customerRepository.getByEmail(
        data.email,
        barbershopId,
      );

      if (existingCustomer) {
        throw new AppError('Este e-mail já está em uso, utilize outro.', 409);
      }
    }

    const updatedCustomer = await customerRepository.update({
      id: data.id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      isBlocked: data.isBlocked,
    });

    return updatedCustomer;
  }
}
