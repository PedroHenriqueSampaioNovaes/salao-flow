import { Barbershop } from '../entities/Barbershop.js';

import { CreateBarbershopRequest } from '@/src/types/CreateBarbershopRequest.js';

export interface BarbershopRepository {
  create(barbershop: CreateBarbershopRequest): Promise<void>;
  findByEmail(email: string): Promise<Barbershop | null>;
  findById(id: number): Promise<Barbershop | null>;
}
