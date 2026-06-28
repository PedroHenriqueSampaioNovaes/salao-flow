export interface ICustomer {
  id: number;
  name: string;
  email?: string;
  phone: string;
  visitCount: number;
  isBlocked: boolean;
}

export interface ICreateCustomer {
  name: string;
  email?: string;
  phone: string;
}

export interface IUpdateCustomer {
  name?: string;
  email?: string;
  phone?: string;
  isBlocked?: boolean;
}
