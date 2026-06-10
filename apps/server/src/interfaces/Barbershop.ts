export interface CreateBarbershop {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
  phone: string;
  image?: string;
  slug?: string;
}
