import { BarbershopSchema, EmployeeSchema } from '@sistema-barbearia/validators';

export type CreateBarbershopRequest = BarbershopSchema & {
  employees: EmployeeSchema[];
};
