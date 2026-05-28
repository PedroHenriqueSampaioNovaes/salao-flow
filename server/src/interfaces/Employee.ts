import { UpdateEmployeeSchema } from '@sistema-barbearia/validators';

export interface UpdateEmployeeData extends Partial<
  Omit<UpdateEmployeeSchema, 'id'>
> {
  id: number;
}
