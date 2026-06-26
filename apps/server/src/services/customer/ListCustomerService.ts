import { CustomerRepository } from '@/src/repositories/CustomerRepository.js';

export class ListCustomerService {
  async execute(barbershopId: number) {
    const customerRepository = new CustomerRepository();

    const customers = await customerRepository.listByBarbershopId(barbershopId);

    const customersData = customers.map((customer) => ({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      visitCount: customer.visitCount,
      isBlocked: customer.isBlocked,
    }));

    return customersData;
  }
}
