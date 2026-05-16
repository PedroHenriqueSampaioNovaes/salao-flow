import { LoginRequest } from '@sistema-barbearia/validators';

import { BarbershopRepository } from '../../repositories/BarbershopRepository.js';
import { HashRepository } from '../../repositories/HashRepository.js';
import { TokenRepository } from '../../repositories/TokenRepository.js';

import { AppError } from '@/src/errors/AppError.js';

export class LoginBarbershopService {
  constructor(
    private barbershopRepository: BarbershopRepository,
    private hashRepository: HashRepository,
    private tokenRepository: TokenRepository,
  ) {}

  async execute(loginData: LoginRequest) {
    const barbershop = await this.barbershopRepository.findByEmail(
      loginData.email,
    );

    if (!barbershop) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const passwordMatch = await this.hashRepository.compare(
      loginData.password,
      barbershop.password,
    );

    if (!passwordMatch) {
      throw new AppError('E-mail ou senha incorretos.', 401);
    }

    const token = this.tokenRepository.sign({ id: barbershop.id }, '7d');

    return {
      token,
      barbershop: {
        id: barbershop.id,
        name: barbershop.name,
        email: barbershop.email,
        image: barbershop.image,
      },
    };
  }
}
