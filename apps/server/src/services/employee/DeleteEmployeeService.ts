import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class DeleteEmployeeService {
  async execute(employeeId: number, barbershopId: number) {
    const employeeRepository = new EmployeeRepository();

    const employee = await employeeRepository.getById(employeeId);
    if (!employee) {
      throw new AppError('Funcionário não encontrado ou não existe.', 404);
    }

    if (employee.barbershopId !== barbershopId) {
      throw new AppError(
        'Você não tem permissão para deletar este funcionário.',
        403,
      );
    }

    await employeeRepository.delete(employee.id);
  }
}
