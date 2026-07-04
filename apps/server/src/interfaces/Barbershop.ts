import { CreateBarbershopSchema } from '@sistema-barbearia/validators';

export interface CreateBarbershop extends CreateBarbershopSchema {
  image?: string;
  slug?: string;
}
