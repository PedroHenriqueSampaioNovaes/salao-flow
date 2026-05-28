import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';

export class ListBarbershopEmployeeService {
  async execute(barbershopId: number) {
    const employeeRepository = new EmployeeRepository();

    const employees = await employeeRepository.listByBarbershopId(barbershopId);

    return employees;
  }
}
