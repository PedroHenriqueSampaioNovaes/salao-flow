import { ICustomer } from './customer';
import { IEmployee } from './employee';
import { IService } from './service';

export interface IAppointment {
  id: string;
  date: string;
  customer: Pick<ICustomer, 'id' | 'name' | 'phone'>;
  employee: Pick<IEmployee, 'id' | 'name'>;
  services: Pick<IService, 'name' | 'price'>[];
}
