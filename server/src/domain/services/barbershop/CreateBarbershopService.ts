import { CreateBarbershopRequest } from '@/src/types/CreateBarbershopRequest.js';

import { BarbershopRepository } from '../../repositories/BarbershopRepository.js';
import { HashRepository } from '../../repositories/HashRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class CreateBarbershopService {
  constructor(
    private barbershopRepository: BarbershopRepository,
    private hashRepository: HashRepository,
  ) {}

  async execute(barbershopData: CreateBarbershopRequest) {
    const barbershopAlreadyExists = await this.barbershopRepository.findByEmail(
      barbershopData.email,
    );

    if (barbershopAlreadyExists) {
      throw new AppError('Este e-mail já está em uso, escolha outro.', 409);
    }

    const hashedPassword = await this.hashRepository.hash(
      barbershopData.password,
    );

    const barbershop = {
      ...barbershopData,
      password: hashedPassword,
    };

    await this.barbershopRepository.create(barbershop);

    return { message: 'Barbearia/Salão cadastrado com sucesso!' };
  }
}
