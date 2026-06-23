export interface IService {
  id: string;
  barbershop_id: number;
  name: string;
  description: string | null;
  price: number;
  duration: number;
  status: boolean;
  assignToAllEmployees: boolean;
  employees: { id: number; name: string }[];
}

export interface ICreateService {
  name: string;
  price: number;
  duration: number;
  status: boolean;
  assignToAllEmployees: boolean;
  employeeIds?: number[];
}
