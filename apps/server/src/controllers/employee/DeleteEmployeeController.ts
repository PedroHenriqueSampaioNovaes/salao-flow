import { Request, Response } from 'express';

import { DeleteEmployeeService } from '@/src/services/employee/DeleteEmployeeService.js';

export class DeleteEmployeeController {
  static async handle(req: Request, res: Response) {
    const employeeId = req.params.id;
    const barbershopId = req.barbershopId;

    const deleteEmployeeService = new DeleteEmployeeService();

    await deleteEmployeeService.execute(
      Number(employeeId),
      Number(barbershopId),
    );

    return res
      .status(200)
      .json({ message: 'Funcionário excluído com sucesso.' });
  }
}
