import { EmployeeRepository } from '@/src/repositories/EmployeeRepository.js';

export class ListBarbershopEmployeeService {
  async execute(barbershopId: number) {
    const employeeRepository = new EmployeeRepository();

    const employees = await employeeRepository.listByBarbershopId(barbershopId);

    const employeesData = employees.map((employee) => {
      return {
        id: employee.id,
        name: employee.name,
        image: employee.image,
        employeeScheduleId: employee.employeeScheduleId,
        services: employee.services.map((service) => {
          return {
            id: service.id,
            name: service.name,
            price: service.price,
          };
        }),
      };
    });

    return employeesData;
  }
}
