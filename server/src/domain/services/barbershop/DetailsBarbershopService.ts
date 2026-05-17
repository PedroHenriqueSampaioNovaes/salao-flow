import { Barbershop } from '../../entities/Barbershop.js';
import { BarbershopRepository } from '../../repositories/BarbershopRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class DetailsBarbershopService {
  constructor(private barbershopRepository: BarbershopRepository) {}

  async execute(barbershopId: number) {
    const barbershop = await this.barbershopRepository.findById(barbershopId);

    if (!barbershop) {
      throw new AppError('Barbearia não encontrada.', 404);
    }

    const publicBarbershop = Barbershop.toPublic(barbershop);

    return publicBarbershop;
  }
}
