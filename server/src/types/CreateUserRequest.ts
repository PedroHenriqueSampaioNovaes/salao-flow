import { UserSchema, EmployeeSchema } from '@sistema-barbearia/validators';

export type CreateUserRequest = UserSchema & {
  employees: EmployeeSchema[];
};
