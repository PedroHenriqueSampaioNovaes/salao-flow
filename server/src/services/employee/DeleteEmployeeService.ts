import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';
import { BarbershopRepository } from '@/src/repositories/BarbershopRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class DeleteEmployeeService {
  async execute(employeeId: number, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();
    const barbershopRepository = new BarbershopRepository();

    const barbershop = await barbershopRepository.getById(barbershopId);
    if (!barbershop) throw new AppError('Acesso negado.', 401);

    const employee = await employeeRepository.getByBarbershopAndEmployeeId(
      barbershopId,
      employeeId,
    );
    if (!employee) {
      throw new AppError(
        'Você não tem permissão para editar este funcionário.',
        403,
      );
    }

    await employeeRepository.delete(employee.id);
  }
}
